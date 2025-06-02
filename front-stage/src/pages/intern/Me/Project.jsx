/* eslint-disable no-unused-vars */
import { BreadCrumb } from 'primereact/breadcrumb'
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ProjectIntern = () => {
    const navigate = useNavigate()

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,  
    }

    const items = [
        { label: 'Projet' },
        { label: 'Instage' }
    ]

    const back = { 
        icon: 'pi pi-arrow-left', 
        command : () => {
            navigate('/intern/me')
        }
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 mb-16"
        >
            <section className='mt-4'>
                <BreadCrumb 
                    model={items}
                    home={back}
                    className='!border-none !font-semibold'
                    pt={{
                        icon: "!text-indigo-400",
                        label: "!text-indigo-400",
                        separator: "!text-indigo-400",
                    }}
                />
            </section>
        </motion.div>
    )
}

export default ProjectIntern