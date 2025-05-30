import { useState } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { PanelMenu } from "primereact/panelmenu"

import imgSupervisor from "../../assets/images/img_profile_supervisor.png"

const ProfileSupervisor = () => {
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const [ personalInfo, setPersonalInfo ] = useState({
        lastname: "MANDIMBISOA",
        firstname: "Laza",
        email: "laza@gmail.com",
        contact: "+261 32 45 678 65",
        direction: "Finance",
        department: "IT & support",
        position: "Responsable informatique"
    })

    const [ passwordUser, setPasswordUser ] = useState({
        current: "taxandrian",
        new: '',
        confirm: '',
    })

    const [ personalLink, setPersonalLink ] = useState({
        linkedin: 'https://www.linkedin.com/in/janedoe',
        portfolio: 'https://janedoe-portfolio.com',
    })

    const sessionItems = [
        { 
            label: 'Connexions' ,
            items: [
                {
                    label: "Voir vos activités récentes",
                    icon: 'pi pi-clock'
                },
                {
                    label: "Appareils connectés",
                    icon: 'pi pi-mobile'
                },
            ]
        }
    ]

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition} 
            className={`mb-16 w-[75vw]`}
        >
            <form>
                <section className="flex justify-between w-full shadow-lg rounded-lg p-6">
                    <div className="flex space-x-6 items-center">
                        <div className="relative">
                            <img 
                                src={imgSupervisor} 
                                className="w-28 h-28 rounded-full"
                                alt="Profile"
                            />
                            <i 
                                className="pi pi-camera absolute text-gray-500 bottom-0 right-0 cursor-pointer hover:text-gray-400"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <h5 className="font-semibold text-lg">
                                MANDIMBISOA Laza
                            </h5>
                            <p className="text-gray-500">
                            <i className="pi pi-briefcase mr-2 text-indigo-500" />
                                Responsable informatique
                            </p>
                            <p className="text-gray-500">
                                <i className="pi pi-building mr-2 text-indigo-500" />
                                Département: IT & support
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between text-end">
                        <i 
                            className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-500"
                            title="Options"
                        />
                        <p className="text-gray-600 text-sm">
                            Dernière connexion: il y a 16 heures
                        </p>
                    </div>
                </section>

                <section className="mt-12 grid grid-cols-2 gap-8">
                    <div className="shadow-lg p-6 rounded-lg">
                        <h3 className="flex justify-between items-center">
                            <span className="text-indigo-500 text-xl font-semibold">
                                Informations personnelles
                            </span>
                            <i 
                                className="pi pi-pen-to-square text-gray-600 cursor-pointer hover:text-indigo-400"
                                title="Éditer"
                            />
                        </h3>
                        
                        <div className="mt-6 flex flex-col space-y-5">
                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-user text-indigo-400 mr-2"/> 
                                    Nom
                                </label>
                                <InputText 
                                    value={personalInfo.lastname}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-user text-indigo-400 mr-2"/> 
                                    Prénoms
                                </label>
                                <InputText 
                                    value={personalInfo.firstname}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-envelope text-indigo-400 mr-2"/> 
                                    Adresse e-mail
                                </label>
                                <InputText 
                                    type="email"
                                    value={personalInfo.email}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-envelope text-indigo-400 mr-2"/> 
                                    Contact
                                </label>
                                <InputText 
                                    value={personalInfo.contact}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-envelope text-indigo-400 mr-2"/> 
                                    Poste
                                </label>
                                <InputText 
                                    value={personalInfo.position}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-envelope text-indigo-400 mr-2"/> 
                                    Département
                                </label>
                                <InputText 
                                    value={personalInfo.department}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-envelope text-indigo-400 mr-2"/> 
                                    Direction
                                </label>
                                <InputText 
                                    value={personalInfo.direction}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="shadow-lg p-6 rounded-lg">
                            <h3 className="text-indigo-500 text-xl font-semibold">
                                Mot de passe & sécurité
                            </h3>

                            <div className="mt-4 flex justify-between items-center">                    
                                <p className="text-sm w-80">
                                    Votre mot de passe est fourni par l'administrateur. Vous pouvez personnaliser votre mot de passe à partir de cet alternative 
                                </p>
                                <i className="pi pi-info-circle text-xs cursor-pointer hover:text-indigo-400"/>
                            </div>

                            <div className="mt-8 flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-lock text-indigo-400 mr-2"/> Votre mot de passe actuel
                                </label>
                                <Password
                                    value={passwordUser.current}
                                    pt={{
                                        input: "!font-poppins !h-11"
                                    }}
                                />
                                <p className="mt-6 font-medium text-indigo-500 text-sm">
                                    <i className="pi pi-shield mr-3"/>
                                    Changer mot de passe ?
                                </p>
                            </div>

                            <div className="mt-8">
                                <PanelMenu 
                                    model={sessionItems}
                                    pt={{
                                        header: "!font-poppins !font-semibold",
                                        headerContent: '!border-none',
                                        panel: '!font-poppins',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="shadow-lg p-6 rounded-lg">
                            <h3 className="flex justify-between items-center">
                                <span className="text-indigo-500 text-xl font-semibold">
                                    Liens externes
                                </span>
                                <i 
                                    className="pi pi-pen-to-square cursor-pointer text-gray-600 hover:text-indigo-400"
                                    title="Éditer"
                                />
                            </h3>

                            <div className="mt-8 flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-linkedin text-indigo-500 mr-3" />
                                    Profil Linkedin
                                </label>
                                <InputText
                                    value={personalLink.linkedin}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>

                            <div className="mt-6 flex flex-col space-y-2">
                                <label className="text-gray-500">
                                    <i className="pi pi-globe text-indigo-500 mr-3" />
                                    Portfolio
                                </label>
                                <InputText
                                    value={personalLink.portfolio}
                                    size="small"
                                    className="!font-poppins"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </motion.div>
    )
}

export default ProfileSupervisor