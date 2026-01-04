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

    const setupRefreshTimer = React.useCallback((currentToken: TokenDTO) => {
        if (!currentToken.expiration) {
            console.warn('AuthContext: Token has no expiration date. Fallback to 1 hour.');
            setTimeout(() => { /* existing logic */ }, 3600000);
            return;
        }

        const expiresAt = new Date(currentToken.expiration).getTime();
        const now = Date.now();
        const timeUntilExpiration = expiresAt - now;

        // Refresh 5 minutes before expiration
        const BUFFER_TIME = 300000; // 5 minutes
        const refreshTime = timeUntilExpiration - BUFFER_TIME;

        console.log(`AuthContext: Token expires at ${currentToken.expiration}. Scheduling refresh in ${refreshTime / 1000}s.`);

        if (refreshTime <= 0) {
            console.log('AuthContext: Token is already expired or close to expiring. Refreshing immediately.');
            // Trigger refresh immediately (async)
            (async () => {
                try {
                    const { email, refreshToken } = currentToken;
                    const { refreshToken: refreshCall } = await import('../services/authService');
                    const newToken = await refreshCall(email, refreshToken);
                    setToken(newToken);
                    localStorage.setItem('token', JSON.stringify(newToken));
                    setupRefreshTimer(newToken);
                } catch (e) {
                    console.error('Immediate refresh failed', e);
                    // logout(); 
                }
            })();
            return;
        }

        setTimeout(async () => {
            try {
                console.log('AuthContext: Triggering auto-refresh token...');
                const { email, refreshToken } = currentToken;
                if (!email || !refreshToken) {
                    throw new Error('Missing email or refresh token');
                }

                const { refreshToken: refreshCall } = await import('../services/authService');
                const newToken = await refreshCall(email, refreshToken);
                console.log('AuthContext: Token refreshed successfully');

                setToken(newToken);
                localStorage.setItem('token', JSON.stringify(newToken));

                setupRefreshTimer(newToken); // Recursively set up next refresh

            } catch (error) {
                console.error('AuthContext: Auto-refresh failed', error);
                // logout();
            }
        }, refreshTime);
    }, []);

    useEffect(() => {
        const initializeAuth = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const parsedToken = JSON.parse(storedToken);

                    // Validate token structure
                    if (parsedToken && (parsedToken.body || parsedToken.statusCode)) {
                        console.warn('AuthContext: Invalid token structure. force logout.');
                        localStorage.removeItem('token');
                        setToken(null);
                    } else {
                        setToken(parsedToken);

                        // Setup Auto-Refresh
                        setupRefreshTimer(parsedToken);
                    }
                } catch (error) {
                    console.error('AuthContext: Token parse error', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, [setupRefreshTimer]);


    const login = async (credentials: AccountCredentialsDTO) => {
        try {
            const data = await authSignin(credentials);
            setToken(data);
            localStorage.setItem('token', JSON.stringify(data));

            // Start refresh timer
            setupRefreshTimer(data);
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
