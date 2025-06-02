import { useState } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Dropdown } from 'primereact/dropdown'
import { useNavigate } from "react-router-dom"

const CreateUser = () => {
    const navigate = useNavigate()
    const [ selectedRole, setSelectedRole ] = useState('')
    const [ selectedLevel, setSelectedLevel ] = useState('')

    const roles = [
        {
            name: 'Stagiaire',
            value: 'intern',
        },
        {
            name: 'Encadreur',
            value: 'supervisor',
        },
        {
            name: 'Administrateur',
            value: 'admin',
        },
    ]

    const levels = [
        { name: 'Licence 1' },
        { name: 'Licence 2' },
        { name: 'Licence 3' },
        { name: 'Master 1' },
        { name: 'Master 2' },
    ]

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    }

    const pageTransition = {
        duration: 0.5,
    }

    const items = [
        { 
            label: 'Utilisateurs',
            command: () => navigate('/admin/users')
        },
        { 
            label: 'Ajouter',
            command: () => navigate('/admin/users/create')
        }, 
    ]
    const home = { 
        icon: 'pi pi-home', 
    }

    let establishmentLabel = "Établissement"
    let courseLabel = "Parcours"
    let levelLabel = "Niveau"

    if (selectedRole === "supervisor") {
        establishmentLabel = "Direction"
        courseLabel = "Département"
        levelLabel = "Poste"
    } else if (selectedRole === "admin") {
        establishmentLabel = "Direction"
        courseLabel = "Département"
        levelLabel = "Poste"
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
            <div>
                <BreadCrumb 
                    model={items} 
                    home={home}
                    className="!font-semibold !text-sm !bg-transparent !border-0 !p-0"
                    pt={{
                        label: { className: '!text-indigo-500' },
                    }}
                />
            </div>

            <form className="mt-10">
                <section>
                    <div className="flex justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-indigo-500">
                                Ajouter un utilisateur
                            </h1>
                            <p className="mt-3 w-[70%]">
                                Veuillez remplir le formulaire ci-dessous pour les informations de l'utilisateur en fonction de son rôle
                            </p>
                        </div>

                        <Button
                            icon="pi pi-upload"
                            label="Télécharger un fichier"
                            className="!text-sm !font-poppins !h-11"
                        />
                    </div>
                </section>

                <h3 className="mt-8 font-semibold text-gray-700">
                    Informations personnelles
                </h3>

                <section className="mt-6 bg-gray-50 shadow grid grid-cols-2 gap-8 items-center p-8 rounded-lg">
                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-user text-indigo-400 mr-3"/>
                            Nom
                        </label>
                        <InputText 
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-user text-indigo-400 mr-3"/>
                            Prénoms
                        </label>
                        <InputText 
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-envelope text-indigo-400 mr-3"/>
                            Adresse e-mail
                        </label>
                        <InputText 
                            type="email"
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-phone text-indigo-400 mr-3"/>
                            Contact
                        </label>
                        <InputText 
                            size="small"
                            className="!font-poppins"
                        />
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-lock text-indigo-400 mr-3"/>
                            Mot de passe <strong className="text-indigo-400">*</strong>
                        </label>
                        <div className="flex-1 space-x-2">
                            <Password
                                className="!font-poppins"
                                pt={{
                                    input: "!h-11 !w-[25.5rem]"
                                }}
                            />
                            <Button 
                                icon="pi pi-refresh"
                                className="!h-11 !w-11 !rounded-full"
                                title="Génerer le mot de passe"
                            />
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                        <label className="text-gray-600">
                            <i className="pi pi-user-plus text-indigo-400 mr-3"/>
                            Rôle
                        </label>
                        <Dropdown
                            value={selectedRole}
                            options={roles}
                            optionLabel="name"
                            placeholder="Sélectionner"
                            className="w-full !font-poppins"
                            panelClassName="!font-poppins"
                            onChange={(e) => setSelectedRole(e.value)}
                        />
                    </div>
                </section>

                <h3 className="mt-10 font-semibold text-gray-700">
                    Informations professionnelles
                </h3>

                <section className="mt-6 space-y-9 bg-gray-50 shadow p-8 rounded-lg">
                    <div>
                        <label className="text-gray-600 mr-20">
                            <i className="pi pi-graduation-cap text-indigo-400 mr-3"/>
                            {establishmentLabel}
                        </label>
                        <InputText 
                            size="small"
                            className="!font-poppins w-96"
                        />
                    </div>

                    <div>
                        <label className="text-gray-600 mr-[7.5rem]">
                            <i className="pi pi-briefcase text-indigo-400 mr-3"/>
                            {courseLabel}
                        </label>
                        <InputText 
                            size="small"
                            className="!font-poppins w-96"
                        />
                    </div>

                    <div>
                        <label className="text-gray-600 mr-[8.5rem]">
                            <i className="pi pi-align-center text-indigo-400 mr-3"/>
                            {levelLabel}
                        </label>
                        {
                            selectedRole === 'intern' ? (
                                <Dropdown 
                                    value={selectedLevel}
                                    options={levels}
                                    optionLabel="name"
                                    placeholder="Sélectionner"
                                    className="!font-poppins w-96"
                                    onChange={(e) => setSelectedLevel(e.value)}
                                />
                            ) : (
                                <InputText 
                                    size="small"
                                    className="!font-poppins w-96"
                                />
                            )
                        }
                    </div>
                </section>

                <Button 
                    label="Valider"
                    className="!h-11 !mt-12 !mb-8 !flex !justify-center !items-center !mx-auto !w-64 !rounded-full"
                />
            </form>
        </motion.div>
    )
}

export default CreateUser
