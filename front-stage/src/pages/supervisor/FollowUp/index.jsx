// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'

const FollowUpSupervisor = () => {
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
            progress: 43,
        },
        {
            idIntern: "STA2348988",
            lastname: "John",
            firstname: "Doe",
            daysLeft: 22,
            project: "Instage",
            progress: 43,
        },
        {
            idIntern: "STA2348988",
            lastname: "John",
            firstname: "Doe",
            daysLeft: 22,
            project: "Instage",
            progress: 43,
        },
        {
            idIntern: "STA2348988",
            lastname: "John",
            firstname: "Doe",
            daysLeft: 22,
            project: "Instage",
            progress: 43,
        }
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

    const progressTemplate = (interns) => {
        return (
            <span>
                {interns.progress}%
            </span>
        )
    }

    const actionTemplate = () => {
        return (
            <i className='pi pi-ellipsis-v'/>
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

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition} 
            className={`mb-12 w-[75.5vw]`}
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

                    <div >
                        <Button 
                            icon="pi pi-clock"
                            label="Voir l'historique"
                            className='!flex !justify-center !items-center !mx-auto !bg-transparent !border-none !text-indigo-400 hover:!text-indigo-500'
                        />
                    </div>
                </div>
            </section>

            <section className='grid grid-cols-3 gap-8'>
                <div className='col-span-2'>

                </div>

                <div className='col-span-1'>

                </div>
            </section>
        </motion.div>
    )
}

export default FollowUpSupervisor