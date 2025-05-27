// src/middleware/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../composables/useAuth'

export default function RequireAuth({ allowedRoles = [] }) {
    const { fetchUserDetails, logout } = useAuth()
    const [user, setUser] = useState(null)
    const [isAuthorized, setIsAuthorized] = useState(null)
    const location = useLocation()
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const userData = await fetchUserDetails()
          setUser(userData)
  
          if (allowedRoles.includes(userData.role)) {
            setIsAuthorized(true)
          } else {
            setIsAuthorized(false)
          }
        } catch (error) {
          logout()
          setIsAuthorized(false)
        }
      }
  
      checkAuth()
    }, [])
  
    if (isAuthorized === null) return <div>Chargement...</div>
  
    if (isAuthorized) {
      return <Outlet />
    }
  
    // 🔁 Redirection intelligente selon le rôle
    if (user) {
      const role = user.role
      if (role === 'intern') {
        return <Navigate to="/intern/dashboard" replace />
      } else if (role === 'supervisor' || role === 'instructor') {
        return <Navigate to="/supervisor/dashboard" replace />
      } else if (role === 'admin' || role === 'administrator') {
        return <Navigate to="/admin/dashboard" replace />
      } else {
        return <Navigate to="/" replace />
      }
    }
  
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  