import './index.css'
import { useEffect, useState } from 'react'
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { AnimatePresence} from 'framer-motion'
import { Routes, Route, useLocation  } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import LayoutIntern from './pages/intern/Layout'
import Dashboard from './pages/intern/Dashboard'

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
              {/** USER */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              <Route path="/intern" element={<LayoutIntern />}>
                <Route index path="dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
        </div>
      </AnimatePresence>
    </>
  )
}

export default App