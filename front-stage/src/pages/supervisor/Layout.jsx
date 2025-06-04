import { useState, useRef, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Tooltip } from 'primereact/tooltip'
import { TieredMenu } from 'primereact/tieredmenu'
import useToolbar from "../../composables/useToolbar";

import SidebarSupervisor from "../../components/supervisor/Sidebar";
import imgSupervisor from "../../assets/images/img_profile_supervisor.png";

const LayoutSupervisor = ({ isDarkMode, setIsDarkMode }) => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const { fetchUserData, userData, loading, error } = useToolbar()

    const profileMenu = useRef(null);
    const profileItems = [
        {
            label: 'Mon profil',
            icon: 'pi pi-user',
            command : () => {
                navigate('/supervisor/profile')
            }
        },
        {
            label: 'Paramètres',
            icon: 'pi pi-cog',
        },
        {
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
        },
    ];

    // Récupérer les données de l'utilisateur au chargement du composant
    useEffect(() => {
        fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div className="text-red-600 text-center">{error}</div>;
    }

    // Utiliser une image par défaut si userData.image est null
    const profileImage = userData?.image || imgSupervisor;
    const fullName = userData ? `${userData.firstname} ${userData.name}` : "Utilisateur";

    return (
        <div className="flex dark:bg-gray-800 overflow-x-hidden">
            <SidebarSupervisor 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />

            <div className="flex flex-col space-y-8">
                <header className={`bg-gray-50 dark:bg-gray-800 dark:border-b dark:border-gray-50/20 z-30 pl-8 ${collapsed ? 'pl-24' : 'pl-72'} h-20 pr-8 fixed flex justify-between items-center w-full`}>
                    <div>
                        <h1 className="font-semibold text-xl dark:text-white">
                            Bienvenue à vous !
                        </h1>
                    </div>

                    <div>
                        <IconField 
                            iconPosition="left"
                            className="dark:!text-white"
                        >
                            <InputIcon className="pi pi-search dark:!text-white" />
                            <InputText
                                placeholder="Rechercher" 
                                size="small"
                                className='h-10 w-72 !text-sm !border-none rounded-md dark:!bg-gray-700 dark:placeholder:!text-white/60 dark:!text-white'
                            />
                        </IconField>
                    </div>

                    <div className="flex space-x-8 items-center">
                        <i className="pi pi-bell text-black/60 dark:text-white"/>
                        <i className="pi pi-cog text-black/60 dark:text-white"/>
                        <img 
                            src={profileImage} 
                            className="custom-tooltip-img w-12 h-12 rounded-full cursor-pointer"
                            onClick={(e) => profileMenu.current.toggle(e)}
                        />

                        <TieredMenu 
                            model={profileItems} 
                            popup 
                            ref={profileMenu}
                            className='!font-poppins'
                            pt={{
                                icon: '!text-indigo-300',
                            }}
                        />

                        <Tooltip 
                            target=".custom-tooltip-img"
                            position='bottom'
                        >
                            <h6 className='text-sm'>
                                Votre profil
                            </h6>
                            <p className='font-bold'>
                                {fullName}
                            </p>
                        </Tooltip>
                    </div>
                </header>

                <main className={`mt-28 !overflow-x-hidden ${collapsed ? 'ml-24 min-w-full' : 'ml-72'} mr-8`}>
                    <Outlet 
                        collapsed={collapsed} 
                        setCollapsed={setCollapsed}
                        isDarkMode={isDarkMode}
                        setIsDarkMode={setIsDarkMode}
                    />
                </main>
            </div>
        </div>
    );
};

export default LayoutSupervisor;