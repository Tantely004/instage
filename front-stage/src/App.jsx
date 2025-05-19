import { useEffect, useState } from 'react'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import LayoutIntern from './pages/intern/Layout'
import LayoutSupervisor from './pages/supervisor/Layout'
import Dashboard from './pages/intern/Dashboard'
import DashboardSupervisor from './pages/supervisor/Dashboard'
import LayoutAdmin from './pages/admin/Layout'
import DashboardAdmin from './pages/admin/Dashboard'
import PlanningIndex from './pages/intern/Planning/index'

function App() {
      // eslint-disable-next-line no-unused-vars
      const [loading, setLoading] = useState(false)
      const [isDarkMode, setIsDarkMode] = useState(() => {
      return localStorage.getItem('theme') === 'dark'
  })
  const location = useLocation()

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark')
        import('primereact/resources/themes/lara-dark-indigo/theme.css').then(() => {
            const lightTheme = document.querySelector('link[href*="lara-light-indigo"]')
            if (lightTheme) lightTheme.remove()
        })
      localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark')
        import('primereact/resources/themes/lara-light-indigo/theme.css').then(() => {
            const darkTheme = document.querySelector('link[href*="lara-dark-indigo"]')
            if (darkTheme) darkTheme.remove()
        })
        localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    window.addEventListener('beforeunload', handleStart)
    window.addEventListener('load', handleComplete)

    return () => {
        window.removeEventListener('beforeunload', handleStart)
        window.removeEventListener('load', handleComplete)
    }
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        <div>
            <Routes key={location.pathname} location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />  

                <Route path='/intern' element={<LayoutIntern />}>
                  <Route index path="dashboard" element={<Dashboard />} />
                  <Route index path="planning" element={<PlanningIndex />} />
                </Route>

                <Route 
                    path="/supervisor" 
                    element={<LayoutSupervisor setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />}
                >
                    <Route index path="dashboard" element={<DashboardSupervisor />} />
                </Route>

                <Route path="/admin" element={<LayoutAdmin />}>
                    <Route index path="dashboard" element={<DashboardAdmin />} />
                </Route>
            </Routes>
        </div>
      </AnimatePresence>
    </>
  )
}

export default App