"use client";

import React, { useRef, useState } from "react";
import { Box, Button, Slider, Typography } from "@/lib/mui";
import Cropper from "cropperjs";

export default function AvatarCropper() {
    const imageRef = useRef(null);
    const cropperRef = useRef(null);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [zoom, setZoom] = useState(1);

    // Upload billede
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImage(url);
    };

    // Når billedet er loaded → init cropper
    const handleImageLoad = () => {
        if (cropperRef.current) {
            cropperRef.current.destroy();
        }

        cropperRef.current = new Cropper(imageRef.current, {
            aspectRatio: 1,
            viewMode: 3,
            autoCropArea: 1,
            dragMode: "move",
            guides: false,
            center: false,
            highlight: false,
            crop: updatePreview
        });
    };

    // Live preview
    const updatePreview = () => {
        if (!cropperRef.current) return;

        const canvas = cropperRef.current.getCroppedCanvas({
            width: 200,
            height: 200
        });

        setPreview(canvas.toDataURL());
    };

    // Zoom slider
    const handleZoom = (e, value) => {
        setZoom(value);
        if (cropperRef.current) {
            cropperRef.current.zoomTo(value);
        }
    };

    // Gem billede
    const handleSave = async () => {
        if (!cropperRef.current) return;

        const canvas = cropperRef.current.getCroppedCanvas({
            width: 512,
            height: 512
        });

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("file", blob, "avatar.png");

            const res = await fetch("/api/account/avatar", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const croppedImage = canvas.toDataURL("image/png");

                document.querySelectorAll(".avatar-img").forEach(img => {
                    img.src = croppedImage;
                });
            }
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center"
            }}
        >
            <Typography variant="h5">Upload Avatar</Typography>

            {/* Upload */}
            <Button variant="contained" component="label">
                Choose Image
                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
            </Button>

            {/* Cropper + Preview */}
            {image && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                        alignItems: "center"
                    }}
                >
                    {/* Cropper */}
                    <Box
                        sx={{
                            width: 256,
                            height: 256,
                            overflow: "hidden",
                            borderRadius: "50%",
                            boxShadow: 3
                        }}
                    >
                        <img
                            ref={imageRef}
                            src={image}
                            alt="Crop"
                            onLoad={handleImageLoad}
                            style={{ maxWidth: "100%" }}
                        />
                    </Box>

                    {/* Preview */}
                    {preview && (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2">Preview</Typography>
                            <Box
                                component="img"
                                src={preview}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    mt: 1,
                                    boxShadow: 2
                                }}
                            />
                        </Box>
                    )}
                </Box>
            )}

            {/* Zoom */}
            {image && (
                <Box sx={{ width: 250 }}>
                    <Typography variant="body2">Zoom</Typography>
                    <Slider
                        min={0.5}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={handleZoom}
                    />
                </Box>
            )}

            {/* Save */}
            {image && (
                <Button variant="contained" onClick={handleSave}>
                    Save Avatar
                </Button>
            )}
        </Box>
    );
}