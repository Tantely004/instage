import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Tag } from 'primereact/tag'
import { locale, addLocale } from 'primereact/api'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import frLocale from '@fullcalendar/core/locales/fr'
import { useNavigate } from 'react-router-dom'

import imgIntern from "../../../assets/images/fake/intern2.png"

const CalendarSupervisor = () => {
    const navigate = useNavigate()
    const [ date, setDate ] = useState(null)
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

    const senders = [
        {
            id: 1,
            firstname: "Mirindra",
            avatar: imgIntern,
            time: "3h",
        },
        {
            id: 1,
            firstname: "Mirindra",
            avatar: imgIntern,
            time: "3h",
        },
        {
            id: 1,
            firstname: "Mirindra",
            avatar: imgIntern,
            time: "3h",
        },
    ]

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
            className='mb-20 max-w-[89vw]' 
        >
            <section className='flex justify-between'>
                <div>
                    <h1 className='text-xl font-semibold text-indigo-400'>
                        Calendrier
                    </h1>
                    <p className='mt-1 w-[65%]'>
                        Suivez toutes les étapes de vos projets, les tâches hebdomadaires et les points de rendez-vous avec vos stagiaires.
                    </p>
                </div>

                <div className='flex gap-x-4'>
                    <Button 
                        label='Nouveau'
                        icon="pi pi-plus"
                        className='!h-10'
                    />
                </div>
            </section>

            <section className='mt-8 grid grid-cols-3 gap-8'>
                <div className='col-span-2 grid grid-cols-2 gap-8 h-full'>
                    <div className='overflow-hidden'>
                      <Calendar
                            value={date}
                            onChange={(e) => setDate(e.value)}
                            inline
                            locale="fr"
                            className="!border-none !w-[26rem] !h-[29rem]"
                            pt={{
                                root: '!border-none !text-sm !overflow-hidden',
                                groupContainer: '!border-none',
                                table: '!text-sm',
                                day: {
                                    className: '!px-0 !mx-0 !text-sm hover:!bg-gray-100',
                                },
                                dayLabel: '!text-sm',
                                weekLabel: '!px-0 !mx-0 !text-sm !text-gray-600',
                                header: '!p-0 !m-0 !bg-transparent !border-none',
                                monthPicker: '!p-0 !mx-0',
                                month: '!px-0 !m-0 !text-sm hover:!bg-gray-100',
                                yearPicker: '!p-0 !mx-0',
                                year: '!px-0 !mx-0 !text-sm hover:!bg-gray-100',
                                buttonbar: '!px-0 !mx-0',
                                nextButton: '!px-0 !text-sm',
                                previousButton: '!px-0 !text-sm'
                            }}
                        />
                    </div>

                    <div className='px-6 py-20 shadow rounded-lg'>
                        <p className='text-center'>
                            Activez la synchronisation avec Google Calendar et planifiez vos sprint en toute simplicité ! Connectez-vous en un clic pour importer vos rendez-vous et rester organisé
                        </p>

                        <Button 
                            icon="pi pi-google"
                            label='Synchroniser'
                            className='!mt-12 !flex !justify-center !items-center !mx-auto'
                        />
                    </div>
                </div>

                <div className='col-span-1 shadow flex flex-col justify-between rounded-lg p-6'>
                    <div>
                        <h3 className='flex justify-between items-center'>
                            <span className='text-lg text-indigo-400 font-semibold'>
                                Journal
                            </span>
                            <i 
                                className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400'
                                title='Options'
                            />
                        </h3>

                        <div className='mt-5 text-sm'>
                            {
                                senders.map((sender) => (
                                    <div 
                                        key={sender.id}
                                        className='rounded-md mb-4 p-3 flex items-center space-x-3 bg-gray-100 hover:cursor-pointer hover:bg-gray-200'
                                    >
                                        <img src={sender.avatar} className='w-10 h-10 rounded-full'/>
                                        <div>
                                            <p>
                                                <strong>{sender.firstname}</strong> a soumis un chronogramme
                                            </p>
                                            <p className='text-xs text-gray-400'>
                                                Il y a { sender.time }
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <Button 
                        label='Voir tout'
                        className='!mt-8 !bg-transparent !border-none !p-0 !flex !justify-center !items-center !font-poppins !text-indigo-400'
                    />
                </div>
            </section>

            <section className={`mt-12 grid ${selectedEvent ? 'grid-cols-3' : 'grid-cols-1'} gap-8`}>
                <div className={`${selectedEvent ? 'col-span-2' : 'col-span-1'}`}>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl font-bold text-indigo-500'>
                            Votre planning projet
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
                                <h3 className="text-lg font-bold text-indigo-500">{selectedEvent.title}</h3>
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

export default CalendarSupervisor