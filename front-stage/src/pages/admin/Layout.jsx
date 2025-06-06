import { useState } from "react"
import { Outlet } from "react-router-dom"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"

import SidebarAdmin from "../../components/admin/Sidebar"

import imgSupervisor from "../../assets/images/img_profile_supervisor.png"

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false)

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
                            src={imgSupervisor} 
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                </header>

                <main className={`mt-28 !overflow-x-hidden ${collapsed ? 'ml-24 min-w-full' : 'ml-72'} mr-8`}>
                    <Outlet collapsed={collapsed} setCollapsed={setCollapsed}/>
                </main>
            </div>
        </div>
    )
}

export default LayoutAdmin
