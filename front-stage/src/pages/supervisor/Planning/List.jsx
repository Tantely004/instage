// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import imgIntern from "../../../assets/images/fake/intern2.png"

const ListPlanning = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const plannings = [
        {
            id: 1,
            title: "Entrevue - Rapport test",
            intern: {
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            date: "03/06/2025",
            files: ["test.pdf"],
        },
        {
            id: 1,
            title: "Entrevue - Rapport test",
            intern: {
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            date: "03/06/2025",
            files: ["test.pdf"],
        },
        {
            id: 1,
            title: "Entrevue - Rapport test",
            intern: {
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            date: "03/06/2025",
            files: ["test.pdf"],
        },
        {
            id: 1,
            title: "Entrevue - Rapport test",
            intern: {
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            date: "03/06/2025",
            files: ["test.pdf"],
        },
        {
            id: 1,
            title: "Entrevue - Rapport test",
            intern: {
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            date: "03/06/2025",
            files: ["test.pdf"],
        },
        {
            id: 1,
            title: "Entrevue - Rapport test",
            intern: {
                lastname: "John",
                firstname: "Doe",
                avatar: imgIntern,
            },
            date: "03/06/2025",
            files: ["test.pdf"],
        },
    ]

    const idTemplate = (plannings) => (
        <span>
            #{ plannings.id }
        </span>
    )

    const internTemplate = (plannings) => (
        <div className='flex items-center space-x-2'>
            <img 
                src={plannings.intern.avatar}
                className='w-8 h-8 rounded-full'
            />
            <p>
                { plannings.intern.lastname } { plannings.intern.firstname }
            </p>
        </div>
    )

    const fileTemplate = (plannings) => (
        <span>
            { plannings.files.map((file) => file).join() }
        </span>
    )

    const actionTemplate = () => (
        <i 
            className='pi pi-ellipsis-v cursor-pointer hover:text-indigo-400'
            title='Options'
        />
    )

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className='mb-20 min-w-[78vw]' 
        >
            <section>
                <h1 className='text-indigo-400 text-xl font-semibold'>
                    Journal de chronogramme
                </h1>
                <p className='mt-2'>
                    Retrouvez ici les suggestions de planning proposés par vos stagiaires
                </p>
            </section>

            <section className='mt-8'>
                <DataTable 
                    value={plannings} 
                    className='!font-poppins'
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5,10]}
                >
                    <Column 
                        header="ID"
                        body={idTemplate}
                    />
                    <Column 
                        header="Titre"
                        field='title'
                    />
                    <Column 
                        header="Stagiaire"
                        body={internTemplate}
                    />
                    <Column 
                        header="Date"
                        field='date'
                    />
                    <Column 
                        header="Pièces jointes"
                        body={fileTemplate}
                    />
                    <Column 
                        header="Action"
                        body={actionTemplate}
                    />
                </DataTable>
            </section>
        </motion.div>
    )
}

export default ListPlanning