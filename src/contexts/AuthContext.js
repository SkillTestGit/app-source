// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser || null);
            setChecking(false);
            console.log("Auth state changed:", currentUser);
        });

        return () => unsubscribe();
    }, []);

    // expose a logout function that components can call
    const logout = () => {
        // returns a promise so callers can await and handle errors
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, checking, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
