import { useState, useEffect } from 'react'
import { Chart } from 'primereact/chart'
import { Avatar } from 'primereact/avatar'
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

import intern1 from '../../assets/images/fake/intern1.png'
import intern2 from '../../assets/images/fake/intern2.png'
import intern3 from '../../assets/images/img_profile_intern.jpg'

const DashboardSupervisor = ({isDarkMode}) => {
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const interviews = [
        {
            id: 1,
            intern: 'John Doe',
            avatar: intern1,
            date: 'Aujourd\'hui',
            time: '11:00',
            reason: 'Compte-rendu',
        },
        {
            id: 2,
            intern: 'Jean Claude',
            avatar: intern3,
            date: 'Aujourd\'hui',
            time: '15:00',
            reason: 'Compte-rendu',
        },
        {
            id: 3,
            intern: 'Marie Claire',
            avatar: intern2,
            date: 'Demain',
            time: '09:00',
            reason: 'Briefing projet',
        },
    ]

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
        const data = {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
            datasets: [
                {
                    label: 'Insi',
                    data: [41, 42, 43, 43, 44],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue(isDarkMode ? '--indigo-300' : '--indigo-500'),
                    tension: 0.4
                },
                {
                    label: 'MyFinancial',
                    data: [1, 3, 7, 8, 10],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue(isDarkMode ? '--gray-500' : '--gray-300'),
                    tension: 0.4
                }
            ]
        }
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }

        setChartData(data)
        setChartOptions(options)
    }, [])

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition} 
            className={`mb-12 max-w-[89vw]`}
        >
            <section className="grid grid-cols-4 gap-8 items-center">
                <div className="bg-indigo-400 dark:!bg-indigo-500 text-white p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-users text-2xl"/>

                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">
                            Stagiaires encadrés
                        </h4>
                        <p className="font-bold text-3xl">
                            5
                        </p>
                    </div>
                </div>  

                <div className="bg-indigo-400 dark:!bg-indigo-500 text-white p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-users text-2xl"/>

                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">
                            Entrevue actuel
                        </h4>
                        <p className="font-bold text-3xl">
                            3
                        </p>
                    </div>
                </div>  

                <div className="bg-indigo-400 dark:!bg-indigo-500 text-white p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-briefcase text-2xl"/>

                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">
                            Tâches réalisées
                        </h4>
                        <p className="font-bold text-3xl">
                            23
                        </p>
                    </div>
                </div>    

                <div className="bg-indigo-400 dark:!bg-indigo-500 text-white p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-file text-2xl"/>

                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">
                            Rapports reçus
                        </h4>
                        <p className="font-bold text-3xl">
                            1
                        </p>
                    </div>
                </div>   
            </section>

            <section className="mt-8 grid grid-cols-3 gap-8 w-full">
                <div className="bg-white dark:!bg-gray-700 col-span-2 shadow p-6 rounded-lg">
                    <h3 className="flex justify-between items-center dark:text-white">
                        <span className="font-semibold text-lge">
                            Avancement global des projets
                        </span>
                        <i className="pi pi-ellipsis-v cursor-pointer"/>
                    </h3>

                    <Chart 
                        type="line" 
                        data={chartData} 
                        options={chartOptions}
                        className={`h-80 mt-8`}
                    />
                </div>

                <div className="col-span-1 bg-white dark:bg-gray-700 shadow p-6 rounded-lg">
                    <h3 className="flex justify-between items-center">
                        <span className="text-indigo-500 dark:!text-indigo-400 font-semibold text-lg">
                            Entrevue à venir
                        </span>
                        <i className="pi pi-ellipsis-v cursor-pointer dark:text-white"/>
                    </h3>

                    <p className='text-sm mt-4 dark:text-white'>
                        Consulter votre planning d'entrevue à venir ici
                    </p>

                    <div className="mt-6 space-y-4">
                        {interviews.map((appt, index) => (
                        <div 
                            key={index} 
                            className="flex items-center justify-between bg-gray-100 dark:!bg-gray-600 dark:!text-white p-3 rounded-md"
                        >
                            <div className="flex items-center space-x-3">
                                <Avatar 
                                    image={appt.avatar} 
                                    shape="circle" 
                                    size="large" 
                                />
                                <div>
                                    <div className="font-medium text-sm">
                                        {appt.intern}
                                    </div>
                                    <div className="text-gray-500 dark:!text-gray-300 text-xs">
                                        {appt.reason}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-xs text-gray-500 dark:!text-gray-300">{appt.date}</div>
                                <div className="font-semibold text-sm">{appt.time}</div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default DashboardSupervisor