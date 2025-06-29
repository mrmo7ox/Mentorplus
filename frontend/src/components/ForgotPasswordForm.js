import React, { useState } from 'react';
import { MailIcon, KeyIcon, EyeSlashFilledIcon, EyeFilledIcon } from './icons';

const fxAccentGreen = '#5DD62C';
const fxMutedText = '#DFDFDC';

const ForgotPasswordForm = ({ setView }) => {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState('');

    const handlePasswordRequest = async (e) => {
        e.preventDefault();
        setError("");
        setInfo("");
        // Email validation
        if (!email) {
            setError("L'email est requis.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Veuillez entrer un email valide.");
            return;
        }
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/password_reset/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Erreur lors de l'envoi de l'email.");
            } else {
                setInfo('Un email avec un token a été envoyé.');
                setStep('reset');
            }
        } catch (err) {
            setError("Erreur réseau. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Call API to reset password with token
        setIsLoading(false);
        setView('login');
    };

    if (step === 'email') {
        return (
            <form onSubmit={handlePasswordRequest} className="flex flex-col gap-6">
                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>Email</label>
                    <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors`} style={{ borderColor: error ? '#EF4444' : '#4B5563' }}>
                        <MailIcon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                        <input type="email" placeholder="Entrez votre email" className="w-full bg-transparent outline-none ml-3 text-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full font-mono font-bold py-3 text-lg rounded-full shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 flex items-center justify-center">
                    {isLoading ? 'Envoi...' : 'Envoyer'}
                </button>
                <p className="text-center text-sm mt-4">
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); setError('') }} className="underline" style={{ color: fxMutedText }}>Retour à la connexion</a>
                </p>
            </form>
        );
    }

    return (
        <form onSubmit={handlePasswordReset} className="flex flex-col gap-6">
            {info && <p className="text-green-500 text-center text-sm">{info}</p>}
            <div className="relative">
                <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>Token</label>
                <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors`} style={{ borderColor: error ? '#EF4444' : '#4B5563' }}>
                    <KeyIcon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                    <input type="text" placeholder="Entrez le token" className="w-full bg-transparent outline-none ml-3 text-lg" value={token} onChange={(e) => setToken(e.target.value)} />
                </div>
            </div>
            <div className="relative">
                <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>Nouveau Mot de passe</label>
                <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors`} style={{ borderColor: error ? '#EF4444' : '#4B5563' }}>
                    <KeyIcon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                    <input type={isVisible ? "text" : "password"} placeholder="Entrez le nouveau mot de passe" className="w-full bg-transparent outline-none ml-3 text-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="focus:outline-none ml-2" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? <EyeSlashFilledIcon className="text-2xl" style={{ color: fxMutedText }} /> : <EyeFilledIcon className="text-2xl" style={{ color: fxMutedText }} />}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full font-mono font-bold py-3 text-lg rounded-full shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 flex items-center justify-center">
                {isLoading ? 'Confirmation...' : 'Confirmer'}
            </button>
            <p className="text-center text-sm mt-4">
                <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); setError('') }} className="underline" style={{ color: fxMutedText }}>Retour à la connexion</a>
            </p>
        </form>
    );
};

export default ForgotPasswordForm;