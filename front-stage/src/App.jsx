import './index.css'
import { useEffect, useState } from 'react'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { AnimatePresence} from 'framer-motion'
import { Routes, Route, useLocation  } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import LayoutIntern from './pages/intern/Layout'
import LayoutSupervisor from './pages/supervisor/Layout'
import Dashboard from './pages/intern/Dashboard'
import DashboardSupervisor from './pages/supervisor/Dashboard'
import LayoutAdmin from './pages/admin/Layout'
import DashboardAdmin from './pages/admin/Dashboard'
import Users from './pages/admin/users'
import CreateUser from './pages/admin/users/Create'
import FollowUpAdmin from './pages/admin/FollowUp'

function App() {
  const [loading, setLoading] = useState(false)
  const location = useLocation()

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
      <AnimatePresence mode='wait'>
        <div>
            <Routes key={location.pathname} location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/** INTERN */}
              <Route path="/intern" element={<LayoutIntern />}>
                <Route index path="dashboard" element={<Dashboard />} />
              </Route>

              {/** SUPERVISOR */}
              <Route path="/supervisor" element={<LayoutSupervisor />}>
                <Route index path="dashboard" element={<DashboardSupervisor />} />
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