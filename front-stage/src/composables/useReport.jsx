import { useState } from "react";
import axios from "axios";

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
            const user = JSON.parse(localStorage.getItem('user'));
            if (!token) throw new Error("Aucun token trouvé");
            if (!user) throw new Error("Utilisateur non connecté");

            // Déterminer l'URL en fonction du rôle
            let url;
            if (user.role === 'intern') {
                url = "http://127.0.0.1:8000/api/dashboard/intern/";
            } else if (user.role === 'instructor') {
                url = "http://127.0.0.1:8000/api/dashboard/supervisor/";
            } else if (user.role === 'administrator') {
                url = "http://127.0.0.1:8000/api/dashboard/admin/";
            } else {
                throw new Error("Rôle non pris en charge");
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`, // Correction de la syntaxe
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