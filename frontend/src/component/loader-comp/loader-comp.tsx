"use client"

import "./loader-comp.css";
import { Box } from "@mui/material";

export default function LoaderComp() {
    return (
        <Box className="loader-overlay">
            <Box className="loader-container">
                <Box className="logo">
                    Linked<span>in</span>
                </Box>

                <Box className="loader-bar">
                    <Box className="loader-progress"></Box>
                </Box>
            </Box>
        </Box>
    );
}