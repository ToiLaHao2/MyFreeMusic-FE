import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import type { RootState } from '../store';
import { Music2, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password, rememberMe }));

        if (login.fulfilled.match(result)) {
            navigate(result.payload.role === 'ADMIN' ? '/admin' : '/');
        }
    };

    return (
        <div className="min-h-screen bg-black flex">
            {/* Left Side - Branding (Unchanged) */}
            <div className="hidden lg:flex lg:w-1/2 bg-metro-cyan items-center justify-center relative overflow-hidden">
                {/* ... (Animation code unchanged) ... */}
                <div className="absolute inset-0">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const size = Math.random() * 80 + 40;
                        const left = Math.random() * 100;
                        const top = Math.random() * 100;
                        const delay = Math.random() * 5;
                        const duration = Math.random() * 10 + 10;
                        const opacity = Math.random() * 0.15 + 0.05;

                        return (
                            <div
                                key={i}
                                className="absolute bg-white"
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    left: `${left}%`,
                                    top: `${top}%`,
                                    opacity,
                                    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
                                }}
                            />
                        );
                    })}
                </div>

                {/* Pulsing Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-96 h-96 border-2 border-white/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute w-80 h-80 border border-white/10 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                </div>

                {/* Logo Content */}
                <div className="relative z-10 text-center text-white">
                    <div className="relative">
                        <Music2 size={80} className="mx-auto mb-6 animate-pulse" strokeWidth={1} style={{ animationDuration: '2s' }} />
                    </div>
                    <h1 className="text-5xl font-light uppercase tracking-widest">
                        My<span className="font-bold">Free</span>Music
                    </h1>
                    <p className="mt-4 text-lg font-light opacity-80 tracking-wide">
                        Your personal music streaming
                    </p>
                </div>

                {/* Bottom Decorative Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-12">
                        <Music2 size={48} className="mx-auto mb-4 text-metro-cyan" strokeWidth={1} />
                        <h1 className="text-3xl font-light uppercase tracking-widest text-white">
                            My<span className="font-bold text-metro-cyan">Free</span>Music
                        </h1>
                    </div>

                    <h2 className="text-3xl font-light uppercase tracking-wider text-white mb-2">
                        Sign <span className="font-bold text-metro-cyan">In</span>
                    </h2>
                    <p className="text-gray-500 mb-8 text-sm">Enter your credentials to continue</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border-l-4 border-red-500 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">
                                Credential
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900 border-l-4 border-gray-700 p-4 text-white placeholder-gray-600 focus:border-metro-cyan focus:outline-none transition-colors"
                                placeholder="Email or Username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 border-l-4 border-gray-700 p-4 text-white placeholder-gray-600 focus:border-metro-cyan focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-metro-cyan focus:ring-metro-cyan"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-metro-cyan py-4 font-bold uppercase tracking-widest text-white hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Backend Credentials */}
                    <div className="mt-8 p-4 bg-gray-900 border-l-4 border-metro-orange">
                        <p className="text-xs font-bold uppercase tracking-widest text-metro-orange mb-2">Demo Accounts</p>
                        <div className="text-xs text-gray-400 space-y-1 font-mono">
                            <p>👤 user@myfreemusic.com / password</p>
                            <p>👑 master_admin / admin_oanh_hao</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
