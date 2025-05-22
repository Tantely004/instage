import { Navigate, Outlet } from 'react-router-dom'

// Middleware de protection des routes selon les rôles
export default function Auth({ allowedRoles }) {
    const token = localStorage.getItem('access_token')
    const user = JSON.parse(localStorage.getItem('user'))

    // Si pas connecté
    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    const userRole = user?.role

    // Si le rôle de l'utilisateur ne fait pas partie des rôles autorisés
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />
    }

    // Sinon, autoriser l'accès à la route protégée
    return <Outlet />
}
