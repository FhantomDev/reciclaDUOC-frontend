import { use, useState } from "react";
import CameraCapture from "./cameraCapture";
import axios from "axios";
import { useRecycleStore } from "@/app/context/RecycleStore";
import { useTheme } from "@/app/context/ThemeContext";

export default function RecycleScreen() {
    const [loading, setLoading] = useState(false);
    const [IAresponse, setIAresponse] = useState(null);
    const { addItem } = useRecycleStore();
    const { colors } = useTheme();

    const api2 = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:https://8vq95vp3-8000.brs.devtunnels.ms",
    });

    const uploadIA = async (imageBlobOrFile) => {
        setLoading(true);
        try {
            const form = new FormData();
            form.append("file", imageBlobOrFile, `photo_${Date.now()}.jpg`);
            const res = await api2.post("/classify", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIAresponse(res.data); // {topClass, confidence, score, ...}
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-6 px-4">

            <h1 className="mt-2 text-[40px] leading-none font-extrabold" style={{ color: colors.darkTeal }}>Recicla</h1>

            <CameraCapture
                title="Capturar y Enviar Foto"
                initialFacingMode="environment"
                imageQuality={0.75}
                maxWidth={800}   // opcional
                maxHeight={800}  // opcional
                onCapture={(blob) => {
                    uploadIA(blob);
                }}
                takeData={{ IAresponse }}
                onAdd={(item) => addItem(item)}
            />
            {loading && <p>Clasificando...</p>}

            {IAresponse && (
                <div className="rounded p-3 bg-slate-100">
                    <p><b>Material:</b> {IAresponse.topClass}</p>
                    <p><b>Confianza:</b> {IAresponse.confidence}%</p>
                    <p><b>Puntaje:</b> {IAresponse.score}</p>
                </div>
            )}
        </div>
    );
}