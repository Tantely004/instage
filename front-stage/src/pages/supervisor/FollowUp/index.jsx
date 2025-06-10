import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useNavigate } from "react-router-dom"
import axios from 'axios'

const FollowUpSupervisor = () => {
    const navigate = useNavigate()
    const [interns, setInterns] = useState([])
    const [projects, setProjects] = useState([])
    const [reports, setReports] = useState([])

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }
    const pageTransition = {
        duration: 0.5,
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    console.error('Aucun token trouvé dans localStorage');
                    return;
                }
                const response = await axios.get('http://127.0.0.1:8000/api/follow-up-supervisor/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterns(response.data.interns || []);
                setProjects(response.data.projects || []);
                setReports(response.data.reports || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error.response ? error.response.data : error.message);
            }
        };
        fetchData();
    }, []);

    const idTemplate = (rowData) => (
        <span>#{rowData.idIntern || rowData.id}</span>
    )

    const nameTemplate = (rowData) => (
        <span>{rowData.lastname} {rowData.firstname}</span>
    )

    const progressTemplate = (rowData) => (
        <span>{rowData.progress}%</span>
    )

    const actionTemplate = () => (
        <i className='pi pi-ellipsis-h'/>
    )

    const folderTemplate = () => (
        <i className='pi pi-folder'/>
    )

    const progressProjectTemplate = (rowData) => (
        <span>{rowData.progress}%</span>
    )

    const idReportTemplate = (rowData) => (
        <span>#{rowData.id}</span>
    )

    const actionReportTemplate = () => (
        <i className='pi pi-ellipsis-h'/>
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
            <h1 className='font-bold text-2xl text-indigo-400'>
                Suivi
            </h1>

            <p className='mt-3'>
                Supervisez l'évolution et les performances de chaque stagiaire sur leur activités vis-à-vis des projets de l'entreprise
            </p>

            <section className='mt-8 grid grid-cols-3 gap-8'>
                <div className='col-span-2 shadow rounded-lg p-6'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-gray-700 font-semibold text-lg'>
                            Liste des stagiaires
                        </h3>
                        <i 
                            className='pi pi-clock cursor-pointer hover:text-indigo-400'
                            title='Historique'
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
                                header='Progression'
                                body={progressTemplate}
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
                                Vos projets
                            </h3>
                            <i 
                                className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400'
                                title='Options'
                            />
                        </div>

                        <div className='mt-4'>
                            <DataTable
                                value={projects}
                                onRowClick={() => navigate('/supervisor/follow-up/project')}
                                className='!cursor-pointer'
                            >
                                <Column 
                                    body={folderTemplate}
                                />
                                <Column 
                                    field='title'
                                />
                                <Column 
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
                        />
                    </div>
                </div>
            </section>

            <section className='mt-12 grid grid-cols-3 gap-8'>
                <div className='col-span-2 flex flex-col justify-between space-y-8 shadow p-6 rounded-lg'>
                    <div>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-gray-700 font-semibold text-lg'>
                                Récents rapports
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
                                    field='document'
                                    header='Document'
                                />
                                <Column 
                                    field='date'
                                    header='Date'
                                />
                                <Column 
                                    field='intern'
                                    header='Stagiaire'
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
                        />
                    </div>
                </div>

                <div className='col-span-1 flex flex-col space-y-8'>
                    <div className='shadow p-6 rounded-lg'>
                        <p className='text-center'>
                            Organisez votre programme de réalisation efficacement à partir de système interactif
                        </p>

                        <Button 
                            label='Créer un planning'
                            className='!mt-8 !border-none !flex !justify-center !items-center !mx-auto'
                        />
                    </div>

                    <div className=' bg-indigo-400 p-6 rounded-lg'>
                        <p className='text-white font-semibold text-center'>
                            Générez le rapport d'évaluation finale détaillant les compétences et appréciations du stagiaire, pret à etre exporté et partagé
                        </p>

                        <Button 
                            label='Génerer le rapport'
                            className='!mt-8 !bg-gray-700 !border-none !flex !justify-center !items-center !mx-auto'
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default FollowUpSupervisor