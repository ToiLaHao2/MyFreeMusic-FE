import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { themeApi, type ThemeSettings } from '../lib/api-client';

interface ThemeContextType {
    theme: ThemeSettings | null;
    refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({ theme: null, refreshTheme: async () => { } });

export const useTheme = () => useContext(ThemeContext);

// CSS Custom Properties mapping
const applyThemeToDOM = (theme: ThemeSettings) => {
    const root = document.documentElement;

    // Apply accent color
    root.style.setProperty('--theme-accent', theme.effectiveAccent);

    // Apply background
    if (theme.backgroundType === 'image' && theme.backgroundValue) {
        root.style.setProperty('--theme-bg', `url(${theme.backgroundValue})`);
        root.style.setProperty('--theme-bg-color', '#000000');
        document.body.classList.add('theme-has-bg-image');
    } else {
        root.style.setProperty('--theme-bg', 'none');
        root.style.setProperty('--theme-bg-color', theme.effectiveBackground || '#000000');
        document.body.classList.remove('theme-has-bg-image');
    }

    // Apply sidebar opacity
    root.style.setProperty('--theme-sidebar-opacity', String(theme.sidebarOpacity));
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [theme, setTheme] = useState<ThemeSettings | null>(null);

    const refreshTheme = async () => {
        if (!isAuthenticated) return;
        try {
            const res = await themeApi.get();
            const fetchedTheme = res.data.data.theme;
            setTheme(fetchedTheme);
            applyThemeToDOM(fetchedTheme);
        } catch (err) {
            console.error('Failed to fetch theme:', err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshTheme();
        } else {
            // Reset to defaults when logged out
            document.documentElement.style.setProperty('--theme-accent', '#00ABA9');
            document.documentElement.style.setProperty('--theme-bg', 'none');
            document.documentElement.style.setProperty('--theme-bg-color', '#000000');
        }
    }, [isAuthenticated]);

    return (
        <ThemeContext.Provider value={{ theme, refreshTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
