import { Button } from "primereact/button"
import Footer from "../components/Footer"
import Logo from "../components/Logo"

import imgMain from "../assets/images/img-main.png"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()

    const redirectToLogin = () => {
        navigate('/login')
    }

    const pageVariants = {
        initial: { opacity: 0, y: -5 },
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
            className="px-32 relative flex flex-col justify-between h-screen overflow-hidden bg-white"
        >
            <div className="mt-4">
                <Logo />
            </div>

            <section className="grid grid-cols-2 items-end gap-x-20 -mt-12">
                <motion.div
                    className="flex flex-col gap-y-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="font-bold text-4xl text-black leading-snug">
                        Bienvenue sur la plateforme{" "}
                        <span className="text-blue-900 text-5xl">InStage</span>
                    </h1>

                    <h3 className="font-semibold text-gray-800">
                        Gérez, suivez et valorisez chaque étape du parcours de stage !
                    </h3>

                    <p className="-mt-7">
                        InStage est votre espace centralisé de gestion de stages, conçu pour simplifier la collaboration entre stagiaires, encadreurs et administrateurs.
                    </p>

                    <Button
                        icon="pi pi-arrow-right"
                        label="Commencer"
                        className="text-sm text-white w-44 font-semibold py-2 px-5 bg-blue-900 border-none shadow-md hover:bg-blue-800"
                        onClick={redirectToLogin}
                    />
                </motion.div>

                <motion.div
                    className="relative flex justify-center mx-auto overflow-visible"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative bg-indigo-400 h-48 w-[28rem] rounded-bl-lg overflow-visible" />
                </motion.div>

                <motion.img
                    src={imgMain}
                    alt="Main picture"
                    className="absolute w-[40rem] right-1/16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                />

                <motion.div
                    className="absolute top-20 right-1/6 rounded-full bg-gray-600 shadow-lg"
                    initial={{ y: -10 }}
                    animate={{ y: [ -10, 0, -10 ] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                    <i className="pi pi-briefcase text-white p-3 text-lg" />
                </motion.div>

                <motion.div
                    className="absolute top-44 right-[30rem] rounded-full bg-gray-600 shadow-lg"
                    initial={{ y: 10 }}
                    animate={{ y: [ 10, 0, 10 ] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                >
                    <i className="pi pi-graduation-cap text-white p-3 text-lg" />
                </motion.div>
            </section>

            <div className="mb-12">
                <Footer />
            </div>
        </motion.div>
    )
}

export default Home
