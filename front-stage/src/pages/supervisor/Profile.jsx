import { useState, useEffect } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { PanelMenu } from "primereact/panelmenu"
import useProfile from "../../composables/useProfile"

import imgSupervisor from "../../assets/images/img_profile_supervisor.png"

const ProfileSupervisor = () => {
    const { fetchProfileData, profileData, loading, error } = useProfile()
    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const [personalInfo, setPersonalInfo] = useState({
        lastname: "",
        firstname: "",
        email: "",
        contact: "",
        direction: "",
        department: "",
        position: "",
    })

    const [passwordUser, setPasswordUser] = useState({
        current: "",
        new: '',
        confirm: '',
    })

    const [personalLink, setPersonalLink] = useState({
        linkedin: '',
        portfolio: '',
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

    useEffect(() => {
        fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (profileData) {
            const userData = profileData.user || {}
            const instructorData = profileData.instructor || {}
            setPersonalInfo({
                lastname: userData.name || "",
                firstname: userData.firstname || "",
                email: userData.mail || "",
                contact: userData.contact || "",
                direction: instructorData.management || "",
                department: instructorData.department || "",
                position: instructorData.position || "",
            })
            // Les champs de mot de passe et liens restent vides par défaut ou à gérer via une API spécifique
        }
    }, [profileData])

    if (loading) {
        return <div></div>
    }

    if (error) {
        return <div className="text-red-600 text-center">{error}</div>
    }

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
                                src={profileData?.user?.image || imgSupervisor} 
                                className="w-28 h-28 rounded-full"
                                alt="Profile"
                            />
                            <i 
                                className="pi pi-camera absolute text-gray-500 bottom-0 right-0 cursor-pointer hover:text-gray-400"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <h5 className="font-semibold text-lg">
                                {`${personalInfo.lastname} ${personalInfo.firstname}`}
                            </h5>
                            <p className="text-gray-500">
                                <i className="pi pi-briefcase mr-2 text-indigo-500" />
                                {personalInfo.position}
                            </p>
                            <p className="text-gray-500">
                                <i className="pi pi-building mr-2 text-indigo-500" />
                                Département: {personalInfo.department}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between text-end">
                        <i 
                            className="pi pi-ellipsis-v cursor-pointer hover:text-indigo-500"
                            title="Options"
                        />
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
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastname: e.target.value })}
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
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstname: e.target.value })}
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
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
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
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, contact: e.target.value })}
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
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, position: e.target.value })}
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
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, department: e.target.value })}
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
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, direction: e.target.value })}
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
                                    onChange={(e) => setPasswordUser({ ...passwordUser, current: e.target.value })}
                                    pt={{
                                        input: "!font-poppins !h-11"
                                    }}
                                    placeholder="********"
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
                                    onChange={(e) => setPersonalLink({ ...personalLink, linkedin: e.target.value })}
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
                                    onChange={(e) => setPersonalLink({ ...personalLink, portfolio: e.target.value })}
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