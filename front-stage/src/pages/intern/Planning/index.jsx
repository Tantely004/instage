/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { locale, addLocale } from 'primereact/api'
import { motion, AnimatePresence } from "framer-motion"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import frLocale from '@fullcalendar/core/locales/fr'

import imgPlanning from "../../../assets/images/img-planning.png"
import imgIntern from "../../../assets/images/img_profile_intern.jpg"

const PlanningIndex = () => {
    const [date, setDate] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)

    addLocale('fr', {
        firstDayOfWeek: 1,
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        today: 'Aujourd\'hui',
        clear: 'Effacer'
    });

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

    const events = [
        { 
            id: 1, 
            title: 'Réunion avec encadrant', 
            date: '2025-05-20',
            extendedProps: {
                time: '12:00',
                room: '103',
                priority: 'Optionnel',
                type: 'internship',
                description: [
                    'Point hebdomadaire pour discuter des progrès du stage.',
                    'Planifier les prochaines étapes.'
                ]
            },
            backgroundColor: '#4B5563',
            borderColor: '#4B5563'
        },
        { 
            id: 2, 
            title: 'Tâche: Analyse données', 
            date: '2025-05-22',
            extendedProps: {
                time: '12:00',
                room: '103',
                priority: 'Optionnel',
                type: 'company',
                description: [
                    'Analyser les données clients.',
                    'Préparer le rapport mensuel de l’entreprise.'
                ]
            }
        },
        { 
            id: 3, 
            title: 'Rédaction rapport intermédiaire', 
            date: '2025-05-25',
            extendedProps: {
                time: '12:00',
                room: '103',
                priority: 'Secondaire',
                type: 'internship',
                description: [
                    'Préparer le rapport intermédiaire du stage.',
                    'Obtenir la validation par l’encadrant.'
                ]
            }
        },
        { 
            id: 4, 
            title: 'Formation logiciel interne', 
            date: '2025-05-27',
            extendedProps: {
                time: '12:00',
                room: '103',
                priority: 'Urgent',
                type: 'company',
                description: [
                    'Participer à la formation sur l’outil CRM.',
                    'Appliquer les connaissances à l’équipe.'
                ]
            }
        },
        { 
            id: 5, 
            title: 'Point projet équipe', 
            date: '2025-05-29',
            extendedProps: {
                time: '12:00',
                room: '103',
                priority: 'Secondaire',
                type: 'company',
                description: [
                    'Réunion avec l’équipe projet.',
                    'Alignement des tâches.'
                ]
            }
        }
    ]

    const handleEventClick = (info) => {
        setSelectedEvent({
            title: info.event.title,
            date: info.event.startStr,
            description: info.event.extendedProps.description,
            type: info.event.extendedProps.type,
            priority: info.event.extendedProps.priority,
            time: info.event.extendedProps.time,
            room: info.event.extendedProps.room,
        })
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
                                    className='!bg-gray-600 hover:!bg-gray-700 !border-none'
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
                            plugins={[ dayGridPlugin ]}
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
                                </div>
                            )}
                            dayHeaderClassNames="bg-indigo-50 text-indigo-700 font-semibold"
                            dayCellClassNames="border Fulgrid-gray-200"
                            eventClassNames="border-none rounded-md text-white"
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
                                <Tag 
                                    value={selectedEvent.priority}
                                    severity={
                                        selectedEvent.priority === 'Urgent' ? 'danger' :
                                        selectedEvent.priority === 'Secondaire' ? 'secondary' : 'info'
                                    }
                                    className="mt-2"
                                />
                                <div className='mt-4 flex items-center gap-4'>
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
                                            <Tag value={`Porte ${selectedEvent.room}`} severity="secondary"/>
                                        </p>
                                        <p>{ selectedEvent.time }</p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-[15%_85%] border-t border-gray-300 pt-4'>
                                    <i className='pi pi-briefcase text-indigo-500'/>
                                    <ul className="list-disc pl-5">
                                        {selectedEvent.description.map((item, index) => (
                                            <li key={index} className="text-gray-700">{item}</li>
                                        ))}
                                    </ul>
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