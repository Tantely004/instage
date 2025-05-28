import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { PanelMenu } from "primereact/panelmenu";
import { Chip } from "primereact/chip";

import imgIntern from "../../assets/images/fake/intern2.png";

const ProfileIntern = () => {
    const sessionItems = [
        {
            label: "Connexions",
            items: [
                {
                    label: "Voir vos activités récentes",
                    icon: "pi pi-clock",
                },
                {
                    label: "Appareils connectés",
                    icon: "pi pi-mobile",
                },
            ],
        },
    ];

    const pageVariants = {
        initial: { opacity: 0, y: -10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -5 },
    };

    const pageTransition = {
        duration: 0.5,
    };

    const [personalInfo, setPersonalInfo] = useState({
        lastname: "",
        firstname: "",
        email: "",
        contact: "",
        etablishment: "",
        domain: "",
        level: "",
    });

    const [passwordUser, setPasswordUser] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [personalLink, setPersonalLink] = useState({
        linkedin: "",
        portfolio: "",
        github: "",
    });

    // Récupérer les données de l'utilisateur depuis localStorage au chargement
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setPersonalInfo({
                lastname: storedUser.name || "",
                firstname: storedUser.firstname || "",
                email: storedUser.mail || "",
                contact: storedUser.contact || "",
                etablishment: storedUser.etablishment || "", // Peut nécessiter un ajustement selon le modèle
                domain: storedUser.sector || "", // Ajustement possible selon le rôle
                level: storedUser.level || "", // Ajustement possible selon le rôle
            });
            setPasswordUser((prev) => ({
                ...prev,
                current: "", // Pas récupéré depuis localStorage pour des raisons de sécurité
            }));
            setPersonalLink({
                linkedin: "",
                portfolio: "",
                github: "",
            });
        }
    }, []);

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="px-16 mb-16"
        >
            <div className="relative bg-indigo-400 text-white h-40 rounded-t-lg">
                <p className="font-bold text-2xl text-white flex justify-end items-center text-end pt-10 ml-auto mr-12 w-[28rem]">
                    Consultez ici votre profil et modifiez vos informations personnelles
                </p>
                <img
                    src={imgIntern}
                    className="w-40 h-40 rounded-full absolute -bottom-16 left-1/8 border-6 border-white"
                />
                <p className="absolute -bottom-8 left-80 text-gray-600 text-sm">
                    Dernière connexion: il y a 16 heures
                </p>
            </div>

            <div className="mt-20 px-36 flex justify-between">
                <div>
                    <h2 className="font-semibold text-2xl">
                        {personalInfo.firstname} {personalInfo.lastname}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        <span className="mr-3">#</span>
                        {storedUser?.identifier || "STA12345678"}
                    </p>
                    <p className="text-gray-600">
                        <i className="pi pi-graduation-cap mt-2 mr-3" />
                        {personalInfo.etablishment ? `${personalInfo.etablishment} - Mahamasina` : "Université ESMIA - Mahamasina"}
                    </p>
                </div>

                <div className="flex flex-col justify-between ml-auto">
                    <i
                        className="pi pi-ellipsis-v cursor-pointer text-end hover:text-indigo-400"
                        title="Options"
                    />
                    <div className="text-end">
                        <span className="font-medium text-sm">CV : </span>
                        <Chip
                            label="CV_Tantely_Ny_Aina"
                            icon="pi pi-file"
                            className="!ml-4 !text-xs !font-poppins"
                        />
                        <i
                            className="pi pi-pen-to-square ml-4 text-indigo-500 text-xs"
                            title="Éditer"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-b border-gray-200 mt-6 mb-12" />

            <form className="grid grid-cols-2 gap-8">
                <section>
                    <h3 className="text-indigo-500 font-semibold text-xl">
                        Informations personnelles
                    </h3>

                    <div className="mt-4 flex flex-col space-y-5 bg-gray-50 shadow-lg rounded-lg p-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-user mr-2 text-indigo-400" /> Nom
                            </label>
                            <InputText
                                value={personalInfo.lastname}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, lastname: e.target.value }))
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Prénoms</label>
                            <InputText
                                value={personalInfo.firstname}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, firstname: e.target.value }))
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Adresse e-mail</label>
                            <InputText
                                type="email"
                                value={personalInfo.email}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, email: e.target.value }))
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Contact</label>
                            <InputText
                                value={personalInfo.contact}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, contact: e.target.value }))
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Établissement d'origine</label>
                            <InputText
                                value={personalInfo.etablishment}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, etablishment: e.target.value }))
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Domaine</label>
                            <InputText
                                value={personalInfo.domain}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, domain: e.target.value }))
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Niveau</label>
                            <InputText
                                value={personalInfo.level}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalInfo((prev) => ({ ...prev, level: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-indigo-500 font-semibold text-xl">
                        Mot de passe et sécurité
                    </h3>

                    <div className="mt-4 flex flex-col space-y-5 bg-gray-50 shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <p className="text-sm">
                                Votre mot de passe est fourni par l'administrateur. Vous pouvez personnaliser votre mot de passe à partir de cet alternative
                            </p>
                            <i className="pi pi-info-circle text-xs cursor-pointer hover:text-indigo-400" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-lock text-indigo-400 mr-2" /> Votre mot de passe actuel
                            </label>
                            <Password
                                value={passwordUser.current}
                                pt={{
                                    input: "!font-poppins !h-11",
                                }}
                                onChange={(e) =>
                                    setPasswordUser((prev) => ({ ...prev, current: e.target.value }))
                                }
                            />
                            <p className="mt-6 font-medium text-indigo-500 text-sm">
                                <i className="pi pi-shield mr-3" />
                                Changer mot de passe ?
                            </p>
                        </div>

                        <div className="mt-2">
                            <PanelMenu
                                model={sessionItems}
                                pt={{
                                    header: "!font-poppins !font-semibold",
                                    headerContent: "!border-none",
                                    panel: "!font-poppins",
                                }}
                            />
                        </div>
                    </div>

                    <h3 className="mt-12 text-indigo-500 font-semibold text-xl">
                        Liens externes
                    </h3>

                    <div className="mt-4 flex flex-col space-y-5 bg-gray-50 shadow-lg rounded-lg p-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-linkedin text-indigo-500 mr-3" /> Profil Linkedin
                            </label>
                            <InputText
                                value={personalLink.linkedin}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalLink((prev) => ({ ...prev, linkedin: e.target.value }))
                                }
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-globe text-indigo-500 mr-3" /> Portfolio
                            </label>
                            <InputText
                                value={personalLink.portfolio}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalLink((prev) => ({ ...prev, portfolio: e.target.value }))
                                }
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-github text-indigo-500 mr-3" /> Profil Github
                            </label>
                            <InputText
                                value={personalLink.github}
                                size="small"
                                className="!font-poppins"
                                onChange={(e) =>
                                    setPersonalLink((prev) => ({ ...prev, github: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                </section>
            </form>
        </motion.div>
    );
};

export default ProfileIntern;