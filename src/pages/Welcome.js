import React from "react";
import { useAuth } from "../contexts/AuthContext";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Grid,
    Divider,
    Stack,
} from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const stringToColor = (name = "") => {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
};

const AvatarInitial = ({ email }) => {
    const name = email || "U";
    const initial = name.charAt(0).toUpperCase();
    return (
        <Avatar sx={{ width: 80, height: 80, bgcolor: stringToColor(name) }}>
            <Typography variant="h4">{initial}</Typography>
        </Avatar>
    );
};

const Welcome = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleViewUsers = () => {
        navigate("/users");
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth/login", { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 6,
                px: 2,
            }}
        >
            <Card sx={{ width: "100%", maxWidth: 900, boxShadow: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm="auto">
                            <AvatarInitial email={user?.email} />
                        </Grid>

                        <Grid item xs={12} sm>
                            <Typography variant="h5" gutterBottom>
                                Welcome{user?.displayName ? `, ${user.displayName}` : ""}!
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                                You're signed in as:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {user?.email ?? "Unknown"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm="auto">
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" color="primary" onClick={handleViewUsers}>
                                    View users
                                </Button>
                                <Button variant="outlined" color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body2" color="text.secondary">
                        Quick actions
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/profile")}
                        >
                            Profile
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/settings")}>
                            Settings
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/app")}>
                            Go to Dashboard
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Welcome;
