import { Outlet } from "react-router-dom"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"

import SidebarSupervisor from "../../components/supervisor/Sidebar"

import imgSupervisor from "../../assets/images/img_profile_supervisor.png"

const LayoutSupervisor = () => {
    return (
        <div className="flex">
            <div>
                <SidebarSupervisor />
            </div>

            <div className="flex flex-col space-y-8">
                <header className="bg-gray-50 pl-8 pr-72 h-20 fixed flex justify-between items-center w-full">
                    <div className="">
                        <h1 className="font-semibold text-xl">
                            Bienvenue à vous !
                        </h1>
                    </div>

                    <div>
                        <IconField 
                            iconPosition="left"
                        >
                            <InputIcon className="pi pi-search"/>
                            <InputText
                                placeholder="Rechercher" 
                                size="small"
                                className='h-10 w-72 !text-sm !border-none rounded-md'
                            />
                        </IconField>
                    </div>

                    <div className="flex space-x-8 items-center">
                        <i className="pi pi-bell text-black/60"/>
                        <i className="pi pi-cog text-black/60"/>
                        <img 
                            src={imgSupervisor} 
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                </header>

                <main className="mt-20 ml-4 mr-72">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default LayoutSupervisor