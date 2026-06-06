import { createContext, useContext, useState, ReactNode } from "react";

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    dateCreated: string;
    totalStars?: number;
    reviewCount?: number;
}

interface AuthContextType {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        // should check if we're client-side or server-side before accessing localStorage (I think)
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("currentUser");
        return stored ? JSON.parse(stored) : null;
    });

    const logout = () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};