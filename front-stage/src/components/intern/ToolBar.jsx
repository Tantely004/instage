import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar'
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import Logo from '../Logo'
import imgProfile from '../../assets/images/img_profile_intern.jpg'

const Toolbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const menuItems = useMemo(() => [
        {
            label: 'Tableau de bord',
            icon: 'pi pi-home',
            command: () => navigate('/intern/dashboard'),
            className: location.pathname === '/intern/dashboard' ? 'bg-indigo-200 hover:bg-indigo-200 text-white !important rounded-md' : 'hover:bg-gray-200',
        },
        {
            label: 'Calendrier',
            icon: 'pi pi-calendar',
            command: () => navigate('/intern/planning'),
            className: location.pathname === '/intern/planning' ? 'bg-indigo-200 text-white !important rounded-md' : 'hover:bg-gray-200',
        },
        {
            label: 'Mon stage',
            icon: 'pi pi-briefcase',
            command: () => navigate('/intern/me'),
            className: location.pathname === '/intern/me' ? 'bg-indigo-200 text-white !important rounded-md' : 'hover:bg-gray-200',
        },
        {
            label: 'Ressources',
            icon: 'pi pi-folder',
            command: () => navigate('/intern/ressources'),
            className: location.pathname === '/intern/ressources' ? 'bg-indigo-200 text-white !important rounded-md' : 'hover:bg-gray-200',
        },
    ], [location.pathname, navigate]) 

    return (
        <header className="mt-4 h-20 flex justify-between px-16 items-center w-full">
            <div className="flex items-center space-x-4">
                <Logo />

                <div>
                    <Menubar 
                        model={menuItems}
                        style={{ border: 'none', boxShadow: 'none' }}
                        className="bg-transparent font-poppins"
                    />
                </div>
            </div>
            
            <div className="flex space-x-8 items-center">
                <div>
                    <IconField 
                        iconPosition="left"
                        className='text-xs'
                    >
                        <InputIcon className="pi pi-search"/>
                        <InputText 
                            placeholder="Rechercher" 
                            size="small"
                            className='h-10 w-40 text-xs'
                        />
                    </IconField>
                </div>

                <div className="flex space-x-8 items-center">
                    <i 
                        className="pi pi-bell cursor-pointer hover:text-indigo-600"
                        title="Notification"
                    />
                </div>

                <img 
                    src={imgProfile} 
                    alt="Profile user" 
                    className='w-12 h-12 object-center rounded-full border-1 border-gray-200 cursor-pointer'
                    title='Votre profil'
                />
            </div>
        </header>
    )
}

export default Toolbar