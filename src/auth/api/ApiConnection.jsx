import { useState, useEffect } from "react";
import axios from "axios";

export const ApiConnection = () => {

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const [IAresponse, setIAresponse] = useState(null);

    // Configurar instancia de Axios
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    });
    const api2 = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://0.0.0.0:8000",
    });

    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    const uploadRecycle = async (id, image, productos) => {
        setLoading(true);
        try {
            const res = await api.post("/api/reciclaje/registroReciclaje", { id, image, productos });
            setResume(res.data);
        } catch (err) {
            console.error("Error al subir reciclaje:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const uploadIA = async (imageBlobOrFile) => {
        setLoading(true);
        try {
            const form = new FormData();
            form.append("file", imageBlobOrFile, `photo_${Date.now()}.jpg`); // <-- key EXACTA: file
            const res = await api2.post("/classify", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIAresponse(res.data);
        } catch (err) {
            console.error("Error IA:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return { uploadRecycle, uploadIA, loading, resume, IAresponse };

}


