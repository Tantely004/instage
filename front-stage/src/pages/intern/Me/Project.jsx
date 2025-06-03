/* eslint-disable no-unused-vars */
import { BreadCrumb } from 'primereact/breadcrumb'
import { Tag } from "primereact/tag"
import { AvatarGroup } from "primereact/avatargroup"
import { Avatar } from "primereact/avatar"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import imgIntern from "../../../assets/images/fake/intern2.png"

const ProjectIntern = () => {
    const navigate = useNavigate()
    const [selectedTask, setSelectedTask] = useState(null)
    const [dialogVisible, setDialogVisible] = useState(false)
    const [draggedTask, setDraggedTask] = useState(null)
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Configurer la messagerie",
            description: "Configurer la messagerie interne pour l'équipe projet.",
            status: "no",
            users: {
                id: 1,
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            start_date: "23 Mai 2025",
            end_date: "30 Mai 2025",
            priority: "Urgent",
            attachments: [
                { name: "email-config.pdf", size: "1.2 MB" }
            ],
            updated_at: "Il y a 1 h",
        },
        {
            id: 2,
            title: "Rédiger la documentation",
            description: "Rédiger la documentation technique pour le projet.",
            status: "pending",
            users: {
                id: 2,
                lastname: "Jane",
                firstname: "Smith",
                avatar: imgIntern,
            },
            start_date: "24 Mai 2025",
            end_date: "24 Mai 2025",
            priority: "Secondaire",
            attachments: [
                { name: "doc-draft.pdf", size: "2.5 MB" }
            ],
            updated_at: "Il y a 30 min",
        },
        {
            id: 3,
            title: "Mettre à jour le site web",
            description: "Mettre à jour les pages principales du site web.",
            status: "achieved",
            users: {
                id: 1,
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            start_date: "22 Mai 2025",
            end_date: "23 Mai 2025",
            priority: "Urgent",
            attachments: [],
            updated_at: "Hier",
        },
        {
            id: 4,
            title: "Corriger les erreurs dans l'application",
            description: "Corriger les bugs signalés dans l'application mobile.",
            status: "reported",
            users: {
                id: 2,
                lastname: "Jane",
                firstname: "Smith",
                avatar: imgIntern,
            },
            start_date: "23 Mai 2025",
            end_date: "28 Mai 2025",
            priority: "Optionnel",
            attachments: [
                { name: "bug-report.pdf", size: "0.8 MB" }
            ],
            updated_at: "Il y a 2 h",
        },
        {
            id: 5,
            title: "Créer une nouvelle base de données",
            description: "Créer une base de données pour les nouveaux utilisateurs.",
            status: "no",
            users: {
                id: 1,
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            start_date: "25 Mai 2025",
            end_date: "01 Juin 2025",
            priority: "Secondaire",
            attachments: [],
            updated_at: "Aujourd'hui",
        },
        {
            id: 6,
            title: "Déployer l'application",
            description: "Déployer la nouvelle version de l'application sur le serveur.",
            status: "pending",
            users: {
                id: 2,
                lastname: "Jane",
                firstname: "Smith",
                avatar: imgIntern,
            },
            start_date: "24 Mai 2025",
            end_date: "29 Mai 2025",
            priority: "Secondaire",
            attachments: [],
            updated_at: "Il y a 45 min",
        },
        {
            id: 7,
            title: "Vérifier la compatibilité mobile",
            description: "Tester la compatibilité de l'application sur différents appareils mobiles.",
            status: "achieved",
            users: {
                id: 1,
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            start_date: "23 Mai 2025",
            end_date: "24 Mai 2025",
            priority: "Optionnel",
            attachments: [
                { name: "mobile-test.pdf", size: "1.0 MB" }
            ],
            updated_at: "Aujourd'hui",
        },
        {
            id: 8,
            title: "Ajouter un système de notifications",
            description: "Implémenter un système de notifications push pour les utilisateurs.",
            status: "reported",
            users: {
                id: 2,
                lastname: "Jane",
                firstname: "Smith",
                avatar: imgIntern,
            },
            start_date: "22 Mai 2025",
            end_date: "27 Mai 2025",
            priority: "Urgent",
            attachments: [],
            updated_at: "Il y a 3 h",
        },
    ])

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,  
    }

    const items = [
        { label: 'Projet' },
        { label: 'Instage' }
    ]

    const back = { 
        icon: 'pi pi-arrow-left', 
        command: () => {
            navigate('/intern/me')
        }
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

    const statusCategories = [
        { title: "To-do List", status: "no" },
        { title: "En cours", status: "pending" },
        { title: "Terminé", status: "achieved" },
        { title: "À corriger", status: "reported" }
    ]

    const handleTaskClick = (task) => {
        setSelectedTask(task)
        setDialogVisible(true)
    }

    const getColumnColor = (status) => {
        switch (status) {
            case "no":
                return "border-gray-300"
            case "pending":
                return "border-yellow-200"
            case "achieved":
                return "border-green-200"
            case "reported":
                return "border-red-200"
            default:
                return "border-gray-300"
        }
    }

    const handleDragStart = (e, task) => {
        e.dataTransfer.setData("taskId", task.id)
        setDraggedTask(task)
        e.currentTarget.classList.add('opacity-50', 'scale-95')
    }

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('opacity-50', 'scale-95')
        setDraggedTask(null)
    }

    const handleDrop = (e, newStatus) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData("taskId")
        const updatedTasks = tasks.map(task => 
            task.id === parseInt(taskId) 
                ? { ...task, status: newStatus, updated_at: "Aujourd'hui" }
                : task
        )
        setTasks(updatedTasks)
        setDraggedTask(null)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add('bg-gray-50', 'border-2', 'border-dashed', 'border-indigo-400')
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove('bg-gray-50', 'border-2', 'border-dashed', 'border-indigo-400')
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
            <section className='mt-4 flex justify-between items-center'>
                <div>
                    <div className='flex items-center space-x-4'>
                        <BreadCrumb 
                            model={items}
                            home={back}
                            className='!border-none !font-semibold'
                            pt={{
                                icon: "!text-indigo-400",
                                label: "!text-indigo-400",
                                separator: "!text-indigo-400",
                            }}
                        />
                        <Tag 
                            value="En cours" 
                            className='!font-poppins'
                        />
                    </div>

                    <div className='ml-12 flex items-center space-x-28'>
                        <AvatarGroup>
                            {collaborators.map((collaborator) => (
                                <Avatar
                                    key={collaborator.id} 
                                    image={collaborator.avatar}
                                    shape='circle'
                                    size='large'
                                />
                            ))}
                        </AvatarGroup>

                        <p className='text-sm text-gray-500'>
                            Aujourd'hui - le 23 Mai 2025
                        </p>

                        <div className='flex items-center gap-x-4'>
                            <Button 
                                icon="pi pi-list"
                                label='Liste'
                                className='!h-8 !bg-gray-200 hover:!bg-gray-300 !text-gray-600 !border-none'
                            />
                            <Button 
                                icon="pi pi-objects-column"
                                label='Kanban'
                                className='!h-8'
                            />
                        </div>
                    </div> 
                </div>

                <Button
                    icon="pi pi-plus" 
                    label='Ajouter une tâche'
                    className='!h-12 !font-poppins'
                />
            </section>

            <section className='mt-10 grid grid-cols-4 gap-8'>
                {statusCategories.map((category) => {
                    const filteredTasks = tasks.filter(task => task.status === category.status)
                    return (
                        <motion.div 
                            key={category.status}
                            onDrop={(e) => handleDrop(e, category.status)}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            className={`min-h-[300px] p-4 rounded-lg border-2 ${getColumnColor(category.status)} transition-all duration-300`}
                            initial={{ scale: 1 }}
                            animate={{ scale: draggedTask && draggedTask.status !== category.status ? 1.02 : 1 }}
                        >
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='text-xl font-semibold text-gray-700'>
                                    {category.title}
                                    <Tag value={filteredTasks.length} className='ml-4'/>
                                </h3>

                                <div className='flex justify-end items-center gap-6'>
                                    <i 
                                        className='pi pi-plus cursor-pointer text-indigo-400'
                                        title="Ajouter"
                                    />
                                    <i 
                                        className='pi pi-ellipsis-h cursor-pointer hover:text-indigo-400'
                                        title="Options"
                                    />
                                </div>
                            </div>

                            <div className='mt-2'>
                                {filteredTasks.map((task) => (
                                    <motion.div 
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        onDragEnd={handleDragEnd}
                                        className='bg-gray-100 mb-4 shadow-md rounded-lg p-4 cursor-grab hover:bg-gray-200 transition-all duration-300'
                                        onClick={() => handleTaskClick(task)}
                                        initial={{ opacity: 1, y: 0 }}
                                        animate={{ opacity: draggedTask?.id === task.id ? 0.5 : 1 }}
                                        whileHover={{ scale: 1.03 }}
                                        whileDrag={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
                                    >
                                        <h5 className='font-medium text-gray-600'>
                                            {task.title}
                                        </h5>
                                        
                                        <div className='flex justify-between items-center'>
                                            <div className='mt-8 flex items-center space-x-4'>
                                                <img 
                                                    src={task.users.avatar} 
                                                    className='w-8 h-8 rounded-full'
                                                />
                                                <p className='text-xs'>
                                                    {task.updated_at}
                                                </p>
                                            </div>

                                            <i 
                                                className='pi pi-paperclip text-gray-400 mt-6 cursor-pointer hover:text-indigo-400'
                                                title='Pièces jointes'
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )
                })}
            </section>

            <Dialog
                header={`Modifié récemment`}
                visible={dialogVisible}
                style={{ width: '50vw' }}
                onHide={() => setDialogVisible(false)}
                className="!font-poppins"
            >
                {selectedTask && (
                    <div className="p-4 pt-0">
                        <div>
                            <div className='flex justify-between items-center'>
                                <h3 className="text-xl font-semibold text-indigo-500">
                                    {selectedTask.title}
                                </h3>
                                <div className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400' />
                            </div>

                            <hr className='border-b border-gray-200 mt-4 mb-6'/>

                            <p className="text-gray-600">
                                {selectedTask.description}
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-[35%_65%]">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                                <i className="pi pi-users mr-2" />
                                Personnes
                            </h3>
                            <div className="flex items-center space-x-2 mt-2">
                                <Avatar
                                    image={selectedTask.users.avatar}
                                    shape="circle"
                                    size="normal"
                                />
                                <p className="text-gray-600">
                                    {selectedTask.users.firstname} {selectedTask.users.lastname}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-[35%_65%]">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                                <i className="pi pi-calendar mr-2" />
                                Timeline
                            </h3>
                            <p className="text-gray-600">
                                {selectedTask.start_date} - {selectedTask.end_date}
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-[35%_65%]">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                                <i className="pi pi-exclamation-circle mr-2" />
                                Priorité
                            </h3>
                            <Tag 
                                value={selectedTask.priority}
                                className='!w-24'
                            />
                        </div>

                        {selectedTask.attachments.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                                    <i className="pi pi-paper.contrib mr-2" />
                                    Attachment ({selectedTask.attachments.length})
                                </h3>

                                <div className='mt-3'>
                                    {selectedTask.attachments.map((attachment, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center text-sm space-x-3 p-4 rounded-md border border-gray-200"
                                        >
                                            <i className="pi pi-file-pdf text-indigo-500" />
                                            <p className="text-gray-600">
                                                {attachment.name}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {attachment.size}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </motion.div>
    )
}

export default ProjectIntern