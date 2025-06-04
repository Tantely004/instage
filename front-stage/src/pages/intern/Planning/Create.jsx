/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist";
import axios from "axios";

const CreatePlanning = () => {
    const [submitted, setSubmitted] = useState(false);
    const [selectedSeverity, setSelectedSeverity] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [tasks, setTasks] = useState([
        { id: 1, filled: true, title: "", detail: "", startDate: null, endDate: null, priority: null, status: null },
        { id: 2, filled: true, title: "", detail: "", startDate: null, endDate: null, priority: null, status: null },
    ]);
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [description, setDescription] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const severities = [
        { name: "Urgent", value: "urgent" },
        { name: "Secondaire", value: "secondaire" },
        { name: "Optionnel", value: "optionnel" },
    ];

    const taskStatuses = [
        { name: "À faire", value: "todo" },
        { name: "En cours", value: "in-progress" },
        { name: "Terminé", value: "done" },
        { name: "Annulé", value: "cancelled" },
    ];

    // Regex pour les champs
    const titleRegex = /^(?:titre|title):\s*(.+)$/i;
    const startDateRegex = /^(?:date de début|start date):\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/i;
    const endDateRegex = /^(?:date de fin|end date):\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/i;
    const descriptionRegex = /^(?:description|détail):\s*(.+)$/i;
    const taskRegex = /^(?:tâche|task):\s*(.+)$/i;
    const fileExtensionRegex = /\.([a-zA-Z0-9]+)$/;

    // Fonction pour normaliser les chaînes (accents, espaces insécables, etc.)
    const normalizeString = (str) => {
        return str
            .normalize("NFD") // Décomposer les caractères (ex: "é" devient "e" + accent)
            .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
            .replace(/\s+/g, " ") // Remplacer les espaces multiples par un seul espace
            .trim(); // Supprimer les espaces en début et fin
    };

    // Fonctions pour gérer les uploads par type de fichier
    const fileHandlers = {
        async handleTxt(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        },
        async handleDocx(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const arrayBuffer = e.target.result;
                    mammoth.extractRawText({ arrayBuffer })
                        .then((result) => resolve(result.value))
                        .catch((error) => reject(error));
                };
                reader.onerror = (error) => reject(error);
                reader.readAsArrayBuffer(file);
            });
        },
        async handlePdf(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const arrayBuffer = e.target.result;
                    const pdf = await getDocument({ data: arrayBuffer }).promise;
                    let text = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map((item) => item.str).join(" ");
                    }
                    resolve(text);
                };
                reader.onerror = (error) => reject(error);
                reader.readAsArrayBuffer(file);
            });
        },
        async handleImage(file) {
            return new Promise((resolve, reject) => {
                Tesseract.recognize(file, "fra", {
                    logger: (info) => console.log(info),
                })
                    .then((result) => resolve(result.data.text))
                    .catch((error) => reject(error));
            });
        },
    };

    // Fonction pour remplir les champs automatiquement avec regex
    const fillFieldsFromText = (text) => {
        const lines = text.split("\n").filter((line) => line.trim());
        const data = {
            title: "",
            startDate: null,
            endDate: null,
            description: "",
            tasks: [],
        };

        let currentTask = null;
        let hasEncounteredTask = false;

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            let match;

            // Titre
            if ((match = trimmedLine.match(titleRegex))) {
                data.title = match[1].trim() || "Nouveau chronogramme";
            }

            // Date de début globale
            if ((match = trimmedLine.match(startDateRegex))) {
                const dateStr = match[1].trim();
                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    data.startDate = new Date(dateStr);
                } else if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                    const [day, month, year] = dateStr.split("/");
                    data.startDate = new Date(`${year}-${month}-${day}`);
                }
            }

            // Date de fin globale
            if ((match = trimmedLine.match(endDateRegex))) {
                const dateStr = match[1].trim();
                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    data.endDate = new Date(dateStr);
                } else if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                    const [day, month, year] = dateStr.split("/");
                    data.endDate = new Date(`${year}-${month}-${day}`);
                }
            }

            // Description (uniquement avant la première tâche)
            if (!hasEncounteredTask && (match = trimmedLine.match(descriptionRegex))) {
                data.description = match[1].trim() || "Description par défaut";
            }

            // Tâche
            if ((match = trimmedLine.match(taskRegex))) {
                hasEncounteredTask = true;
                currentTask = { title: match[1].trim(), detail: "", startDate: null, endDate: null, priority: null, status: null };
                data.tasks.push(currentTask);
            }

            // Détail de la tâche
            if (currentTask && (match = trimmedLine.match(/^détail:\s*(.+)$/i))) {
                currentTask.detail = match[1].trim();
            }

            // Date de début de la tâche
            if (currentTask && (match = trimmedLine.match(/^date de début:\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/i))) {
                const dateStr = match[1].trim();
                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    currentTask.startDate = new Date(dateStr);
                } else if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                    const [day, month, year] = dateStr.split("/");
                    currentTask.startDate = new Date(`${year}-${month}-${day}`);
                }
            }

            // Date de fin de la tâche
            if (currentTask && (match = trimmedLine.match(/^date de fin:\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/i))) {
                const dateStr = match[1].trim();
                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    currentTask.endDate = new Date(dateStr);
                } else if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                    const [day, month, year] = dateStr.split("/");
                    currentTask.endDate = new Date(`${year}-${month}-${day}`);
                }
            }

            // Priorité de la tâche
            if (currentTask && (match = trimmedLine.match(/^priorité:\s*(urgent|secondaire|optionnel)\s*$/i))) {
                const priorityValue = match[1].toLowerCase();
                console.log(`Priorité détectée: "${match[1]}" -> "${priorityValue}" pour la tâche "${currentTask.title}"`);
                currentTask.priority = priorityValue;
            } else if (currentTask && trimmedLine.toLowerCase().startsWith("priorité:")) {
                // Normalisation pour gérer les accents et caractères spéciaux
                const normalizedLine = normalizeString(trimmedLine);
                console.log(`Ligne priorité non reconnue: "${trimmedLine}" (normalisée: "${normalizedLine}")`);
                const normalizedMatch = normalizedLine.match(/^priorite:\s*(urgent|secondaire|optionnel)\s*$/i);
                if (normalizedMatch) {
                    const priorityValue = normalizedMatch[1].toLowerCase();
                    console.log(`Priorité détectée après normalisation: "${normalizedMatch[1]}" -> "${priorityValue}" pour la tâche "${currentTask.title}"`);
                    currentTask.priority = priorityValue;
                } else {
                    console.log(`Priorité toujours non reconnue après normalisation: "${normalizedLine}"`);
                }
            }

            // État de la tâche
            if (currentTask && (match = trimmedLine.match(/^état de la tâche:\s*(à faire|en cours|terminé|annulé)$/i))) {
                const statusText = match[1].toLowerCase();
                if (statusText === "à faire") {
                    currentTask.status = "todo";
                } else if (statusText === "en cours") {
                    currentTask.status = "in-progress";
                } else if (statusText === "terminé") {
                    currentTask.status = "done";
                } else if (statusText === "annulé") {
                    currentTask.status = "cancelled";
                }
            }
        });

        // Journalisation pour vérifier les tâches détectées
        console.log("Tâches détectées:", JSON.stringify(data.tasks, null, 2));

        // Mettre à journalisation des tâches avant la mise à jour
        console.log("État des tâches avant mise à jour:", JSON.stringify(tasks, null, 2));

        // Mettre à jour les états globaux
        setTitle(data.title);
        setStartDate(data.startDate || null);
        setEndDate(data.endDate || null);
        setDescription(data.description);

        // Mettre à jour les tâches
        const updatedTasks = tasks.map((task, index) => {
            if (index < data.tasks.length && task.filled) {
                const updatedTask = {
                    ...task,
                    title: data.tasks[index].title || task.title,
                    detail: data.tasks[index].detail || task.detail,
                    startDate: data.tasks[index].startDate || task.startDate,
                    endDate: data.tasks[index].endDate || task.endDate,
                    priority: data.tasks[index].priority || task.priority,
                    status: data.tasks[index].status || task.status,
                };
                console.log(`Tâche ${task.id} mise à jour:`, JSON.stringify(updatedTask, null, 2));
                return updatedTask;
            }
            return task;
        });
        setTasks(updatedTasks);

        // Journalisation pour vérifier l'état final des tâches
        console.log("État final des tâches après mise à jour:", JSON.stringify(updatedTasks, null, 2));

        toast.current.show({
            severity: "info",
            summary: "Analyse terminée",
            detail: "Les champs ont été remplis automatiquement.",
            life: 3000,
        });
    };

    const handleAddTask = () => {
        setTasks((prevTasks) => {
            const index = prevTasks.findIndex((task) => !task.filled);
            if (index !== -1) {
                const updatedTasks = [...prevTasks];
                updatedTasks[index].filled = true;
                return updatedTasks;
            } else {
                toast.current.show({
                    severity: "warn",
                    summary: "Limite atteinte",
                    detail: "Toutes les tâches disponibles sont remplies.",
                    life: 3000,
                });
            }
            return prevTasks;
        });
    };

    const handleTaskTitleChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, title: value } : task
            )
        );
    };

    const handleSavePlanning = async () => {
        // Validation des champs obligatoires
        if (!title.trim()) {
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: "Veuillez remplir le titre du chronogramme.",
                life: 3000,
            });
            return;
        }

        if (!startDate || !endDate) {
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: "Veuillez remplir les dates de début et de fin.",
                life: 3000,
            });
            return;
        }

        // Formatter les dates en AAAA-MM-JJ
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        // Étape 1 : Uploader le fichier s'il existe
        let documentId = null;
        if (files.length > 0) {
            const file = files[0]; // On prend le premier fichier uploadé
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", file.name);
            const match = file.name.match(fileExtensionRegex);
            const extension = match ? match[1].toLowerCase() : "unknown";
            formData.append("type", extension);

            try {
                const response = await axios.post("/api/documents/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                documentId = response.data.id; // Récupérer l'ID du document créé
                toast.current.show({
                    severity: "info",
                    summary: "Fichier uploadé",
                    detail: "Le fichier a été uploadé avec succès.",
                    life: 3000,
                });
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Erreur d'upload",
                    detail: `Erreur lors de l'upload du fichier: ${error.message}`,
                    life: 3000,
                });
                return;
            }
        }

        // Étape 2 : Créer le Planning
        const planningData = {
            title: title,
            project: 1, // Projet par défaut (id=1), à ajuster selon ton backend
            description: description || null,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
        };

        try {
            const response = await axios.post("/api/plannings/", planningData);
            toast.current.show({
                severity: "success",
                summary: "Enregistré",
                detail: "Le chronogramme a été enregistré avec succès.",
                life: 3000,
            });

            // Redirection ou réinitialisation des champs après succès
            setTitle("");
            setStartDate(null);
            setEndDate(null);
            setDescription("");
            setFiles([]);
            navigate("/intern/planning"); // Redirection vers la liste des plannings
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: `Erreur lors de l'enregistrement: ${error.response?.data?.detail || error.message}`,
                life: 3000,
            });
        }
    };

    const items = [
        {
            label: "Planning",
            command: () => navigate("/intern/planning"),
        },
        {
            label: "Nouveau",
            command: () => navigate("/intern/planning/create"),
        },
    ];
    const home = {
        icon: "pi pi-home",
    };

    const handleFileUpload = async (event) => {
        const selectedFiles = Array.from(event.target.files || event.dataTransfer.files);
        for (const file of selectedFiles) {
            const match = file.name.match(fileExtensionRegex);
            const extension = match ? match[1].toLowerCase() : null;
            let textContent;

            try {
                switch (extension) {
                    case "txt":
                        textContent = await fileHandlers.handleTxt(file);
                        break;
                    case "docx":
                        textContent = await fileHandlers.handleDocx(file);
                        break;
                    case "pdf":
                        textContent = await fileHandlers.handlePdf(file);
                        break;
                    case "jpg":
                    case "png":
                        textContent = await fileHandlers.handleImage(file);
                        break;
                    default:
                        toast.current.show({
                            severity: "error",
                            summary: "Format non pris en charge",
                            detail: `Le format ${extension ? "." + extension : "inconnu"} n'est pas supporté.`,
                            life: 3000,
                        });
                        continue;
                }

                fillFieldsFromText(textContent);
                setFiles((prevFiles) => [...prevFiles, file]);
                toast.current.show({
                    severity: "info",
                    summary: "Fichier chargé",
                    detail: `Le fichier ${file.name} a été analysé avec succès.`,
                    life: 3000,
                });
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Erreur d'analyse",
                    detail: `Erreur lors de l'analyse de ${file.name}: ${error.message}`,
                    life: 3000,
                });
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        handleFileUpload(event);
    };

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    };

    const pageTransition = {
        duration: 0.5,
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 mb-16"
        >
            <Toast ref={toast} />
            <div>
                <BreadCrumb
                    model={items}
                    home={home}
                    className="!font-semibold !text-sm !bg-transparent !border-0 !p-0"
                    pt={{
                        label: { className: "!text-indigo-500" },
                    }}
                />
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <section className="grid grid-cols-3 gap-16 mt-10">
                    <div className="col-span-2">
                        <h1 className="text-gray-800 text-3xl font-bold">Nouveau chronogramme</h1>

                        <div className="mt-8">
                            <div className="flex flex-col space-y-3">
                                <label>
                                    <i className="pi pi-file text-indigo-400 mr-3" />
                                    Titre du chronogramme
                                </label>
                                <InputText
                                    size="small"
                                    className="w-full"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-4">
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-calendar text-indigo-400 mr-3" />
                                        Date de début
                                    </label>
                                    <Calendar
                                        size="small"
                                        className="w-full"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.value)}
                                        dateFormat="yy-mm-dd"
                                    />
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-calendar text-indigo-400 mr-3" />
                                        Date de fin
                                    </label>
                                    <Calendar
                                        size="small"
                                        className="w-full"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.value)}
                                        dateFormat="yy-mm-dd"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3 mt-4">
                                <label>
                                    <i className="pi pi-align-left text-indigo-400 mr-3" />
                                    Ajouter une description
                                </label>
                                <InputTextarea
                                    rows={5}
                                    className="w-full"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 shadow rounded-lg p-8">
                        <h2 className="text-xl font-semibold text-indigo-500">Importer un fichier</h2>
                        <p className="mt-2">
                            Créez facilement votre chronogramme à partir des fichiers téléchargés à partir de notre
                            système OCR
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05, backgroundColor: "#f0f4ff" }}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="mt-6 h-48 border border-dashed border-gray-400 rounded-lg p-8 cursor-pointer transition-colors"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <div className="flex flex-col items-center justify-center h-full m-auto">
                                <i className="pi pi-upload text-2xl font-bold text-indigo-500" />
                                <p className="mt-5 text-sm text-center">
                                    Cliquer pour télécharger un fichier ou glisser-déposer ici
                                </p>
                                <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </motion.div>

                        {files.length > 0 && (
                            <motion.ul
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-4 space-y-2"
                            >
                                {files.map((file, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="text-sm text-gray-700 flex items-center"
                                    >
                                        <i className="pi pi-file text-indigo-500 mr-2" />
                                        {file.name}
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </div>
                </section>

                <section className="mt-20">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-indigo-500">Organiser les tâches</h2>
                        <div className="flex justify-end items-center gap-8">
                            <Button
                                icon="pi pi-plus"
                                label="Ajouter"
                                size="small"
                                onClick={handleAddTask}
                            />
                            <Button
                                icon="pi pi-save"
                                label="Enregistrer"
                                size="small"
                                className="!bg-gray-700 hover:!bg-gray-800 !border-none text-white"
                                onClick={handleSavePlanning}
                            />
                            <i
                                className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400"
                                title="Options"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-4">
                        {tasks.map((task, index) => (
                            <div key={task.id} className="shadow rounded-lg p-6 relative">
                                {task.filled ? (
                                    <div>
                                        <div className="flex flex-col space-y-3">
                                            <label>
                                                <i className="pi pi-file text-indigo-400 mr-3" />
                                                Intitulé
                                            </label>
                                            <InputText
                                                size="small"
                                                className="w-full"
                                                value={task.title}
                                                onChange={(e) => handleTaskTitleChange(task.id, e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-3 mt-4">
                                            <label>
                                                <i className="pi pi-align-left text-indigo-400 mr-3" />
                                                Détail
                                            </label>
                                            <Editor
                                                value={task.detail}
                                                onTextChange={(e) =>
                                                    setTasks((prevTasks) =>
                                                        prevTasks.map((t) =>
                                                            t.id === task.id ? { ...t, detail: e.htmlValue } : t
                                                        )
                                                    )
                                                }
                                                className="h-64 text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 mt-20">
                                            <div className="flex flex-col space-y-3">
                                                <label>
                                                    <i className="pi pi-calendar text-indigo-400 mr-3" />
                                                    Date de début
                                                </label>
                                                <Calendar
                                                    size="small"
                                                    className="w-full"
                                                    value={task.startDate}
                                                    onChange={(e) =>
                                                        setTasks((prevTasks) =>
                                                            prevTasks.map((t) =>
                                                                t.id === task.id ? { ...t, startDate: e.value } : t
                                                            )
                                                        )
                                                    }
                                                    dateFormat="yy-mm-dd"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-3">
                                                <label>
                                                    <i className="pi pi-calendar text-indigo-400 mr-3" />
                                                    Date de fin
                                                </label>
                                                <Calendar
                                                    size="small"
                                                    className="w-full"
                                                    value={task.endDate}
                                                    onChange={(e) =>
                                                        setTasks((prevTasks) =>
                                                            prevTasks.map((t) =>
                                                                t.id === task.id ? { ...t, endDate: e.value } : t
                                                            )
                                                        )
                                                    }
                                                    dateFormat="yy-mm-dd"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <div className="flex flex-col space-y-3">
                                                <label>
                                                    <i className="pi pi-exclamation-circle text-indigo-400 mr-3" />
                                                    Priorité
                                                </label>
                                                <Dropdown
                                                    value={task.priority}
                                                    onChange={(e) =>
                                                        setTasks((prevTasks) =>
                                                            prevTasks.map((t) =>
                                                                t.id === task.id ? { ...t, priority: e.value } : t
                                                            )
                                                        )
                                                    }
                                                    options={severities}
                                                    optionLabel="name"
                                                    optionValue="value"
                                                    placeholder="Sélectionner"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-3">
                                                <label>
                                                    <i className="pi pi-hourglass text-indigo-400 mr-3" />
                                                    État de la tâche
                                                </label>
                                                <Dropdown
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        setTasks((prevTasks) =>
                                                            prevTasks.map((t) =>
                                                                t.id === task.id ? { ...t, status: e.value } : t
                                                            )
                                                        )
                                                    }
                                                    options={taskStatuses}
                                                    optionLabel="name"
                                                    optionValue="value"
                                                    placeholder="Sélectionner"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-3 mt-4">
                                            <label>
                                                <i className="pi pi-link text-indigo-400 mr-3" />
                                                Pièces jointes
                                            </label>
                                            <FileUpload
                                                mode="basic"
                                                name="demo[]"
                                                maxFileSize={1000000}
                                                chooseLabel="Choisir un fichier"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col justify-center items-center text-gray-400">
                                        <p>Tâche vide</p>
                                        <p className="text-center mt-4 text-sm">
                                            Veuillez cliquer sur le bouton <strong>"Ajouter"</strong> pour remplir cette
                                            tâche.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16 flex justify-end items-center gap-x-8">
                    <Button
                        label="Annuler"
                        className="!bg-gray-200 hover:!bg-gray-300 !border-none !text-gray-700 mr-4"
                    />
                    <Button
                        label="Valider"
                        onClick={() => setSubmitted(true)}
                    />

                    <Dialog
                        header="Votre chronogramme"
                        modal
                        visible={submitted}
                        className="w-[36rem] !font-poppins"
                        onHide={() => {
                            if (!submitted) return;
                            setSubmitted(false);
                        }}
                    >
                        <p>
                            Vérifier votre chronogramme avant de le soumettre. Assurez-vous que toutes les informations
                            sont correctes et complètes.
                        </p>

                        <div className="grid grid-cols-[25%_75%] gap-6 mt-8">
                            <h5 className="text-indigo-500 font-semibold">Titre</h5>
                            <p>{title || "Nouveau chronogramme 1"}</p>
                        </div>
                        <div className="grid grid-cols-[25%_75%] gap-6 mt-2">
                            <h5 className="text-indigo-500 font-semibold">Date de fin</h5>
                            <p>{endDate ? endDate.toLocaleDateString() : "09/06/2025"}</p>
                        </div>
                        <div className="grid grid-cols-[25%_75%] gap-6 mt-2">
                            <h5 className="text-indigo-500 font-semibold">Date de début</h5>
                            <p>{startDate ? startDate.toLocaleDateString() : "09/06/2025"}</p>
                        </div>
                        <div className="grid grid-cols-[25%_75%] gap-6 mt-2">
                            <h5 className="text-indigo-500 font-semibold">Tâches</h5>
                            <p>{tasks.filter((t) => t.filled && t.title.trim()).length}</p>
                        </div>

                        <div className="mt-8 text-sm">
                            <i className="pi pi-exclamation-circle text-indigo-400 mr-3" />
                            Votre encadreur recevra ce chronogramme et pourra le modifier si nécessaire. Soyez sûr que
                            toutes les informations sont correctes avant de le soumettre.
                        </div>

                        <Button
                            label="Soumettre"
                            className="!mt-8 !w-full !flex !justify-center !items-center !bg-indigo-500 hover:!bg-indigo-600 !border-none text-white"
                        />
                    </Dialog>
                </section>
            </form>
        </motion.div>
    );
};

export default CreatePlanning;