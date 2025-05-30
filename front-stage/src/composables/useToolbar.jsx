import { useState } from "react";
import axios from "axios";

export default function useToolbar() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error("Aucun token trouvé");

            const url = "http://127.0.0.1:8000/api/toolbar/";

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUserData(response.data);
                return response.data;
            } else {
                setError("Erreur lors de la récupération des données de l'utilisateur");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération des données");
            if (err.response?.status === 401) {
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (!refreshToken) throw new Error("Aucun refresh token trouvé");

                    const refreshResponse = await axios.post(
                        "http://127.0.0.1:8000/api/token/refresh/",
                        { refresh: refreshToken }
                    );

                    const newAccessToken = refreshResponse.data.access;
                    localStorage.setItem('access_token', newAccessToken);
                    const retryResponse = await axios.get(url, {
                        headers: { Authorization: `Bearer ${newAccessToken}` },
                    });
                    setUserData(retryResponse.data);
                    return retryResponse.data;
                } catch (refreshErr) {
                    setError("Échec du rafraîchissement du token: " + refreshErr.message);
                    throw refreshErr;
                }
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchUserData, userData, loading, error };
}