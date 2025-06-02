import { useEffect, useState } from 'react'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'  // Import axios ici

// Pages publiques
import Home from './pages/Home'
import Login from './pages/Login'

// Layouts et Dashboards
import LayoutIntern from './pages/intern/Layout'
import Dashboard from './pages/intern/Dashboard'

import LayoutSupervisor from './pages/supervisor/Layout'
import DashboardSupervisor from './pages/supervisor/Dashboard'

import LayoutAdmin from './pages/admin/Layout'
import DashboardAdmin from './pages/admin/Dashboard'
import PlanningIndex from './pages/intern/Planning/index'
import MyInternship from './pages/intern/Me'
import CreatePlanning from './pages/intern/Planning/Create'
import ProfileSupervisor from './pages/supervisor/Profile'
import ProfileIntern from './pages/intern/Profile'
import Users from './pages/admin/users'
import CreateUser from './pages/admin/users/Create'
import FollowUpSupervisor from './pages/supervisor/FollowUp'
import FollowUpAdmin from './pages/admin/FollowUp'

// Middleware
import RequireAuth from './middleware/RequireAuth'

function App() {
      // eslint-disable-next-line no-unused-vars
      const [loading, setLoading] = useState(false)
      const [isDarkMode, setIsDarkMode] = useState(() => {
      return localStorage.getItem('theme') === 'dark'
  })
  const location = useLocation()

  // --- Nettoyage du header Authorization selon le token dans localStorage ---
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      delete axios.defaults.headers.common['Authorization']
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])  // Au montage du composant App

  // Thème dynamique
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

  // Gestion du chargement
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
                  <Route index path="planning/create" element={<CreatePlanning />} />
                  <Route index path="me" element={<MyInternship />} />
                  <Route index path="profile" element={<ProfileIntern />} />
                </Route>

                <Route 
                    path="/supervisor" 
                    element={<LayoutSupervisor setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />}
                >
                    <Route index path="dashboard" element={<DashboardSupervisor />} />
                    <Route index path="follow-up" element={<FollowUpSupervisor />} />
                    <Route index path="profile" element={<ProfileSupervisor />} />
                </Route>

              {/** ADMIN */}
              <Route path="/admin" element={<LayoutAdmin />}>
                <Route index path="dashboard" element={<DashboardAdmin />} />
                <Route index path="users" element={<Users />} />
                <Route index path="users/create" element={<CreateUser />} />
                <Route index path="follow-up" element={<FollowUpAdmin />} />
              </Route>
            </Routes>
        </div>
      </AnimatePresence>
    </>
  )
}

export default App