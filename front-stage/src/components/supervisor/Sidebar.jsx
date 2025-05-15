import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "primereact/button"
import { Tooltip } from "primereact/tooltip"
import { InputSwitch } from 'primereact/inputswitch'

import Logo from '../Logo'

const SidebarSupervisor = ({ collapsed, setCollapsed }) => {
    const [checked, setChecked] = useState(false)

    const menuItems = [
        { label: "Tableau de bord", icon: "pi pi-home", path: "/supervisor/dashboard" },
        { label: "Suivi", icon: "pi pi-chart-line", path: "/suivi" },
        { label: "Calendrier", icon: "pi pi-calendar", path: "/calendrier" },
        { label: "Ressources", icon: "pi pi-folder", path: "/ressources" },
        { label: "Évaluations", icon: "pi pi-star", path: "/evaluations" }
    ]

    const toggleSidebar = () => setCollapsed(!collapsed)

    return (
        <div className={`h-screen z-50 fixed bg-gray-50 border border-gray-100 shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
            <section className="flex items-center justify-between p-4">
                {!collapsed && 
                    <div className="flex justify-center items-center mx-auto">
                        <Logo />
                    </div>
                }
                <Button 
                    icon={collapsed ? "pi pi-chevron-right" : "pi pi-chevron-left"} 
                    className="p-button-rounded p-button-sm p-button-text text-black"
                    onClick={toggleSidebar}
                />
            </section>

            <nav className="flex-1 px-2 space-y-1">
                {menuItems.map((item, index) => (
                    <div key={index} className="relative">
                        {collapsed && (
                            <Tooltip target={`#sidebar-item-${index}`} content={item.label} position="right" />
                        )}
                        <NavLink
                            to={item.path}
                            id={`sidebar-item-${index}`}
                            className={({ isActive }) => 
                                `flex items-center px-4 rounded-md transition-all cursor-pointer hover:bg-indigo-200
                                ${collapsed ? 'py-5': 'py-3'} 
                                ${isActive ? 'bg-indigo-300 text-white font-medium' : 'text-black/70'}`
                            }
                        >
                            <i className={`${item.icon} text-lg`} />
                            {!collapsed && <span className="ml-4">{item.label}</span>}
                        </NavLink>
                    </div>
                ))}
            </nav>

            <section className="mt-auto mb-8">
                <div className={`flex justify-center items-center ${collapsed ? '' : 'space-x-6'}`}>
                    {collapsed ? (
                        <i 
                            className={`pi ${checked ? 'pi-moon text-black/50' : 'pi-sun text-black/60'} cursor-pointer text-lg`} 
                            title={checked ? 'Mode nuit' : 'Mode jour'}
                            onClick={() => setChecked(!checked)}
                        />
                    ) : (
                        <>
                            <i 
                                className="pi pi-sun text-black/60"
                                title="Mode jour"
                            />
                            <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
                            <i 
                                className="pi pi-moon text-black/50"
                                title="Mode nuit"
                            />
                        </>
                    )}
                </div>

                <Button 
                    label={collapsed ? '' : 'Déconnexion'}
                    icon="pi pi-sign-out"
                    unstyled
                    className={`h-10 bg-indigo-400 rounded-md text-white flex justify-center items-center mx-auto text-sm mt-8 transition-all duration-300 ${collapsed ? 'w-12 px-0' : 'w-48 px-6 gap-x-3 '}`}
                />
            </section>
        </div>
    )
}

export default SidebarSupervisor
