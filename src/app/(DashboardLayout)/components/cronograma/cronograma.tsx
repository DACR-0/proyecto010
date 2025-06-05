'use client';

import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, MobileStepper, Button } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

interface CronogramaCarouselProps {
    images: string[];
    onUploadSuccess?: (newImageUrl: string) => void;
    uploadUrl: string;
}

const CronogramaCarousel: React.FC<CronogramaCarouselProps> = ({ images, onUploadSuccess, uploadUrl }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [carouselImages, setCarouselImages] = useState(images);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sincroniza carouselImages con images del padre
    useEffect(() => {
        setCarouselImages(images);
        setActiveStep(0); // Opcional: vuelve al inicio cuando cambian las imágenes
    }, [images]);

    const handleNext = () => setActiveStep((prev) => (prev + 1) % carouselImages.length);
    const handleBack = () => setActiveStep((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

    const handleButtonClick = () => inputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                if (onUploadSuccess) onUploadSuccess(data.url);
                // El padre actualizará images y el useEffect sincronizará carouselImages
            } else {
                alert("Error al subir la imagen");
            }
        }
    };

    return (
        <Box sx={{ position: "relative", width: "100%", height: "auto" }}>
            <Box
                component="img"
                src={carouselImages[activeStep]}
                alt={`Cronograma ${activeStep + 1}`}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 2,
                    boxShadow: 2,
                }}
            />
            <IconButton
                color="primary"
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(255,255,255,0.8)",
                    "&:hover": { background: "rgba(93,135,255,0.15)" },
                }}
                onClick={handleButtonClick}
                size="large"
            >
                <PhotoCamera />
            </IconButton>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <MobileStepper
                steps={carouselImages.length}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={carouselImages.length <= 1}>
                        Siguiente
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={carouselImages.length <= 1}>
                        <KeyboardArrowLeft />
                        Anterior
                    </Button>
                }
                sx={{ background: "transparent", justifyContent: "center" }}
            />
        </Box>
    );
};

export default CronogramaCarousel;