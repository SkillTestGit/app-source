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
    SvgIcon,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

/* AvatarInitial: shows the First Letter of the Email */
const AvatarInitial = ({ email }) => {
    const name = email || "U";
    const initial = name.charAt(0).toUpperCase();
    return (
        <Avatar sx={{ width: 80, height: 80, bgcolor: "#63738114" }}>
            <Typography variant="h4">{initial}</Typography>
        </Avatar>
    );
};

/* Inline Person SVG Icon using SvgIcon */
const PersonSvgIcon = (props) => (
    <SvgIcon {...props}>
        {/* Standard "person" path from Material icons (keeps bundle small & independent) */}
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
    </SvgIcon>
);

const Welcome = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    /* Handlers for quick actions */
    const handleViewUsers = () => navigate("/users");
    const handleLogout = async () => {
        try {
            // sign out
            await logout();
            // navigate to login immediately for snappier UX
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
                alignItems: "center",
                minHeight: "100vh",
                p: 2,
                width: "100%"
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
                                {/* If displayName exists, personalize the greeting */}
                                Welcome{user?.displayName ? `, ${user.displayName}` : ""}!
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                                You're signed in as:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {user?.email ?? "Unknown"}
                            </Typography>
                        </Grid>

                        {/* Actions: users list and Logout */}
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

                    {/* Secondary quick actions (Profile, Settings, Dashboard). */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/profile")}
                            startIcon={<PersonSvgIcon />}
                        >
                            Profile
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/settings")}>
                            Settings
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/app")}>
                            Go to Chat
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};


export default Welcome;
