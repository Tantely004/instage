import { useState, useEffect } from 'react';
import { Button } from "primereact/button";
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import student from "../../assets/images/student.png";
import useReport from '../../composables/useReport'; // Importer le nouveau hook

const DashboardIntern = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    };

    const pageTransition = { duration: 0.5 };

    const { fetchDashboardData, dashboardData, loading, error } = useReport();
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const periods = [
        { name: 'Hebdomadaire', value: 'weekly' },
        { name: 'Mensuel', value: 'monthly' },
    ];

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    // Récupérer les données au chargement du composant
    useEffect(() => {
        fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Mettre à jour le graphique lorsque les données ou la période changent
    useEffect(() => {
        if (dashboardData && dashboardData.statistics) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            const labels = selectedPeriod === 'weekly'
                ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
                : ['Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6', 'Mois 7', 'Mois 8', 'Mois 9', 'Mois 10', 'Mois 11', 'Mois 12'];

            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Tâches réalisées',
                        backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                        borderColor: documentStyle.getPropertyValue('--indigo-400'),
                        data: dashboardData.statistics.toDoCompleted[selectedPeriod],
                    },
                    {
                        label: 'Documents soumis',
                        backgroundColor: documentStyle.getPropertyValue('--gray-500'),
                        borderColor: documentStyle.getPropertyValue('--gray-500'),
                        data: dashboardData.statistics.document[selectedPeriod],
                    },
                ],
            };

            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500,
                            },
                        },
                        grid: {
                            display: false,
                            drawBorder: false,
                        },
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                },
            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [dashboardData, selectedPeriod]);

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div className="text-red-600 text-center">{error}</div>;
    }

    if (!dashboardData) {
        return <div></div>;
    }

    const user = JSON.parse(localStorage.getItem('user')); // Récupérer les infos de l'utilisateur connecté
    const today = new Date(); // Date et heure actuelles (10:58 AM EAT, 28 mai 2025)

    // Filtrer les supervisions en prenant en compte la date et l'heure
    const upcomingSupervisions = dashboardData.supervisions.filter((supervision) => {
        const interview = supervision.report.interview;
        const interviewDateTime = new Date(`${interview.date}T${interview.time}`); // Combiner date et heure
        console.log("Interview DateTime:", interviewDateTime, "Today:", today, "Is Upcoming:", interviewDateTime >= today);
        return interviewDateTime >= today;
    });

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
                            Bonjour, {user.firstname} {user.name} !
                        </h1>
                        <h2 className="font-bold mt-6">
                            Valorisez votre travail
                        </h2>
                        <p className="mt-2 mb-4">
                            Donnez une direction claire à votre stage avec un thème adapté
                        </p>

                        <Button label="Générer un thème" />
                    </div>

                    <div className="">
                        <img src={student} width={300} alt="Student" />
                    </div>
                </section>

                <section className="col-span-1 grid grid-cols-2 gap-4 items-center">
                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-calendar text-xl" />
                        <div>
                            <h5 className="text-sm">Jours restants</h5>
                            <p className="text-4xl font-bold">{dashboardData.daysLeft}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-file text-xl" />
                        <div>
                            <h5 className="text-sm">Documents soumis</h5>
                            <p className="text-4xl font-bold">{dashboardData.documents}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-briefcase text-xl" />
                        <div>
                            <h5 className="text-sm">Tâches à réaliser</h5>
                            <p className="text-4xl font-bold">{dashboardData.toDo}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-400 flex items-center space-x-4 text-white p-4 rounded-lg shadow">
                        <i className="pi pi-clock text-xl" />
                        <div>
                            <h5 className="text-sm">Heures cumulées</h5>
                            <p className="text-4xl font-bold">{dashboardData.cumulatedHour}</p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
                <section className="col-span-2 bg-gray-50 shadow rounded-md flex flex-col space-y-10 p-8">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">
                            Rapports de tâches réalisées - Documents soumis
                        </h3>

                        <Dropdown
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.value)}
                            options={periods}
                            optionLabel="name"
                            placeholder={periods[0].name}
                            className="h-12"
                        />
                    </div>

                    <Chart
                        type="bar"
                        data={chartData}
                        options={chartOptions}
                        className="h-80"
                    />
                </section>

                <section className="col-span-1 bg-gray-50 shadow rounded-md p-8">
                    <h4 className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-indigo-500">
                            Prochains supervisions
                        </span>
                        <i className="pi pi-ellipsis-v cursor-pointer" title="Options" />
                    </h4>

                    <div className="mt-6 space-y-6">
                        {upcomingSupervisions.length > 0 ? (
                            upcomingSupervisions.map((supervision) => {
                                const report = supervision.report;
                                const interview = report.interview;
                                return (
                                    <div
                                        key={report.id}
                                        className="bg-white cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex space-x-3 items-center text-sm font-medium text-gray-700">
                                                <span>📅</span>
                                                <div className="flex flex-col">
                                                    <span>{interview.date}</span>
                                                    <span>{interview.time}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                                                Porte {interview.room}
                                            </span>
                                        </div>

                                        <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
                                            {interview.subjects.map((subject, index) => (
                                                <li key={index} className="mb-2">{subject}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Aucune supervision à venir.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default DashboardIntern;