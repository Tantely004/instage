/* eslint-disable no-unused-vars */
import { useState } from "react"
import { motion } from "framer-motion"
import { InputText } from "primereact/inputtext"
import { Calendar } from "primereact/calendar"
import { InputTextarea } from "primereact/inputtextarea"
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { Editor } from 'primereact/editor'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload'
import { useNavigate } from "react-router-dom"

const CreatePlanning = () => {
    const [ selectedSeverity, setSelectedSeverity ] = useState(null)
    const [ selectedStatus, setSelectedStatus ] = useState(null)
    const navigate = useNavigate()

    const severities = [
        { name: 'Urgent', value: 'urgent' },
        { name: 'Secondaire', code: 'secondary' },
        { name: 'Optionnel', code: 'optional' },
    ]

    const taskStatuses = [
        { name: 'À faire', value: 'todo' },
        { name: 'En cours', value: 'in-progress' },
        { name: 'Terminé', value: 'done' },
        { name: 'Annulé', value: 'cancelled' },
    ]

    const [tasks, setTasks] = useState([
        { id: 1, filled: true },
        { id: 2, filled: false },
        { id: 3, filled: false }
    ])

    const handleAddTask = () => {
        setTasks(prevTasks => {
            const index = prevTasks.findIndex(task => !task.filled)
            if (index !== -1) {
                const updatedTasks = [...prevTasks]
                updatedTasks[index].filled = true
                return updatedTasks
            }
            return prevTasks
        })
    }

    const items = [
        { 
            label: 'Planning',
            command : () => {
                navigate('/intern/planning')
            } 
        },
        { 
            label: 'Nouveau',
            command : () => {
                navigate('/intern/planning/create')
            }
        }, 
    ]
    const home = { 
        icon: 'pi pi-home',
        url: 'https://primereact.org' 
    }

    const [files, setFiles] = useState([])

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const handleFileUpload = (event) => {
        const selectedFiles = Array.from(event.target.files || event.dataTransfer.files)
        setFiles(prevFiles => [...prevFiles, ...selectedFiles])
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        handleFileUpload(event)
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

            <form>
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
                            />
                            <i 
                                className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400"
                                title="Options"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mt-4">
                        {tasks.map((task, index) => (
                            <div key={task.id} className="shadow rounded-lg p-6">
                                {task.filled ? (
                                    <div>
                                        <div className="flex flex-col space-y-3">
                                            <label><i className="pi pi-file text-indigo-400 mr-3"/>Intitulé</label>
                                            <InputText size="small" className="w-full" />
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
                                        <div className="flex flex-col space-y-3 mt-4">
                                            <label><i className="pi pi-exclamation-circle text-indigo-400 mr-3"/>Priorité</label>
                                            <Dropdown value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.value)} options={severities} optionLabel="name" optionValue="value" placeholder="Sélectionner" className="w-full" />
                                        </div>
                                        <div className="flex flex-col space-y-3 mt-4">
                                            <label><i className="pi pi-hourglass text-indigo-400 mr-3"/>État de la tâche</label>
                                            <Dropdown value={selectedStatus} onChange={(e) => setSelectedStatus(e.value)} options={taskStatuses} optionLabel="name" optionValue="value" placeholder="Sélectionner" className="w-full" />
                                        </div>
                                        <div className="flex flex-col space-y-3 mt-4">
                                            <label><i className="pi pi-link text-indigo-400 mr-3"/>Pièces jointes</label>
                                            <FileUpload mode="basic" name="demo[]" maxFileSize={1000000} chooseLabel="Choisir un fichier" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col justify-center items-center text-gray-400">
                                       <p>
                                            Tâche vide
                                       </p>
                                       <p className="text-center mt-4 text-sm">
                                        Veuillez cliquer sur le bouton <strong>"Ajouter"</strong> pour remplir cette tâche.
                                       </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </form>
        </motion.div>
    )
}

export default CreatePlanning
