import { useState } from "react";
import axios from "axios";

// Configurer l'intercepteur Axios (déjà défini dans useAuth.jsx, donc pas besoin de le redéfinir ici)

export default function useReport() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    // Récupérer les données du tableau de bord
    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error("Aucun token trouvé");

            const response = await axios.get("http://127.0.0.1:8000/api/dashboard/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setDashboardData(response.data);
                return response.data;
            } else {
                setError("Erreur lors de la récupération des données du tableau de bord");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération des données");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchDashboardData, dashboardData, loading, error };
}