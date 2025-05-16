import { useState } from "react"
import { Outlet } from "react-router-dom"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"

import SidebarSupervisor from "../../components/supervisor/Sidebar"

import imgSupervisor from "../../assets/images/img_profile_supervisor.png"

const LayoutSupervisor = ({ isDarkMode, setIsDarkMode }) => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex dark:bg-gray-800">
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
                            src={imgSupervisor} 
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                </header>

                <main className={`mt-28 ${collapsed ? 'ml-24 w-[90.5%]' : 'ml-72'} mr-8`}>
                    <Outlet 
                        collapsed={collapsed} 
                        setCollapsed={setCollapsed}
                        isDarkMode={isDarkMode}
                        setIsDarkMode={setIsDarkMode}
                    />
                </main>
            </div>
        </div>
    )
}

export default LayoutSupervisor
