import { useState, useEffect } from 'react'
import { Button } from "primereact/button"
import { Chart } from 'primereact/chart'
import { Dropdown } from 'primereact/dropdown'
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

import student from "../../assets/images/student.png"

const DashboardIntern = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const periods = [
        { name: 'Hebdomadaire', value: 'weekly' },
        { name: 'Mensuel', code: 'monthly' }
    ]

    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement)
        const textColor = documentStyle.getPropertyValue('--text-color')
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
        const data = {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [
                {
                    label: 'Tâches réalisées',
                    backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                    borderColor: documentStyle.getPropertyValue('--indigo-400'),
                    data: [11, 4, 6, 13]
                },
                {
                    label: 'Documents soumis',
                    backgroundColor: documentStyle.getPropertyValue('--gray-500'),
                    borderColor: documentStyle.getPropertyValue('--gray-500'),
                    data: [5, 2, 0, 1]
                }
            ]
        }
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        }

        setChartData(data)
        setChartOptions(options)
    }, [])

    const supervisions = [
        {
            id: 1,
            date: '03-04-2025',
            time: '15:15',
            room: '102',
            reason: ["Briefing projet", "Présentation avancement"],
        },
        {
            id: 2,
            date: '05-04-2025',
            time: '10:00',
            room: '201',
            reason: ["Suivi évaluation", "Correction livrables"],
        }
    ];

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 mb-16"
        >
            <div className="grid grid-cols-2 gap-8 items-center">
                <section className="col-span-1 flex justify-between items-center bg-gray-50 px-8 py-6 shadow border border-gray-100 rounded-lg">
                    <div>
                        <h1 className="text-2xl font-bold text-indigo-400">
                            Bonjour, Anthony Duval !
                        </h1>
                        <h2 className="font-bold mt-6">
                            Valorisez votre travail
                        </h2>
                        <p className="mt-2 mb-4">
                            Donnez une direction claire à votre stage avec un thème adapté
                        </p>

                        <Button
                            label="Générer un thème"
                        />
                    </div>
                    
                    <div className="">
                        <img 
                            src={student} 
                            width={300} 
                        />
                    </div>
                </section>

                <section className="col-span-1 grid grid-cols-2 gap-4 items-center">
                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-calendar text-xl" />
                        <div>
                            <h5 className="text-sm">
                                Jours restants
                            </h5>
                            <p className="text-4xl font-bold">
                                22
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-file text-xl" />
                        <div>
                            <h5 className="text-sm">
                                Documents soumis
                            </h5>
                            <p className="text-4xl font-bold">
                                10
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-briefcase text-xl" />
                        <div>
                            <h5 className="text-sm">
                                Tâches à réaliser
                            </h5>
                            <p className="text-4xl font-bold">
                                5
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-clock text-xl" />
                        <div>
                            <h5 className="text-sm">
                                Heures cumulées
                            </h5>
                            <p className="text-4xl font-bold">
                                289
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
                <section className="col-span-2 bg-gray-50 shadow rounded-md flex flex-col space-y-10 p-8">
                    <div className="flex justify-between items-center">
                        <h3 className='font-semibold text-lg'>
                            Rapports de tâches réalisées - Documents soumis
                        </h3>

                        <Dropdown
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.value)}
                            options={periods}
                            optionLabel="name"
                            placeholder={periods[0].name}
                            className='h-12'
                        />
                    </div>
                    
                    <Chart 
                        type="bar" 
                        data={chartData} 
                        options={chartOptions}
                        className='h-80'
                    />
                </section>

                <section className="col-span-1 bg-gray-50 shadow rounded-md p-8">
                    <h4 className='flex justify-between items-center'>
                        <span className='text-lg font-semibold text-indigo-500'>
                            Prochains supervisions
                        </span>

                        <i 
                            className='pi pi-ellipsis-v cursor-pointer'
                            title='Options'
                        />
                    </h4>

                    <div className="mt-6 space-y-6">
                        {supervisions.map((item) => (
                            <div key={item.id} className="bg-white cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="flex space-x-3 items-center text-sm font-medium text-gray-700">
                                        <span>
                                            📅
                                        </span>
                                        <div className='flex flex-col'>
                                            <span>
                                                {item.date}
                                            </span>
                                            <span>
                                                {item.time}
                                            </span>
                                        </div>
                                         
                                    </p>
                                    <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                                        Porte {item.room}
                                    </span>
                                </div>
                                
                                <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
                                    {item.reason.map((r, index) => (
                                        <li key={index} className='mb-2'>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    )
}

export default DashboardIntern