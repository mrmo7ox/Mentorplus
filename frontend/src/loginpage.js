import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import './styles/LoginPage.css';
import { MailIcon, KeyIcon, EyeSlashFilledIcon, EyeFilledIcon } from './components/icons';
import { isTokenValid } from './utils/authutils';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const fxDarkBg = '#0F0F0D';
const fxAccentGreen = '#5DD62C';
const fxLightText = '#F3F3F3';
const fxMutedText = '#DFDFDC';
const fxSecondaryBgTransparent = 'rgba(26, 26, 26, 0.7)';

const LoginPage = () => {
    const [view, setView] = useState('login');
    const navigate = useNavigate();

    useEffect(() => {
    isTokenValid().then(valid => {
        console.log('Token valid?', valid);
        if (valid) navigate('/dashboard');
    });
    }, [navigate]);

    return (
        <div className="min-h-screen font-sans antialiased relative" style={{ backgroundColor: fxDarkBg, color: fxLightText }}>
            <ParticleBackground />
            <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
                <div className="w-full max-w-md p-8 rounded-xl shadow-lg border" style={{ backgroundColor: fxSecondaryBgTransparent, borderColor: fxDarkBg, backdropFilter: 'blur(5px)' }}>
                    <div className="flex flex-col items-center mb-6">
                        <KeyIcon className="text-5xl mb-3" style={{ color: fxAccentGreen }} />
                        <h2 className="text-3xl font-bold text-center mb-1">
                            {view === 'login' ? 'Se connecter' : 'Réinitialiser le mot de passe'}
                        </h2>
                    </div>
                    {view === 'login' ? (
                        <LoginForm setView={setView} />
                    ) : (
                        <ForgotPasswordForm setView={setView} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
