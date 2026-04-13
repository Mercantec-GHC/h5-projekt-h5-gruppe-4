"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge, Box, Button, Slider, Typography } from "@/lib/mui";
import Cropper from "cropperjs";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { ModalElement } from "$/Components";
import { deleteAvatar, hentAvatar, uploadAvatar } from "@/api";

export default function AvatarCropper({ bruger }) {
    const imageRef = useRef(null);
    const cropperRef = useRef(null);
    const fileInputRef = useRef(null);

    const [image, setImage] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [open, setOpen] = useState(false);

    const hasAvatar = !!avatar;
    const toggleModal = () => setOpen(!open);

    useEffect(() => {
        if (!bruger?.id) return;

        hentAvatar(bruger.id)
            .then(url => {
                setAvatar(url);
            })
            .catch(err => {
                console.log("No avatar found, or error fetching avatar:", err);
                console.error("HENT AVATAR:", err);
            });

    }, [bruger?.id]);

    // Klik avatar
    const handleAvatarClick = () => {
        if (!hasAvatar) {
            fileInputRef.current.click();
        } else {
            toggleModal();
        }
    };
    useEffect(() => {
        if (!image || !imageRef.current) return;

        // cleanup gammel cropper
        if (cropperRef.current) {
            cropperRef.current.destroy();
            cropperRef.current = null;
        }

        const cropper = new Cropper(imageRef.current, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: "move",

            autoCropArea: 1,

            movable: true,
            zoomable: true,
            zoomOnTouch: true,
            zoomOnWheel: true,

            cropBoxMovable: false,
            cropBoxResizable: false,

            guides: false,
            center: false,
            highlight: false,
            background: false,

            responsive: true,
            checkOrientation: false,

            crop() {
                const canvas = cropper.getCroppedCanvas({
                    width: 200,
                    height: 200
                });

                if (canvas) {
                    setAvatar(canvas.toDataURL());
                }
            }
        });

        cropperRef.current = cropper;

        return () => {
            cropper.destroy();
            cropperRef.current = null;
        };
    }, [image]);
    // Upload billede
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImage(url);
        setOpen(true);
    };

    // Save
    const handleSave = async () => {
        if (!cropperRef.current) return;

        const canvas = cropperRef.current.getCroppedCanvas({
            width: 512,
            height: 512
        });

        canvas.toBlob(async (blob) => {
            try {

                await uploadAvatar(blob);
                const cropped = canvas.toDataURL("image/png");
                setAvatar(cropped);

                setOpen(false);

            } catch (err) {
                console.error("UPLOAD ERROR:", err);
            }
        });
    };

    // Slet avatar
    const handleDelete = async () => {
        try {
            await deleteAvatar(bruger.id);
        } catch (err) {
            // 👇 accepter denne fejl som OK
            if (err.response?.data?.includes("Avatar not found")) {
                console.log("Avatar already deleted");
            } else {
                console.error(err);
                return;
            }
        }

        setAvatar(null);
    };

    return (
        <>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Avatar */}
            <Box onClick={handleAvatarClick} sx={{ cursor: "pointer" }}>
                {hasAvatar ? (
                    <Badge
                        overlap="circular"
                        color="success"
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        badgeContent={
                            <Box onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                            }}>
                                <MdOutlineEdit />
                            </Box>
                        }
                    >
                        <Badge
                            overlap="circular"
                            color="error"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={
                                <Box onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}>
                                    <MdOutlineDeleteForever />
                                </Box>
                            }
                        >
                            <Box
                                component="img"
                                src={avatar}
                                className="avatar-img"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%"
                                }}
                            />
                        </Badge>
                    </Badge>
                ) : (
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            border: "2px dashed gray",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Typography>+</Typography>
                    </Box>
                )}
            </Box>

            {/* Modal */}
            <ModalElement
                open={open}
                handleOpen={toggleModal}
                titel="Edit Avatar"
                width={400}
                height="auto"
            >
                {image && (
                    <>
                        <Box
                            sx={{
                                width: 250,
                                height: 250,
                                mx: "auto",
                            }}
                        >
                            <img
                                ref={imageRef}
                                src={image}
                                alt="crop"
                                style={{
                                    display: "block",
                                    maxWidth: "100%"
                                }}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSave}
                            sx={{ mt: 2 }}
                        >
                            Save
                        </Button>
                    </>
                )}
            </ModalElement>
        </>
    );
}