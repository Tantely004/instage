/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { locale, addLocale } from 'primereact/api'
import { motion } from "framer-motion"

import imgPlanning from "../../assets/images/img-planning.png"

const PlanningIntern = () => {
    const [date, setDate] = useState(null)

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
                                class="flex justify-center items-center mx-auto mt-4 w-64"
                            />
                        </div>

                        <div>
                            <p>
                                Suivez toutes les étapes de votre projet de stage, vos tâches hebdomadaires, les points de rendez-vous avec votre encadrant, et les jalons importants jusqu’à la fin du stage.
                            </p>
                            <div className='mt-8 flex flex-col'>
                                <Button
                                    icon="pi pi-plus"
                                    label='Nouvelle chronogramme'
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
        </motion.div>
    )
}

export default PlanningIntern