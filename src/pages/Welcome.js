import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth/login", { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Logged in as: <strong>{user?.email ?? "Unknown"}</strong>
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/users")}>
                View all users
            </Button>
            <Button variant="outlined" color="inherit" sx={{ ml: 2 }} onClick={handleLogout}>
                Logout
            </Button>
        </Box>
    );
};

export default Welcome;
