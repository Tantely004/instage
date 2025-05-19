import { useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { locale, addLocale } from 'primereact/api'
import { motion } from "framer-motion"

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
                <div className="col-span-2 grid grid-cols-2 gap-6 bg-white shadow border border-gray-200 rounded-lg">
                    <div>
                        <h1 className='text-indigo-500'>
                            Planning
                        </h1>
                    </div>

                    <div>
                        .
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