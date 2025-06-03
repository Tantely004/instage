/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TabView, TabPanel } from 'primereact/tabview'
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Chart } from 'primereact/chart'

import imgIntern from "../../assets/images/fake/intern2.png"

const ResourcesIntern = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,  
    }

    const files = [
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
        }
    ]

    const sharedFiles = [
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
            uploaded_by : {
                lastname : "John",
                firstname : "Doe",
                avatar: imgIntern,
            }
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
            uploaded_by : {
                lastname : "John",
                firstname : "Doe",
                avatar: imgIntern,
            }
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
            uploaded_by : {
                lastname : "John",
                firstname : "Doe",
                avatar: imgIntern,
            }
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
            uploaded_by : {
                lastname : "John",
                firstname : "Doe",
                avatar: imgIntern,
            }
        },
        {
            id: 1,
            name: "rapport test.pdf",
            type: "PDF",
            date: "02/03/2025",
            uploaded_by : {
                lastname : "John",
                firstname : "Doe",
                avatar: imgIntern,
            }
        }
    ]

    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['Document', 'Image', 'Compressé'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-300'), 
                        documentStyle.getPropertyValue('--indigo-500'), 
                        documentStyle.getPropertyValue('--gray-500')
                    ]
                }
            ]
        };
        const options = {
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    const idTemplate = (files) => (
        <span>
            #{files.id}
        </span>
    )

    const nameTemplate = (sharedFiles) => (
        <div className="flex items-center space-x-2">
            <img 
                src={sharedFiles.uploaded_by.avatar}
                className="w-8 h-8 rounded-full" 
                alt={`${sharedFiles.uploaded_by.firstname} ${sharedFiles.uploaded_by.lastname}`}
            />
            <span>
                {sharedFiles.uploaded_by.lastname} {sharedFiles.uploaded_by.firstname}
            </span>
        </div>
    )

    const actionTemplate = () => (
        <i className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400"/>
    )

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 mb-16"
        >
            <section className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-2xl text-indigo-500">
                        Ressources
                    </h2>
                    <p className="mt-3">
                        Retrouvez ici tous les fichiers partagés relatifs à votre stage
                    </p>
                </div>

                <i 
                    className="pi pi-ellipsis-h cursor-pointer hover:text-indigo-400"
                    title="Options"
                />
            </section>

            <section className="mt-8 grid grid-cols-3 gap-8">
                <div className="col-span-2 shadow p-4 rounded-lg">
                    <TabView>
                        <TabPanel header="Vos fichiers">
                            <DataTable 
                                value={files}
                                className="!font-poppins"
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5,10]}
                            >
                                <Column 
                                    header="ID"
                                    body={idTemplate}
                                />
                                <Column 
                                    field="name"
                                    header="Nom"
                                />
                                <Column 
                                    field="type"
                                    header="Type"
                                />
                                <Column 
                                    field="date"
                                    header="Date"
                                />
                                <Column 
                                    header="Action"
                                    body={actionTemplate}
                                />
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Fichiers partagés">
                            <DataTable 
                                value={sharedFiles}
                                className="!font-poppins"
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5,10]}
                            >
                                <Column 
                                    header="ID"
                                    body={idTemplate}
                                />
                                <Column 
                                    field="name"
                                    header="Nom"
                                />
                                <Column 
                                    field="type"
                                    header="Type"
                                />
                                <Column 
                                    field="date"
                                    header="Date"
                                />
                                <Column 
                                    header="Uploadé par"
                                    body={nameTemplate}
                                />
                                <Column 
                                    header="Action"
                                    body={actionTemplate}
                                /> 
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </div>

                <div className="col-span-1 flex flex-col space-y-8">
                    <div className="shadow p-4 rounded-lg">
                        <h3 className="text-indigo-400 font-semibold">
                            Répartition des fichiers
                        </h3>

                        <div className="mt-4 flex justify-center items-center space-x-4">
                            <Chart 
                                type="doughnut" 
                                data={chartData} 
                                options={chartOptions}
                                className="w-48" 
                            />

                            <div className="space-y-3 text-xs">
                                <p>
                                    <i className="pi pi-file-pdf text-indigo-300 mr-2"/> Document
                                </p>
                                <p>
                                    <i className="pi pi-image text-indigo-500 mr-2"/> Image
                                </p>
                                <p>
                                    <i className="pi pi-server text-gray-500 mr-2"/> Compressé
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="shadow p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-500">
                            Guide de référence
                        </h4>
                        <p className="mt-3">
                            Retrouvez ici présent les informations concernant les protocoles de suivi tout au long de votre stage au sein de l'entreprise
                        </p>

                        <div className="mt-6 space-y-4"> 
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <i className="pi pi-file-pdf text-gray-500"/>
                                    <p className="text-gray-700">
                                        Guide d'accueil.pdf
                                    </p>
                                </div>
                                <i className="pi pi-ellipsis-h hover:text-indigo-400"/>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <i className="pi pi-file-pdf text-gray-500"/>
                                    <p className="text-gray-700">
                                        Charte & règlement interne.pdf
                                    </p>
                                </div>
                                <i className="pi pi-ellipsis-h hover:text-indigo-400"/>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <i className="pi pi-file-pdf text-gray-500"/>
                                    <p className="text-gray-700">
                                        Présentation.pdf
                                    </p>
                                </div>
                                <i className="pi pi-ellipsis-h hover:text-indigo-400"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default ResourcesIntern