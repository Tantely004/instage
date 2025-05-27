/* eslint-disable no-unused-vars */
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { InputText } from "primereact/inputtext"
import { Calendar } from "primereact/calendar"
import { InputTextarea } from "primereact/inputtextarea"
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { Editor } from 'primereact/editor'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { useNavigate } from "react-router-dom"

const CreatePlanning = () => {
    const [submitted, setSubmitted] = useState(false)
    const [selectedSeverity, setSelectedSeverity] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [tasks, setTasks] = useState([
        { id: 1, filled: true, title: "" },
        { id: 2, filled: true, title: "" },
    ])
    const [files, setFiles] = useState([])
    const toast = useRef(null)
    const navigate = useNavigate()

    const severities = [
        { name: 'Urgent', value: 'urgent' },
        { name: 'Secondaire', value: 'secondary' },
        { name: 'Optionnel', value: 'optional' },
    ]

    const taskStatuses = [
        { name: 'À faire', value: 'todo' },
        { name: 'En cours', value: 'in-progress' },
        { name: 'Terminé', value: 'done' },
        { name: 'Annulé', value: 'cancelled' },
    ]

    const handleAddTask = () => {
        setTasks(prevTasks => {
            const index = prevTasks.findIndex(task => !task.filled)
            if (index !== -1) {
                const updatedTasks = [...prevTasks]
                updatedTasks[index].filled = true
                return updatedTasks
            } else {
                toast.current.show({ 
                    severity: 'warn', 
                    summary: 'Limite atteinte', 
                    detail: 'Toutes les tâches disponibles sont remplies.', 
                    life: 3000 
                })
            }
            return prevTasks
        })
    }

    const handleTaskTitleChange = (taskId, value) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId ? { ...task, title: value } : task
            )
        )
    }

    const handleSavePlanning = () => {
        const hasEmptyTitles = tasks.some(task => task.filled && !task.title.trim())
        if (hasEmptyTitles) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erreur', 
                detail: 'Veuillez remplir tous les titres des tâches.', 
                life: 3000 
            })
            return
        }
        toast.current.show({ 
            severity: 'success', 
            summary: 'Enregistré', 
            detail: 'Le chronogramme a été enregistré avec succès.', 
            life: 3000 
        })
    }

    const items = [
        { 
            label: 'Planning',
            command: () => navigate('/intern/planning')
        },
        { 
            label: 'Nouveau',
            command: () => navigate('/intern/planning/create')
        }, 
    ]
    const home = { 
        icon: 'pi pi-home', 
    }

    const handleFileUpload = (event) => {
        const selectedFiles = Array.from(event.target.files || event.dataTransfer.files)
        setFiles(prevFiles => [...prevFiles, ...selectedFiles])
        toast.current.show({ 
            severity: 'info', 
            summary: 'Fichier chargé', 
            detail: 'Les fichiers ont été ajoutés avec succès.', 
            life: 3000 
        })
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        handleFileUpload(event)
    }

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

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
                        label: { className: '!text-indigo-500' },
                    }}
                />
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <section className="grid grid-cols-3 gap-16 mt-10">
                    <div className="col-span-2">
                        <h1 className="text-gray-800 text-3xl font-bold">
                            Nouveau chronogramme
                        </h1>

                        <div className="mt-8">
                            <div className="flex flex-col space-y-3">
                                <label>
                                    <i className="pi pi-file text-indigo-400 mr-3"/>
                                    Titre du chronogramme
                                </label>
                                <InputText
                                    size="small"
                                    className="w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-4">
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-calendar text-indigo-400 mr-3"/>
                                        Date de début
                                    </label>
                                    <Calendar
                                        size="small"
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <label>
                                        <i className="pi pi-calendar text-indigo-400 mr-3"/>
                                        Date de fin
                                    </label>
                                    <Calendar
                                        size="small"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3 mt-4">
                                <label>
                                    <i className="pi pi-align-left text-indigo-400 mr-3"/>
                                    Ajouter une description 
                                </label>
                                <InputTextarea
                                    rows={5}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 shadow rounded-lg p-8">
                        <h2 className="text-xl font-semibold text-indigo-500">
                            Importer un fichier
                        </h2>
                        <p className="mt-2">
                            Créez facilement votre chronogramme à partir des fichiers téléchargés à partir de notre système OCR
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
                        <h2 className="text-2xl font-bold text-indigo-500">
                            Organiser les tâches
                        </h2>
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
                                            <label><i className="pi pi-file text-indigo-400 mr-3"/>Intitulé</label>
                                            <InputText 
                                                size="small" 
                                                className="w-full" 
                                                value={task.title}
                                                onChange={(e) => handleTaskTitleChange(task.id, e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-3 mt-4">
                                            <label><i className="pi pi-align-left text-indigo-400 mr-3"/>Détail</label>
                                            <Editor className="h-64 text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 mt-20">
                                            <div className="flex flex-col space-y-3">
                                                <label><i className="pi pi-calendar text-indigo-400 mr-3"/>Date de début</label>
                                                <Calendar size="small" className="w-full" />
                                            </div>
                                            <div className="flex flex-col space-y-3">
                                                <label><i className="pi pi-calendar text-indigo-400 mr-3"/>Date de fin</label>
                                                <Calendar size="small" className="w-full" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <div className="flex flex-col space-y-3">
                                                <label><i className="pi pi-exclamation-circle text-indigo-400 mr-3"/>Priorité</label>
                                                <Dropdown 
                                                    value={selectedSeverity} 
                                                    onChange={(e) => setSelectedSeverity(e.value)} 
                                                    options={severities} 
                                                    optionLabel="name" 
                                                    optionValue="value" 
                                                    placeholder="Sélectionner" 
                                                    className="w-full" 
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-3">
                                                <label><i className="pi pi-hourglass text-indigo-400 mr-3"/>État de la tâche</label>
                                                <Dropdown 
                                                    value={selectedStatus} 
                                                    onChange={(e) => setSelectedStatus(e.value)} 
                                                    options={taskStatuses} 
                                                    optionLabel="name" 
                                                    optionValue="value" 
                                                    placeholder="Sélectionner" 
                                                    className="w-full" 
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-3 mt-4">
                                            <label><i className="pi pi-link text-indigo-400 mr-3"/>Pièces jointes</label>
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
                                            Veuillez cliquer sur le bouton <strong>"Ajouter"</strong> pour remplir cette tâche.
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
                        onHide={() => {if (!submitted) return; setSubmitted(false); }}
                    >
                        <p>
                        Vérifier votre chronogramme avant de le soumettre. Assurez-vous que toutes les informations sont correctes et complètes.
                        </p>

                        <div className="grid grid-cols-[25%_75%] gap-6 mt-8">
                            <h5 className="text-indigo-500 font-semibold">
                                Titre
                            </h5>
                            <p>
                                Nouveau chronogramme 1
                            </p>
                        </div>
                        <div className="grid grid-cols-[25%_75%] gap-6 mt-2">
                            <h5 className="text-indigo-500 font-semibold">
                               Date de fin
                            </h5>
                            <p>
                                09/06/2025
                            </p>
                        </div>
                        <div className="grid grid-cols-[25%_75%] gap-6 mt-2">
                            <h5 className="text-indigo-500 font-semibold">
                               Date de début
                            </h5>
                            <p>
                                09/06/2025
                            </p>
                        </div>
                        <div className="grid grid-cols-[25%_75%] gap-6 mt-2">
                            <h5 className="text-indigo-500 font-semibold">
                               Tâches
                            </h5>
                            <p>
                                12
                            </p>
                        </div>

                        <div className="mt-8 text-sm">
                            <i className="pi pi-exclamation-circle text-indigo-400 mr-3"/>
                            Votre encadreur recevra ce chronogramme et pourra le modifier si nécessaire. Soyez sûr que toutes les informations sont correctes avant de le soumettre.
                        </div>

                        <Button
                            label="Soumettre"
                            className="!mt-8 !w-full !flex !justify-center !items-center !bg-indigo-500 hover:!bg-indigo-600 !border-none text-white"
                        />
                    </Dialog>
                </section>
            </form>
        </motion.div>
    )
}

export default CreatePlanning