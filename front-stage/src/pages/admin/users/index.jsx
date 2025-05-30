// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

const Users = () => {
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
            className={`mb-12`}
        >
            Utilisateurs
        </motion.div>
    )
}

export default Users