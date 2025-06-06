import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip';
import { TieredMenu } from 'primereact/tieredmenu';
import useToolbar from "../../composables/useToolbar"; // Importer useToolbar

import SidebarAdmin from "../../components/admin/Sidebar";
import imgSupervisor from "../../assets/images/img_profile_supervisor.png";

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { fetchUserData, userData, loading, error } = useToolbar(); // Utiliser le hook

    const profileMenu = useRef(null);
    const profileItems = [
        {
            label: 'Mon profil',
            icon: 'pi pi-user',
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
        <div className="flex">
            <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex flex-col space-y-8">
                <header className={`bg-gray-50 z-30 pl-8 ${collapsed ? 'pl-24' : 'pl-72'} h-20 pr-8 fixed flex justify-between items-center w-full`}>
                    <div>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText
                                placeholder="Rechercher" 
                                size="small"
                                className='h-10 w-96 !text-sm !border-none rounded-md'
                            />
                        </IconField>
                    </div>

                    <div className="flex space-x-8 items-center">
                        <i className="pi pi-bell text-black/60"/>
                        <i className="pi pi-cog text-black/60"/>
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
                    <Outlet collapsed={collapsed} setCollapsed={setCollapsed}/>
                </main>
            </div>
        </div>
    );
};

export default LayoutAdmin;