import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { TabView, TabPanel } from 'primereact/tabview'
import { Column } from "primereact/column"
import { Chart } from 'primereact/chart'

import imgIntern from "../../assets/images/fake/intern2.png"

const ResourcesSupervisor = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const sharedFiles = [
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


    const receivedFiles = [
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

    const projectFiles = [
        {
            id: 1,
            name : "Cahier_de_charges_instage.pdf",
        },
        {
            id: 1,
            name : "Cahier_de_charges_instage.pdf",
        },
        {
            id: 1,
            name : "Cahier_de_charges_instage.pdf",
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
            className={`mb-12 min-w-full`}
        >
            <section className="flex justify-between items-center h-full">
                <div>
                    <h2 className="font-semibold text-2xl text-indigo-500">
                        Ressources (500)
                    </h2>
                    <p className="mt-3 w-[70%]">
                        Retrouvez ici tous les fichiers partagés vis-à-vis des projets et des rapports de vos stagiaires
                    </p>
                </div>

                <div>
                    <Button
                        icon="pi pi-share-alt"
                        label='Partager un fichier'
                        className='!h-10'
                    />
                </div>
            </section>

            <section className="mt-8 grid grid-cols-3 h-full gap-8">
                <div className="col-span-2 shadow p-4 rounded-lg h-full">
                    <TabView>
                        <TabPanel header="Fichiers reçus">
                            <DataTable 
                                value={receivedFiles}
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
                                    header="Action"
                                    body={actionTemplate}
                                /> 
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </div>

                <div className="col-span-1 flex flex-col space-y-8 h-full">
                    <div className="shadow p-4 rounded-lg">
                        <h3 className="text-indigo-400 font-semibold">
                            Répartition des fichiers
                        </h3>

                        <div className="mt-4 flex flex-col space-y-5 justify-center items-center space-x-4">
                            <Chart 
                                type="doughnut" 
                                data={chartData} 
                                options={chartOptions}
                                className="w-48" 
                            />

                            <div className="flex justify-between gap-4 items-center text-xs">
                                <p>
                                    <i className="pi pi-file-pdf text-indigo-300"/> Document
                                </p>
                                <p>
                                    <i className="pi pi-image text-indigo-500"/> Image
                                </p>
                                <p>
                                    <i className="pi pi-server text-gray-500"/> Compressé
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="shadow p-4 flex flex-col justify-between h-full rounded-lg">
                        <div>
                            <h4 className="font-semibold text-lg text-indigo-500">
                                Vos fiches projets
                            </h4>

                            <div className="mt-6 space-y-6 w-full">
                                {
                                    projectFiles.map((file) => (
                                        <div
                                            key={file.id} 
                                            className="flex justify-between w-full items-center text-sm"
                                        >
                                            <div className="flex items-center space-x-3 max-w-52">
                                                <i className="pi pi-file-pdf text-indigo-400" />
                                                <p className="truncate text-ellipsis whitespace-nowrap w-full">
                                                    {file.name}
                                                </p>
                                            </div>
                                            <i className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-400" />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div>
                            <Button
                                icon="pi pi-clock"
                                label='Voir les historiques'
                                className='!flex !justify-center !items-center !mx-auto !border-none !bg-transparent !text-indigo-400'
                            />
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default ResourcesSupervisor