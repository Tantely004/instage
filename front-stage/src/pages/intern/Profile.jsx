import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { PanelMenu } from "primereact/panelmenu";
import { Chip } from "primereact/chip";
import useProfile from "../../composables/useProfile"; // Importer le hook useProfile
import imgIntern from "../../assets/images/fake/intern2.png";

const ProfileIntern = () => {
    const { fetchProfileData, profileData, loading, error } = useProfile();

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

    // États initiaux vides, remplis par l'API
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
        current: "******", // Masqué par défaut
        new: "",
        confirm: "",
    });

    const [personalLink, setPersonalLink] = useState({
        linkedin: "",
        portfolio: "",
        github: "",
    });

    // Récupérer les données du profil au chargement
    useEffect(() => {
        fetchProfileData();
    }, []);

    // Mettre à jour les états avec les données de l'API
    useEffect(() => {
        console.log("Profile Data:", profileData); // Débogage
        if (profileData) {
            const user = profileData.user;
            const intern = profileData.intern;
            setPersonalInfo({
                lastname: user.name || "",
                firstname: user.firstname || "",
                email: user.mail || "",
                contact: user.contact || "",
                etablishment: intern.etablishment || "",
                domain: intern.sector || "",
                level: intern.level || "",
            });
            // Les liens externes ne sont pas dans l'API pour l'instant
        }
    }, [profileData]);

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center py-10">{error}</div>;
    }

    if (!profileData) {
        return <div className="text-center py-10">Aucune donnée disponible</div>;
    }

    const user = profileData.user;

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
                    src={user.image || imgIntern}
                    alt="Profile"
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
                        {user.identifier}
                    </p>
                    <p className="text-gray-600">
                        <i className="pi pi-graduation-cap mt-2 mr-3" />
                        Université {personalInfo.etablishment} - Mahamasina
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
                            label={user.cv ? user.cv.split("/").pop() : "Aucun CV"}
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
                                onChange={(e) =>
                                    setPersonalInfo({ ...personalInfo, lastname: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Prénoms</label>
                            <InputText
                                value={personalInfo.firstname}
                                onChange={(e) =>
                                    setPersonalInfo({ ...personalInfo, firstname: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Adresse e-mail</label>
                            <InputText
                                type="email"
                                value={personalInfo.email}
                                onChange={(e) =>
                                    setPersonalInfo({ ...personalInfo, email: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Contact</label>
                            <InputText
                                value={personalInfo.contact}
                                onChange={(e) =>
                                    setPersonalInfo({ ...personalInfo, contact: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Établissement d'origine</label>
                            <InputText
                                value={personalInfo.etablishment}
                                onChange={(e) =>
                                    setPersonalInfo({ ...personalInfo, etablishment: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Domaine</label>
                            <InputText
                                value={personalInfo.domain}
                                onChange={(e) =>
                                    setPersonalInfo({ ...personalInfo, domain: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">Niveau</label>
                            <InputText
                                value={personalInfo.level}
                                onChange={(e) =>
                                    setPersonalInfo({ ...personalInfo, level: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
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
                                Votre mot de passe est fourni par l'administrateur. Vous pouvez
                                personnaliser votre mot de passe à partir de cet alternative
                            </p>
                            <i className="pi pi-info-circle text-xs cursor-pointer hover:text-indigo-400" />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-lock text-indigo-400 mr-2" /> Votre mot de
                                passe actuel
                            </label>
                            <Password
                                value={passwordUser.current}
                                onChange={(e) =>
                                    setPasswordUser({ ...passwordUser, current: e.target.value })
                                }
                                pt={{ input: "!font-poppins !h-11" }}
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
                                <i className="pi pi-linkedin text-indigo-500 mr-3" /> Profil
                                Linkedin
                            </label>
                            <InputText
                                value={personalLink.linkedin}
                                onChange={(e) =>
                                    setPersonalLink({ ...personalLink, linkedin: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-globe text-indigo-500 mr-3" /> Portfolio
                            </label>
                            <InputText
                                value={personalLink.portfolio}
                                onChange={(e) =>
                                    setPersonalLink({ ...personalLink, portfolio: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-500">
                                <i className="pi pi-github text-indigo-500 mr-3" /> Profil Github
                            </label>
                            <InputText
                                value={personalLink.github}
                                onChange={(e) =>
                                    setPersonalLink({ ...personalLink, github: e.target.value })
                                }
                                size="small"
                                className="!font-poppins"
                            />
                        </div>
                    </div>
                </section>
            </form>
        </motion.div>
    );
};

export default ProfileIntern;