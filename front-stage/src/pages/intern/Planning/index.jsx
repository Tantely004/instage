/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { locale, addLocale } from 'primereact/api'
import { motion, AnimatePresence } from "framer-motion"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import frLocale from '@fullcalendar/core/locales/fr'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import imgPlanning from "../../../assets/images/img-planning.png"
import imgIntern from "../../../assets/images/img_profile_intern.jpg"

const PlanningIndex = () => {
    const navigate = useNavigate()
    const [date, setDate] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/api/taskcalendar/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des tâches:', error);
            }
        }
        fetchTasks()
    }, [])

    addLocale('fr', {
        firstDayOfWeek: 1,
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        today: 'Aujourd\'hui',
        clear: 'Effacer'
    })

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const contentVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    }

    const contentTransition = {
        duration: 0.3,
    }

    const handleEventClick = (info) => {
        const event = info.event;
        setSelectedEvent({
            title: event.title,
            date: event.startStr,
            ...(event.extendedProps.type === 'task' ? {
                description: event.extendedProps.description,
                priority: event.extendedProps.priority,
                status: event.extendedProps.status,
                progression: event.extendedProps.progression,
            } : {
                time: event.extendedProps.time,
                room: event.extendedProps.room,
                status: event.extendedProps.status,
            }),
            type: event.extendedProps.type,
        });
    }

    const getPriorityLabel = (priority) => {
        switch (priority.toUpperCase()) {
            case 'HIGH': return 'Urgent'
            case 'MEDIUM': return 'Secondaire'
            case 'LOW': return 'Optionnel'
            default: return priority
        }
    }

    const getStatusLabel = (status) => {
        switch (status.toUpperCase()) {
            case 'OPEN': return 'À faire'
            case 'PROGRESSING': return 'En cours'
            case 'COMPLETED': return 'Terminé'
            case 'CANCELLED': return 'Annulé'
            case 'PLANNED': return 'Planifié'
            case 'IN_PROGRESS': return 'En cours'
            default: return status
        }
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
            <section className="grid grid-cols-3 gap-8">
                <div className='col-span-2 p-8 bg-white shadow border border-gray-200 rounded-lg'>
                    <h1 className='flex justify-between items-center'>
                        <span className='text-indigo-500 font-bold text-3xl'>
                            Planning
                        </span>
                        <i 
                            className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400'
                            title="Options"
                        />
                    </h1>

                    <div className="grid grid-cols-2 gap-8 mt-6">
                        <div>
                            <img 
                                src={imgPlanning} 
                                className="flex justify-center items-center mx-auto mt-4 w-64"
                            />
                        </div>

                        <div>
                            <p>
                                Suivez toutes les étapes de votre projet de stage, vos tâches hebdomadaires, les points de rendez-vous avec votre encadrant, et les jalons importants jusqu’à la fin du stage.
                            </p>
                            <div className='mt-8 flex flex-col'>
                                <Button
                                    icon="pi pi-plus"
                                    label='Nouveau chronogramme'
                                    className='!bg-gray-600 !text-white hover:!no-underline hover:!bg-gray-700 !border-none'
                                    onClick={() => navigate("create")}
                                />
                                <Button
                                    icon="pi pi-google"
                                    label='Synchroniser avec Google'
                                    className='!mt-4 !border-none'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 !overflow-hidden">
                    <Calendar
                        value={date} 
                        onChange={(e) => setDate(e.value)} 
                        inline
                        showWeek
                        locale="fr"
                        className="!overflow-hidden"
                        pt={{
                            groupContainer: '!overflow-hidden rounded-lg'
                        }}
                    />
                </div>
            </section>

            <section className={`mt-12 grid ${selectedEvent ? 'grid-cols-3' : 'grid-cols-1'} gap-8`}>
                <div className={`${selectedEvent ? 'col-span-2' : 'col-span-1'}`}>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-bold text-indigo-500'>
                            Votre calendrier
                        </h2>
                        <i 
                            className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400' 
                            title='Options'
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            weekends={false}
                            events={events}
                            eventClick={handleEventClick}
                            locale={frLocale}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek'
                            }}
                            eventContent={(eventInfo) => (
                                <div className="p-1 cursor-pointer">
                                    <p className="text-sm font-semibold text-white">{eventInfo.event.title}</p>
                                    <p className="text-xs text-white">{eventInfo.event.extendedProps.type === 'interview' ? 'Entretien' : 'Tâche'}</p>
                                </div>
                            )}
                            dayHeaderClassNames="bg-indigo-50 text-indigo-700 font-semibold"
                            dayCellClassNames="border-gray-200"
                            eventClassNames="border-none rounded-md text-white"
                            eventBackgroundColor={(info) => info.event.extendedProps.type === 'interview' ? '#8884d8' : '#4B5563'}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedEvent && (
                        <motion.div
                            key="event-details"
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={contentTransition}
                            className="col-span-1 relative p-6 bg-white shadow border border-gray-200 rounded-lg"
                        >
                            <i
                                className="pi pi-times absolute top-4 right-4 cursor-pointer hover:text-indigo-400"
                                title="Fermer"
                                onClick={() => setSelectedEvent(null)}
                            />

                            <div className="mt-4 mb-4">
                                <h3 className="text-xl font-bold text-indigo-500">{selectedEvent.title}</h3>
                                {selectedEvent.type === 'task' && (
                                    <div className="mt-2 flex gap-2">
                                        <Tag 
                                            value={getPriorityLabel(selectedEvent.priority)}
                                            severity={
                                                getPriorityLabel(selectedEvent.priority) === 'Urgent' ? 'danger' :
                                                getPriorityLabel(selectedEvent.priority) === 'Secondaire' ? 'secondary' : 'info'
                                            }
                                        />
                                        <Tag 
                                            value={getStatusLabel(selectedEvent.status)}
                                            severity={
                                                getStatusLabel(selectedEvent.status) === 'Terminé' ? 'success' :
                                                getStatusLabel(selectedEvent.status) === 'Annulé' ? 'danger' : 'warning'
                                            }
                                        />
                                    </div>
                                )}
                                <div className='mt-4 flex items-center gap-4'>
                                    {selectedEvent.type === 'task' && (
                                        <>
                                            <Button 
                                                icon='pi pi-refresh'
                                                label="Réorganiser"
                                                className='!bg-transparent hover:!bg-gray-200 !px-2 !text-black/50 py-1 !text-sm !border !border-gray-200'
                                            />
                                            <Button 
                                                icon='pi pi-times-circle'
                                                label="Reporter"
                                                className='!bg-transparent hover:!bg-gray-200 !px-2 !text-black/50 py-1 !text-sm !border !border-gray-200'
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className='mt-10 flex flex-col space-y-6'>
                                <div className='grid grid-cols-[15%_85%] border-t border-gray-300 pt-4'>
                                    <i className='pi pi-clock text-indigo-500'/>
                                    <div>
                                        <p className='flex justify-between items-center'>
                                            <span className='font-medium'>
                                                {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
                                            </span>
                                            {selectedEvent.type === 'interview' && (
                                                <Tag value={`Porte ${selectedEvent.room}`} severity="secondary"/>
                                            )}
                                            {selectedEvent.type === 'task' && selectedEvent.progression && (
                                                <Tag value={`Progression: ${selectedEvent.progression}%`} severity="info"/>
                                            )}
                                        </p>
                                        {selectedEvent.type === 'interview' && selectedEvent.time && (
                                            <p>{selectedEvent.time}</p>
                                        )}
                                    </div>
                                </div>

                                <div className='grid grid-cols-[15%_85%] border-t border-gray-300 pt-4'>
                                    <i className='pi pi-briefcase text-indigo-500'/>
                                    {selectedEvent.type === 'task' ? (
                                        <p className="text-gray-700">{selectedEvent.description || 'Aucune description'}</p>
                                    ) : (
                                        <ul className="list-disc pl-5">
                                            {selectedEvent.description && selectedEvent.description.map((item, index) => (
                                                <li key={index} className="text-gray-700">{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className='grid grid-cols-[15%_85%] border-t border-gray-300 pt-4'>
                                    <i className='pi pi-box text-indigo-500'/>
                                    <p className='text-sm text-black/40'>
                                        Aucun livrable demandé pour le moment
                                    </p>
                                </div>

                                <div className='grid grid-cols-[15%_85%] border-t border-gray-300 pt-4'>
                                    <i className='pi pi-file text-indigo-500'/>
                                    <p className='text-sm text-black/40'>
                                        Aucun fichier associé pour le moment
                                    </p>
                                </div>

                                <div className='grid grid-cols-[15%_85%] border-t border-gray-300 pt-6'>
                                    <i className='pi pi-users text-indigo-500'/>
                                    <div className='flex flex-col space-y-2 text-sm text-black/40'>
                                        <h6 className='font-bold text-black/70'>
                                            2 participants
                                        </h6>
                                        <div className='flex space-x-2 items-center'>
                                            <img src={imgIntern} className='w-10 h-10 border border-gray-100 rounded-full' />
                                            <img src={imgIntern} className='w-10 h-10 border border-gray-100 rounded-full' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </motion.div>
    )
}

export default PlanningIndex