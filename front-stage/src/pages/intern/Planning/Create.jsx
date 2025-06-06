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
import exportToCSV from "../../../utils/exportToCSV";

// Fonction pour nettoyer les balises HTML
const stripHtmlTags = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

const CreatePlanning = () => {
    const [submitted, setSubmitted] = useState(false);
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
        { name: "Urgent", value: "high" },
        { name: "Secondaire", value: "medium" },
        { name: "Optionnel", value: "low" },
    ];

    const taskStatuses = [
        { name: "À faire", value: "open" },
        { name: "En cours", value: "progressing" },
        { name: "Terminé", value: "completed" },
        { name: "Annulé", value: "cancelled" },
    ];

    // Regex pour les champs
    const titleRegex = /^(?:titre|title):\s*(.+)$/i;
    const startDateRegex = /^(?:date de début|start date):\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/i;
    const endDateRegex = /^(?:date de fin|end date):\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/i;
    const descriptionRegex = /^(?:description|détail):\s*(.+)$/i;
    const taskRegex = /^(?:tâche|task):\s*(.+)$/i;
    const fileExtensionRegex = /\.([a-zA-Z0-9]+)$/;

    // Fonction pour normaliser les chaînes
    const normalizeString = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
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

            // Description
            if ((match = trimmedLine.match(descriptionRegex))) {
                data.description = match[1].trim() || "Description par défaut";
            }

            // Tâche
            if ((match = trimmedLine.match(taskRegex))) {
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
                const priorityText = match[1].toLowerCase();
                if (priorityText === "urgent") currentTask.priority = "high";
                else if (priorityText === "secondaire") currentTask.priority = "medium";
                else if (priorityText === "optionnel") currentTask.priority = "low";
            } else if (currentTask && trimmedLine.toLowerCase().startsWith("priorité:")) {
                const normalizedLine = normalizeString(trimmedLine);
                const normalizedMatch = normalizedLine.match(/^priorite:\s*(urgent|secondaire|optionnel)\s*$/i);
                if (normalizedMatch) {
                    const priorityText = normalizedMatch[1].toLowerCase();
                    if (priorityText === "urgent") currentTask.priority = "high";
                    else if (priorityText === "secondaire") currentTask.priority = "medium";
                    else if (priorityText === "optionnel") currentTask.priority = "low";
                }
            }

            // État de la tâche
            if (currentTask && (match = trimmedLine.match(/^état de la tâche:\s*(à faire|en cours|terminé|annulé)$/i))) {
                const statusText = match[1].toLowerCase();
                if (statusText === "à faire") currentTask.status = "open";
                else if (statusText === "en cours") currentTask.status = "progressing";
                else if (statusText === "terminé") currentTask.status = "completed";
                else if (statusText === "annulé") currentTask.status = "cancelled";
            }
        });

        // Mettre à jour les états globaux
        setTitle(data.title);
        setStartDate(data.startDate || null);
        setEndDate(data.endDate || null);
        setDescription(data.description);

        // Mettre à jour les tâches pour correspondre au nombre détecté
        const updatedTasks = [];
        for (let i = 0; i < Math.max(2, data.tasks.length); i++) {
            updatedTasks.push({
                id: i + 1,
                filled: i < data.tasks.length,
                title: data.tasks[i]?.title || "",
                detail: data.tasks[i]?.detail || "",
                startDate: data.tasks[i]?.startDate || null,
                endDate: data.tasks[i]?.endDate || null,
                priority: data.tasks[i]?.priority || null,
                status: data.tasks[i]?.status || null,
            });
        }
        setTasks(updatedTasks);

        toast.current.show({
            severity: "info",
            summary: "Analyse terminée",
            detail: "Les champs ont été remplis automatiquement.",
            life: 3000,
        });
    };

    const handleAddTask = () => {
        setTasks((prevTasks) => {
            const maxId = Math.max(...prevTasks.map((task) => task.id), 0);
            const newTasks = [
                { id: maxId + 1, filled: true, title: "", detail: "", startDate: null, endDate: null, priority: null, status: null },
                { id: maxId + 2, filled: true, title: "", detail: "", startDate: null, endDate: null, priority: null, status: null },
            ];
            return [...prevTasks, ...newTasks];
        });
    };

    const handleTaskTitleChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, title: value } : task
            )
        );
    };

    const handleTaskDetailChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, detail: value } : task
            )
        );
    };

    const handleTaskStartDateChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, startDate: value } : task
            )
        );
    };

    const handleTaskEndDateChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, endDate: value } : task
            )
        );
    };

    const handleTaskPriorityChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, priority: value.toLowerCase() } : task
            )
        );
    };

    const handleTaskStatusChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: value.toLowerCase() } : task
            )
        );
    };

    const handleSavePlanning = async () => {
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

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const formattedTasks = tasks
            .filter((task) => task.filled && task.title.trim())
            .map((task) => ({
                title: task.title,
                detail: stripHtmlTags(task.detail) || "", // Nettoyer les balises HTML
                start_date: task.startDate ? formatDate(task.startDate) : formatDate(startDate),
                end_date: task.endDate ? formatDate(task.endDate) : formatDate(endDate),
                priority: (task.priority || "medium").toLowerCase(), // Assurer que c'est en minuscules
                status: (task.status || "open").toLowerCase(), // Assurer que c'est en minuscules
            }));

        for (const task of formattedTasks) {
            if (!task.start_date || !task.end_date) {
                toast.current.show({
                    severity: "error",
                    summary: "Erreur",
                    detail: `Veuillez remplir les dates de début et de fin pour la tâche "${task.title}".`,
                    life: 3000,
                });
                return;
            }
        }

        const planningData = {
            title: title,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            tasks: formattedTasks,
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/plannings/create/", planningData, {
                headers: { "Content-Type": "application/json" },
            });
            toast.current.show({
                severity: "success",
                summary: "Enregistré",
                detail: "Le chronogramme et les tâches ont été enregistrés avec succès.",
                life: 3000,
            });

            setTitle("");
            setStartDate(null);
            setEndDate(null);
            setDescription("");
            setFiles([]);
            setTasks([
                { id: 1, filled: true, title: "", detail: "", startDate: null, endDate: null, priority: null, status: null },
                { id: 2, filled: true, title: "", detail: "", startDate: null, endDate: null, priority: null, status: null },
            ]);
            navigate("/intern/planning");
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: `Erreur lors de l'enregistrement: ${error.response?.data?.message || error.message}`,
                life: 3000,
            });
        }
    };

    const handleExportToCSV = () => {
        const exportData = {
            title: title,
            startDate: startDate,
            endDate: endDate,
            description: description,
            tasks: tasks.filter((task) => task.filled && task.title.trim()).map((task) => ({
                title: task.title,
                detail: stripHtmlTags(task.detail), // Nettoyer pour l'export CSV aussi
                startDate: task.startDate,
                endDate: task.endDate,
                priority: task.priority,
                status: task.status,
            })),
        };
        exportToCSV(exportData, `planning_${new Date().toISOString().slice(0, 10)}.csv`);
        toast.current.show({
            severity: "success",
            summary: "Exportation",
            detail: "Les données ont été exportées avec succès en CSV.",
            life: 3000,
        });
    };

    const items = [
        { label: "Planning", command: () => navigate("/intern/planning") },
        { label: "Nouveau", command: () => navigate("/intern/planning/create") },
    ];
    const home = { icon: "pi pi-home" };

    const handleFileUpload = async (event) => {
        const selectedFiles = Array.from(event.target.files || event.dataTransfer.files);
        for (const file of selectedFiles) {
            const match = file.name.match(fileExtensionRegex);
            const extension = match ? match[1].toLowerCase() : null;
            let textContent;

            try {
                switch (extension) {
                    case "txt": textContent = await fileHandlers.handleTxt(file); break;
                    case "docx": textContent = await fileHandlers.handleDocx(file); break;
                    case "pdf": textContent = await fileHandlers.handlePdf(file); break;
                    case "jpg":
                    case "png": textContent = await fileHandlers.handleImage(file); break;
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

    const handleDragOver = (event) => event.preventDefault();
    const handleDrop = (event) => {
        event.preventDefault();
        handleFileUpload(event);
    };

    const pageVariants = { initial: { opacity: 0, y: -10 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -5 } };
    const pageTransition = { duration: 0.5 };

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
                    pt={{ label: { className: "!text-indigo-500" } }}
                />
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <section className="grid grid-cols-3 gap-16 mt-10">
                    <div className="col-span-2">
                        <h1 className="text-gray-800 text-3xl font-bold">Nouveau chronogramme</h1>

                        <div className="mt-8">
                            <div className="flex flex-col space-y-3">
                                <label>
                                    <i className="pi pi-file text-indigo-400 mr-3" /> Titre du chronogramme
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
                                        <i className="pi pi-calendar text-indigo-400 mr-3" /> Date de début
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
                                        <i className="pi pi-calendar text-indigo-400 mr-3" /> Date de fin
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
                                    <i className="pi pi-align-left text-indigo-400 mr-3" /> Ajouter une description
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
                                onClick={handleExportToCSV}
                            />
                            <i className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400" title="Options" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-4">
                        {tasks.map((task) =>
                            task.filled && (
                                <div key={task.id} className="shadow rounded-lg p-6 relative">
                                    <div>
                                        <div className="flex flex-col space-y-3">
                                            <label>
                                                <i className="pi pi-file text-indigo-400 mr-3" /> Intitulé
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
                                                <i className="pi pi-align-left text-indigo-400 mr-3" /> Détail
                                            </label>
                                            <Editor
                                                value={task.detail}
                                                onTextChange={(e) =>
                                                    handleTaskDetailChange(task.id, e.htmlValue)
                                                }
                                                className="h-64 text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 mt-20">
                                            <div className="flex flex-col space-y-3">
                                                <label>
                                                    <i className="pi pi-calendar text-indigo-400 mr-3" /> Date de début
                                                </label>
                                                <Calendar
                                                    size="small"
                                                    className="w-full"
                                                    value={task.startDate}
                                                    onChange={(e) =>
                                                        handleTaskStartDateChange(task.id, e.value)
                                                    }
                                                    dateFormat="yy-mm-dd"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-3">
                                                <label>
                                                    <i className="pi pi-calendar text-indigo-400 mr-3" /> Date de fin
                                                </label>
                                                <Calendar
                                                    size="small"
                                                    className="w-full"
                                                    value={task.endDate}
                                                    onChange={(e) =>
                                                        handleTaskEndDateChange(task.id, e.value)
                                                    }
                                                    dateFormat="yy-mm-dd"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <div className="flex flex-col space-y-3">
                                                <label>
                                                    <i className="pi pi-exclamation-circle text-indigo-400 mr-3" /> Priorité
                                                </label>
                                                <Dropdown
                                                    value={task.priority}
                                                    onChange={(e) =>
                                                        handleTaskPriorityChange(task.id, e.value)
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
                                                    <i className="pi pi-hourglass text-indigo-400 mr-3" /> État de la tâche
                                                </label>
                                                <Dropdown
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        handleTaskStatusChange(task.id, e.value)
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
                                                <i className="pi pi-link text-indigo-400 mr-3" /> Pièces jointes
                                            </label>
                                            <FileUpload
                                                mode="basic"
                                                name="demo[]"
                                                maxFileSize={1000000}
                                                chooseLabel="Choisir un fichier"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </section>

                <section className="mt-16 flex justify-end items-center gap-x-8">
                    <Button
                        label="Annuler"
                        className="!bg-gray-200 hover:!bg-gray-300 !border-none !text-gray-700 mr-4"
                        onClick={() => navigate("/intern/planning")}
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
                            <p>{endDate ? endDate.toLocaleDateString() : "Non défini"}</p>
                        </div>
                        <div className="grid grid-cols-[25%_75%] gap-6 mt-2">
                            <h5 className="text-indigo-500 font-semibold">Date de début</h5>
                            <p>{startDate ? startDate.toLocaleDateString() : "Non défini"}</p>
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
                            onClick={handleSavePlanning}
                        />
                    </Dialog>
                </section>
            </form>
        </motion.div>
    );
};

export default CreatePlanning;