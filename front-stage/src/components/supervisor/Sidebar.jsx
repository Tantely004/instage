import { NavLink } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputSwitch } from 'primereact/inputswitch';

import Logo from '../Logo';

const SidebarSupervisor = ({ collapsed, setCollapsed, isDarkMode, setIsDarkMode }) => {
  const menuItems = [
    { label: 'Tableau de bord', icon: 'pi pi-home', path: '/supervisor/dashboard' },
    { label: 'Suivi', icon: 'pi pi-chart-line', path: '/supervisor/follow-up' },
    { label: 'Calendrier', icon: 'pi pi-calendar', path: '/supervisor/planning' },
    { label: 'Ressources', icon: 'pi pi-folder', path: '/supervisor/resources' },
    { label: 'Évaluations', icon: 'pi pi-star', path: '/evaluations' },
  ];

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
        className={`h-screen z-50 fixed bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col`}
    >
        <section className="flex items-center justify-between p-4">
            {!collapsed && (
              <div className="flex justify-center items-center mx-auto">
                <Logo />
              </div>
            )}
            <Button
              icon={collapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'}
              className="p-button-rounded p-button-sm p-button-text text-black dark:text-white"
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
                          `flex items-center px-4 rounded-md transition-all cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-600 ${
                            collapsed ? 'py-5' : 'py-3'
                          } ${
                            isActive
                              ? 'bg-indigo-300 dark:bg-indigo-500 text-white font-medium'
                              : 'text-black/70 dark:text-white/80'
                          }`
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
                    className={`pi ${isDarkMode ? 'pi-moon text-white/50' : 'pi-sun text-black/60'} cursor-pointer text-lg`}
                    title={isDarkMode ? 'Mode nuit' : 'Mode jour'}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                />
              ) : (
                <>
                    <i className="pi pi-sun text-black/60 dark:text-white/60" title="Mode jour" />
                    <InputSwitch checked={isDarkMode} onChange={(e) => setIsDarkMode(e.value)} />
                    <i className="pi pi-moon text-black/50 dark:text-white/50" title="Mode nuit" />
                </>
              )}
            </div>

            <Button
                label={collapsed ? '' : 'Déconnexion'}
                icon="pi pi-sign-out"
                unstyled
                className={`h-10 bg-indigo-400 dark:bg-indigo-600 rounded-md text-white flex justify-center items-center mx-auto text-sm mt-8 transition-all duration-300 ${
                  collapsed ? 'w-12 px-0' : 'w-48 px-6 gap-x-3'
                }`}
            />
        </section>
    </div>
  );
};

export default SidebarSupervisor;