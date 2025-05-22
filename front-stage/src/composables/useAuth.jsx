import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

// Configurer l'intercepteur Axios pour le rafraîchissement automatique des tokens
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                // eslint-disable-next-line no-undef
                const newAccessToken = await refreshToken()
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                return axios(originalRequest)
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return Promise.reject(error)
    }
)

export default function useAuth() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    //Connexion avec gestion des tokens JWT
    const login = async (identifier, password) => {
        setLoading(true)
        setError(null)

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login/",
                { identifier, password },
                { withCredentials: false }
            )

            if (response.status === 200) {
                localStorage.setItem('access_token', response.data.access)
                localStorage.setItem('refresh_token', response.data.refresh)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
                navigate('/intern/dashboard')
            } else {
                setError("Identifiant ou mot de passe incorrect")
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur de connexion")
        } finally {
            setLoading(false)
        }
    }

    //Récupération des détails de l'utilisateur
    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                throw new Error("Aucun token trouvé")
            }
            const response = await axios.get(
                "http://127.0.0.1:8000/api/user/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            return response.data
        } catch (err) {
            console.error("Erreur lors de la récupération des détails de l'utilisateur", err)
            setError(err.response?.data?.message || "Erreur lors de la récupération des données")
            throw err
        }
    }

    //Déconnexion
    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        navigate('/login')
    }

    //Rafraîchissement des tokens
    const refreshToken = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token')
            if (!refresh) {
                throw new Error("Aucun refresh token trouvé")
            }
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/refresh/",
                { refresh }
            )
            localStorage.setItem('access_token', response.data.access)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
            return response.data.access
        } catch (err) {
            console.error("Erreur lors du rafraîchissement du token", err)
            logout()
            throw err
        }
    }

    return { login, fetchUserDetails, logout, refreshToken, loading, error }
}