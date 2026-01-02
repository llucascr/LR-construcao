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
        // Hardcoded 1 hour time as requested (3600000 ms)

        const REFRESH_TIME = 3600000; // 1 hour

        // Clear any existing timer if we were storing it in a ref (simplified here for functional component)

        setTimeout(async () => {
            try {
                console.log('AuthContext: Triggering auto-refresh token...');
                const { email, refreshToken } = currentToken;
                if (!email || !refreshToken) {
                    throw new Error('Missing email or refresh token');
                }

                // Import dynamically to avoid circular dependency if any (though authService is pure)
                const { refreshToken: refreshCall } = await import('../services/authService');

                const newToken = await refreshCall(email, refreshToken);
                console.log('AuthContext: Token refreshed successfully');

                setToken(newToken);
                localStorage.setItem('token', JSON.stringify(newToken));

                // Recursively set up next refresh
                setupRefreshTimer(newToken);

            } catch (error) {
                console.error('AuthContext: Auto-refresh failed', error);
                // Optionally logout on fail, or just let the token expire naturally
                // logout(); 
            }
        }, REFRESH_TIME);
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
