import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TokenDTO, AccountCredentialsDTO } from '../types';
import { signin as authSignin } from '../services/authService';

interface AuthContextType {
    token: TokenDTO | null;
    isAuthenticated: boolean;
    login: (credentials: AccountCredentialsDTO) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<TokenDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const parsedToken = JSON.parse(storedToken);
                    // Check for invalid token structure (backward compatibility/fix for wrapped response)
                    if (parsedToken && (parsedToken.body || parsedToken.statusCode)) {
                        console.warn('AuthContext: Detected invalid token structure. Clearing storage to force re-login.');
                        localStorage.removeItem('token');
                        setToken(null);
                    } else {
                        setToken(parsedToken);
                    }
                } catch (error) {
                    console.error('AuthContext: Failed to parse token', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (credentials: AccountCredentialsDTO) => {
        try {
            const data = await authSignin(credentials);
            setToken(data);
            localStorage.setItem('token', JSON.stringify(data));
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
