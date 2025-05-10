import { motion } from "framer-motion"

const DashboardIntern = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 grid grid-cols-3 items-center"
        >
            <section className="col-span-2">
                
            </section>

            <section className="col-span-1">

            </section>
        </motion.div>
    )
}

export default DashboardIntern