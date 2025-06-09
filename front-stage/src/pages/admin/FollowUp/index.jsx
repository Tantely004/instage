// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FollowUpAdmin = () => {
    const navigate = useNavigate()
    const [interns, setInterns] = useState([])
    const [projects, setProjects] = useState([])
    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/api/follow-up-admin/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterns(response.data.interns || []);
                setProjects(response.data.projects || []);
                setReports(response.data.reports || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        };
        fetchData();
    }, []);

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const idTemplate = (rowData) => (
        <span>#{rowData.idIntern}</span>
    )

    const nameTemplate = (rowData) => (
        <span>{rowData.lastname} {rowData.firstname}</span>
    )

    const actionTemplate = () => (
        <i className='pi pi-ellipsis-h cursor-pointer hover:text-indigo-400' />
    )

    const folderTemplate = () => (
        <i className='pi pi-folder cursor-pointer hover:text-indigo-400' />
    )

    const progressProjectTemplate = (rowData) => (
        <span>{rowData.progress}%</span>
    )

    const idReportTemplate = (rowData) => (
        <span>#{rowData.id}</span>
    )

    const actionReportTemplate = () => (
        <i className='pi pi-ellipsis-h cursor-pointer hover:text-indigo-400' />
    )

    const documentTemplate = (rowData) => (
        <a href={`/api/documents/${rowData.document}`} target="_blank" rel="noopener noreferrer">
            {rowData.document || 'Aucun document'}
        </a>
    )

    const dateTemplate = (rowData) => (
        <span>{new Date(rowData.date).toLocaleDateString('fr-FR')}</span>
    )

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition} 
            className={`mb-12 max-w-[89vw]`}
        >
            <section className="flex justify-between">
                <div>
                    <h1 className='font-bold text-2xl text-indigo-400'>
                        Suivi
                    </h1>
                    <p className='mt-3 w-[75%]'>
                        Supervisez l'évolution et les performances de chaque stagiaire sur leur activités vis-à-vis des projets de l'entreprise
                    </p>
                </div>
                <Button 
                    icon="pi pi-plus"
                    label="Assigner"
                    className="!h-10"
                    onClick={() => navigate('/admin/follow-up/assign')}
                />
            </section>

            <section className='mt-8 grid grid-cols-3 gap-8'>
                <div className='col-span-2 shadow rounded-lg p-6'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-gray-700 font-semibold text-lg'>
                            Liste des stagiaires
                        </h3>
                        <i 
                            className='pi pi-clock cursor-pointer hover:text-indigo-400'
                            title='Historique'
                            onClick={() => navigate('/admin/follow-up/history')}
                        />
                    </div>
                    <div className='mt-4'>
                        <DataTable 
                            value={interns}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10]}
                        >
                            <Column
                                header='ID'
                                body={idTemplate}
                            />
                            <Column
                                header='Nom'
                                body={nameTemplate}
                            />
                            <Column
                                field='daysLeft'
                                header='Jours restants'
                            />
                            <Column
                                field='project'
                                header='Projet assigné'
                            />
                            <Column
                                field='supervisor'
                                header='Encadreur'
                            />
                            <Column
                                header='Action'
                                body={actionTemplate}
                            />
                        </DataTable>
                    </div>
                </div>

                <div className='flex flex-col justify-between col-span-1 shadow rounded-lg p-6'>
                    <div>
                        <div className='flex justify-between items-center'>
                            <h3 className='text-indigo-400 font-semibold text-lg'>
                                Projets
                            </h3>
                            <i 
                                className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400'
                                title='Options'
                            />
                        </div>
                        <div className='mt-4'>
                            <DataTable
                                value={projects}
                            >
                                <Column 
                                    body={folderTemplate}
                                />
                                <Column 
                                    field='title'
                                    header='Titre'
                                />
                                <Column 
                                    header='Progression'
                                    body={progressProjectTemplate}
                                />
                            </DataTable>
                        </div>
                    </div>
                    <div>
                        <Button 
                            icon="pi pi-clock"
                            label="Voir l'historique"
                            className='!flex !justify-center !items-center !mx-auto !bg-transparent !border-none !text-indigo-400 hover:!text-indigo-500'
                            onClick={() => navigate('/admin/follow-up/project-history')}
                        />
                    </div>
                </div>
            </section>

            <section className='mt-12 grid grid-cols-1'>
                <div className='col-span-2 flex flex-col justify-between space-y-8 shadow p-6 rounded-lg'>
                    <div>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-gray-700 font-semibold text-lg'>
                                Liste des rapports
                            </h2>
                            <i 
                                className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400'
                                title="Options"
                            />
                        </div>
                        <div className='mt-6'>
                            <DataTable value={reports}>
                                <Column 
                                    header='ID'
                                    body={idReportTemplate}
                                />
                                <Column 
                                    field='title'
                                    header='Intitulé'
                                />
                                <Column 
                                    header='Document'
                                    body={documentTemplate}
                                />
                                <Column 
                                    header='Date'
                                    body={dateTemplate}
                                />
                                <Column 
                                    field='intern'
                                    header='Stagiaire'
                                />
                                <Column 
                                    field='receiver'
                                    header='Destinataire'
                                />
                                <Column 
                                    header='Action'
                                    body={actionReportTemplate}
                                />
                            </DataTable>
                        </div>
                    </div>
                    <div>
                        <Button 
                            label='Voir tout'
                            className='!flex !justify-between !items-center !mx-auto !bg-transparent !text-indigo-400 !border-none'
                            onClick={() => navigate('/admin/follow-up/all-reports')}
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default FollowUpAdmin