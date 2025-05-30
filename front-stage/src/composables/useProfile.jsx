import { useState } from "react";
import axios from "axios";

export default function useProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);

    const fetchProfileData = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            const user = JSON.parse(localStorage.getItem('user'));
            if (!token) throw new Error("Aucun token trouvé");
            if (!user) throw new Error("Utilisateur non connecté");

            let url;
            if (user.role === 'intern') {
                url = "http://127.0.0.1:8000/api/profile/intern/";
            } else {
                throw new Error("Rôle non pris en charge");
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setProfileData(response.data);
                return response.data;
            } else {
                setError("Erreur lors de la récupération des données du profil");
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
                    setProfileData(retryResponse.data);
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

    return { fetchProfileData, profileData, loading, error };
}