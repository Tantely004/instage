// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

const FollowUpAdmin = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }


    const interns = [
        {
            idIntern: "STA2348988",
            lastname: "John",
            firstname: "Doe",
            daysLeft: 22,
            project: "Instage",
            supervisor: "Emilie Jane",
        },
        {
            idIntern: "STA2348988",
            lastname: "John",
            firstname: "Doe",
            daysLeft: 22,
            project: "Instage",
            supervisor: "Emilie Jane",
        },
        {
            idIntern: "STA2348988",
            lastname: "John",
            firstname: "Doe",
            daysLeft: 22,
            project: "Instage",
            supervisor: "Emilie Jane",
        },
        {
            idIntern: "STA2348988",
            lastname: "John",
            firstname: "Doe",
            daysLeft: 22,
            project: "Instage",
            supervisor: "Emilie Jane",
        },
    ]

    const projects = [
        {
            id: 1,
            title: "Instage",
            progress: 43,
        },
        {
            id: 1,
            title: "Instage",
            progress: 43,
        },
        {
            id: 1,
            title: "Instage",
            progress: 43,
        },
        {
            id: 1,
            title: "Instage",
            progress: 43,
        },
    ]

    const reports = [
        {
            id: 1,
            title: 'Rapport test front-end',
            document: 'rapport_test.pdf',
            date: '2024-05-19',
            intern: 'John Doe',
            receiver: 'Emilie Jane',
        },
        {
            id: 1,
            title: 'Rapport test front-end',
            document: 'rapport_test.pdf',
            date: '2024-05-19',
            intern: 'John Doe',
            receiver: 'Emilie Jane',
        },
        {
            id: 1,
            title: 'Rapport test front-end',
            document: 'rapport_test.pdf',
            date: '2024-05-19',
            intern: 'John Doe',
            receiver: 'Emilie Jane',
        },
    ]

    const idTemplate = (interns) => {
        return (
            <span>
                #{interns.idIntern}
            </span>
        )
    }

    const nameTemplate = (interns) => {
        return (
            <span>
                {interns.lastname} {interns.firstname}
            </span>
        )
    }

    const actionTemplate = () => {
        return (
            <i className='pi pi-ellipsis-h'/>
        )
    }

    const folderTemplate = () => {
        return (
            <i className='pi pi-folder'/>
        )
    }

    const progressProjectTemplate = (projects) => {
        return (
            <span>
                {projects.progress}%
            </span>
        )
    }

    const idReportTemplate = (reports) => {
        return (
            <span>
                #{reports.id}
            </span>
        )
    }

    const actionReportTemplate = () => {
        return (
            <i className='pi pi-ellipsis-h'/>
        )
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition} 
            className={`mb-12 w-[75.5vw]`}
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
                        />
                    </div>

                    <div className='mt-4'>
                        <DataTable 
                            value={interns}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5,10]}
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
                                header='Progression'
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
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default FollowUpAdmin