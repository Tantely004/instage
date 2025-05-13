import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { motion } from "framer-motion"

import Logo from '../components/Logo'

import loginImage from '../assets/images/login-image.jpg'

const Login = () => {
    const goBack = () => {
        window.history.back()
    }

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    const handleLogin = () => {
        setLoading(true)

        setTimeout(() => {
            navigate('/intern/dashboard')
            setLoading(false)
        }, 3000);
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            class="grid grid-cols-2 h-screen overflow-hidden"
        >
            <div className="relative">
                <div className='absolute top-6 left-12'>
                    <Logo />  
                </div>

                <img 
                    src={loginImage}
                    alt="Main login"
                    className='h-screen w-full'
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            
                <div className="absolute bottom-20 left-12 z-20 text-white w-[80%] space-y-4">
                    <h2 className="text-3xl font-bold leading-tight">
                        Gérez vos stages en toute simplicité
                    </h2>
                    <p className="font-medium text-white w-[75%]">
                        InStage vous accompagne à chaque étape du parcours de stage : communication, suivi, validation et valorisation.
                    </p>
                </div>
            </div>

            <div className="p-12">
                <i 
                    className="pi pi-arrow-left hover:text-indigo-500 cursor-pointer"
                    title="Retour"
                    onClick={goBack}
                />

                <form className='mt-12'>
                    <div class="flex flex-col space-y-6 items-center">
                        <h4 className='text-center text-blue-800/80 text-3xl font-semibold'>
                            Bonjour !
                        </h4>
                        <p class="text-center w-[75%]">
                            Pour vous connecter, renseignez votre identifiant ainsi que votre mot de passe
                        </p>
                    </div>

                    <div className="mt-12 flex flex-col space-y-6 items-center">
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-user text-indigo-400"> </InputIcon>
                            <InputText placeholder="Identifiant" className="w-[28rem]"/>
                        </IconField>

                        <div className="relative">
                            <i className="pi pi-lock absolute top-1/2 left-3 z-30 -translate-y-1/2 text-gray-500" />
                            <Password
                                placeholder="Mot de passe"
                                toggleMask
                                pt={{
                                    input: { className: "indent-7 w-[28rem] z-10" },
                                }}
                            />
                        </div>
                    </div>

                    <Button
                         label="Se connecter"
                         unstyled
                         loading={loading}
                         className="cursor-pointer flex justify-center px-6 items-center mx-auto mt-12 bg-gray-600 w-[28rem] border-none text-white font-medium py-2 rounded"
                         onClick={handleLogin}
                    />
                </form>
            </div>
        </motion.div>
    )
}

export default Login