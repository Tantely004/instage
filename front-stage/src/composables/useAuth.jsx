import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function useAuth() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const login = async (identifier, password) => {
        setLoading(true)
        setError(null)

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                { identifier, password },
                { withCredentials: true }
            )

            if (response.status === 200) {
                navigate('/intern/dashboard')
            } else {
                setError("Identifiant ou mot de passe incorrect")
            }
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error)
            } else {
                setError("Erreur réseau. Vérifiez votre connexion.")
            }
        } finally {
            setLoading(false)
        }
    }

    return { login, loading, error }
}
