import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useReport from '../../composables/useReport'; // Importer useReport

const DashboardAdmin = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    };

    const pageTransition = {
        duration: 0.5,
    };

    const { fetchDashboardData, dashboardData, loading, error } = useReport();
    const [internChartData, setInternChartData] = useState({});
    const [internChartOptions, setInternChartOptions] = useState({});
    const [levelChartData, setLevelChartData] = useState({});
    const [levelChartOptions, setLevelChartOptions] = useState({});

    // Récupérer les données au chargement du composant
    useEffect(() => {
        fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Mettre à jour le graphique des statistiques de stage
    useEffect(() => {
        if (dashboardData && dashboardData.stage_statistics) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            const data = {
                labels: dashboardData.stage_statistics.labels,
                datasets: [
                    {
                        label: 'Nombre de stages',
                        backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                        borderColor: documentStyle.getPropertyValue('--indigo-400'),
                        data: dashboardData.stage_statistics.data,
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

            setInternChartData(data);
            setInternChartOptions(options);
        }
    }, [dashboardData]);

    // Mettre à jour le graphique de répartition par niveau
    useEffect(() => {
        if (dashboardData && dashboardData.level_distribution) {
            const documentStyle = getComputedStyle(document.documentElement);
            const data = {
                labels: dashboardData.level_distribution.labels,
                datasets: [
                    {
                        data: dashboardData.level_distribution.data,
                        backgroundColor: [
                            documentStyle.getPropertyValue('--indigo-500'),
                            documentStyle.getPropertyValue('--gray-500'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--indigo-600'),
                            documentStyle.getPropertyValue('--gray-600'),
                        ],
                    },
                ],
            };

            const options = {
                cutout: '60%',
            };

            setLevelChartData(data);
            setLevelChartOptions(options);
        }
    }, [dashboardData]);

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div className="text-red-600 text-center">{error}</div>;
    }

    if (!dashboardData) {
        return <div></div>;
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="mb-12"
        >
            <section className="grid grid-cols-5 gap-8 items-center">
                <div className="border border-gray-200 shadow p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-users text-indigo-400 text-2xl" />
                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">Stagiaires</h4>
                        <p className="font-bold text-indigo-400 text-3xl">{dashboardData.users.interns}</p>
                    </div>
                </div>

                <div className="border border-gray-200 shadow p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-users text-indigo-400 text-2xl" />
                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">Encadreurs</h4>
                        <p className="font-bold text-indigo-400 text-3xl">{dashboardData.users.instructors}</p>
                    </div>
                </div>

                <div className="border border-gray-200 shadow p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-users text-indigo-400 text-2xl" />
                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">Administrateurs</h4>
                        <p className="font-bold text-indigo-400 text-3xl">{dashboardData.users.admins}</p>
                    </div>
                </div>

                <div className="border border-gray-200 shadow p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-file text-indigo-400 text-2xl" />
                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">Rapports</h4>
                        <p className="font-bold text-indigo-400 text-3xl">{dashboardData.documents.reports}</p>
                    </div>
                </div>

                <div className="border border-gray-200 shadow p-4 rounded-lg flex items-center space-x-4">
                    <i className="pi pi-file text-indigo-400 text-2xl" />
                    <div className="flex flex-col space-y-1">
                        <h4 className="text-sm">Attestations</h4>
                        <p className="font-bold text-indigo-400 text-3xl">{dashboardData.documents.attestations}</p>
                    </div>
                </div>
            </section>

            <section className="mt-8 grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-white shadow p-6 rounded-md">
                    <h2 className="flex justify-between items-center">
                        <span className="text-indigo-600 font-semibold text-lg">Statistiques de stage</span>
                    </h2>

                    <div className="mt-4">
                        <Chart
                            type="bar"
                            data={internChartData}
                            options={internChartOptions}
                            className="h-80"
                        />
                    </div>
                </div>

                <div className="col-span-1 bg-white shadow p-6 rounded-md">
                    <h2 className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Répartition par niveau</span>
                        <i className="pi pi-ellipsis-v cursor-pointer" title="Options" />
                    </h2>

                    <div className="mt-6">
                        <Chart
                            type="doughnut"
                            data={levelChartData}
                            options={levelChartOptions}
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default DashboardAdmin;