import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BreadCrumb } from 'primereact/breadcrumb'
import { TabView, TabPanel } from 'primereact/tabview'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'  
import { Editor } from 'primereact/editor'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload'
import { MultiSelect } from 'primereact/multiselect'

import imgIntern from "../../../assets/images/fake/intern2.png"

const CreatePlanningSupervisor = () => {
    const navigate = useNavigate()
    const [files, setFiles] = useState([])
    const [tasks, setTasks] = useState([
        {
            id: Date.now(),
            selectedIntern: null,
            selectedSeverity: null,
            selectedStatus: null
        }
    ])
    const [interviews, setInterviews] = useState([
        {
            id: Date.now(),
            selectedIntern: null,
            selectedStatus: null,
            date: null,
            subjects: ''
        }
    ])
    const [activeTab, setActiveTab] = useState(0)

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

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

    const interviewStatuses = [
        { name: 'Planifié', value: 'planned' },
        { name: 'Annulé', value: 'cancelled' },
    ]

    const items = [
        { 
            label: 'Calendrier',
            command: () => navigate('/supervisor/planning')
        },
        { 
            label: 'Nouveau',
            command: () => navigate('/supervisor/planning/create')
        }, 
    ]
    const home = { 
        icon: 'pi pi-home', 
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

    const collaborators = [
        {
            id: 1,
            lastname: "John",
            firstname: "Doe",
            avatar: imgIntern,
        },
        {
            id: 2,
            lastname: "Jane",
            firstname: "Smith",
            avatar: imgIntern,
        },
    ]

    const internTemplate = (option) => {
        return (
            <div className="flex items-center space-x-2">
                <img src={option.avatar} className='w-8 h-8 rounded-full'/>
                <div>{option.lastname} {option.firstname}</div>
            </div>
        );
    };

    const addTask = () => {
        setTasks(prevTasks => [
            ...prevTasks,
            {
                id: Date.now(),
                selectedIntern: null,
                selectedSeverity: null,
                selectedStatus: null
            }
        ])
    }

    const addInterview = () => {
        setInterviews(prevInterviews => [
            ...prevInterviews,
            {
                id: Date.now(),
                selectedIntern: null,
                selectedStatus: null,
                date: null,
                subjects: ''
            }
        ])
    }

    const removeTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
    }

    const removeInterview = (interviewId) => {
        setInterviews(prevInterviews => prevInterviews.filter(interview => interview.id !== interviewId))
    }

    const updateTask = (taskId, field, value) => {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === taskId ? { ...task, [field]: value } : task
        ))
    }

    const updateInterview = (interviewId, field, value) => {
        setInterviews(prevInterviews => prevInterviews.map(interview => 
            interview.id === interviewId ? { ...interview, [field]: value } : interview
        ))
    }

    const handleAdd = () => {
        if (activeTab === 0) {
            addTask()
        } else {
            addInterview()
        }
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className='mb-20 max-w-[89vw]' 
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

            <form onSubmit={(e) => e.preventDefault()}>
                <section className="grid grid-cols-3 gap-16 mt-10">
                    <div className="col-span-2">
                        <h1 className="text-indigo-400 text-xl font-bold">
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
                                    className="!w-full"
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

                <section className="mt-16">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-indigo-500">
                            Organiser les tâches
                        </h2>
                        <div className="flex justify-end items-center gap-8">
                            <Button
                                icon="pi pi-plus"
                                label="Ajouter"
                                size="small"
                                onClick={handleAdd}
                            />
                            <Button
                                icon="pi pi-save"
                                label="Enregistrer"
                                size="small"
                                className="!bg-gray-700 hover:!bg-gray-800 !border-none text-white"
                            />
                            <i 
                                className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400"
                                title="Options"
                            />
                        </div>
                    </div>

                    <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                        <TabPanel header="Tâches">
                            <div className="grid grid-cols-2 gap-8 mt-4">
                            {tasks.map((task) => (
                                <div key={task.id} className="shadow rounded-lg p-6 relative">
                                    <i 
                                        className="pi pi-times absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500"
                                        onClick={() => removeTask(task.id)}
                                        title="Supprimer la tâche"
                                    />
                                    <div>
                                        <div className="flex flex-col space-y-3">
                                            <label><i className="pi pi-file text-indigo-400 mr-3"/>Intitulé</label>
                                            <InputText 
                                                size="small" 
                                                className="w-full" 
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
                                                    value={task.selectedSeverity} 
                                                    onChange={(e) => updateTask(task.id, 'selectedSeverity', e.value)} 
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
                                                    value={task.selectedStatus} 
                                                    onChange={(e) => updateTask(task.id, 'selectedStatus', e.value)} 
                                                    options={taskStatuses} 
                                                    optionLabel="name" 
                                                    optionValue="value" 
                                                    placeholder="Sélectionner" 
                                                    className="w-full" 
                                                />
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 gap-6 mt-4'>
                                            <div className="flex flex-col space-y-3 mt-4">
                                                <label><i className="pi pi-link text-indigo-400 mr-3"/>Pièces jointes</label>
                                                <FileUpload 
                                                    mode="basic" 
                                                    name="demo[]" 
                                                    maxFileSize={1000000} 
                                                    chooseLabel="Choisir un fichier" 
                                                />
                                            </div>

                                            <div className="mt-4 flex flex-col space-y-3">
                                                <label><i className="pi pi-users text-indigo-400 mr-3"/>Assigné pour</label>
                                                <MultiSelect 
                                                    value={task.selectedIntern} 
                                                    options={collaborators} 
                                                    onChange={(e) => updateTask(task.id, 'selectedIntern', e.value)} 
                                                    placeholder="Sélectionner" 
                                                    itemTemplate={internTemplate}
                                                    className='!font-poppins'
                                                    panelClassName='!font-poppins'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </TabPanel>

                        <TabPanel header="Entrevue">
                            <div className="grid grid-cols-2 gap-8 mt-4">
                                {interviews.map((interview) => (
                                    <div key={interview.id} className="shadow rounded-lg p-6 relative">
                                        <i 
                                            className="pi pi-times absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500"
                                            onClick={() => removeInterview(interview.id)}
                                            title="Supprimer l'entrevue"
                                        />
                                        <div>
                                            <div className="flex flex-col space-y-3">
                                                <label><i className="pi pi-calendar text-indigo-400 mr-3"/>Date/heure</label>
                                                <Calendar 
                                                    size="small" 
                                                    className="w-full" 
                                                    showTime 
                                                    hourFormat="24"
                                                    value={interview.date}
                                                    onChange={(e) => updateInterview(interview.id, 'date', e.value)}
                                                />
                                            </div>

                                            <div className="flex flex-col space-y-3 mt-4">
                                                <label><i className="pi pi-align-left text-indigo-400 mr-3"/>Sujets</label>
                                                <Editor 
                                                    className="h-64 text-sm"
                                                    value={interview.subjects}
                                                    onTextChange={(e) => updateInterview(interview.id, 'subjects', e.htmlValue)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mt-20">
                                                <div className="flex flex-col space-y-3">
                                                    <label><i className="pi pi-user text-indigo-400 mr-3"/>Stagiaire concerné</label>
                                                    <Dropdown 
                                                        value={interview.selectedIntern}
                                                        options={collaborators} 
                                                        onChange={(e) => updateInterview(interview.id, 'selectedIntern', e.value)}
                                                        placeholder="Sélectionner" 
                                                        itemTemplate={internTemplate}
                                                        className='!font-poppins'
                                                        panelClassName='!font-poppins'
                                                    />
                                                </div>
                                                <div className="flex flex-col space-y-3">
                                                    <label><i className="pi pi-hourglass text-indigo-400 mr-3"/>Statut</label>
                                                    <Dropdown
                                                        value={interview.selectedStatus} 
                                                        options={interviewStatuses}
                                                        optionLabel="name"
                                                        optionValue="value" 
                                                        placeholder="Sélectionner" 
                                                        className='!font-poppins'
                                                        panelClassName='!font-poppins'
                                                        onChange={(e) => updateInterview(interview.id, 'selectedStatus', e.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col space-y-3 mt-4">
                                                <label><i className="pi pi-building text-indigo-400 mr-3"/>Porte</label>
                                                <InputText 
                                                    size="small" 
                                                    className="w-full" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabPanel>
                    </TabView>
                </section>

                <Button
                    label='Valider'
                    className='!mt-16 !h-10 !flex !justify-center !items-center !mx-auto !w-64'
                />
            </form>
        </motion.div>
    )
}

export default CreatePlanningSupervisor