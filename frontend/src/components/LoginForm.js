import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailIcon, KeyIcon, EyeSlashFilledIcon, EyeFilledIcon } from './icons';

const fxAccentGreen = '#5DD62C';
const fxMutedText = '#DFDFDC';

const LoginForm = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (value) => {
        if (!value) { setError("L'email est requis."); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError('Veuillez entrer une adresse email valide.'); return false; }
        return true;
    };
    const validatePassword = (value) => {
        if (!value) { setError('Le mot de passe est requis.'); return false; }
        return true;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(email) || !validatePassword(password)) return;
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.detail || 'Échec de la connexion. Veuillez réessayer.');
            } else {
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                navigate("/dashboard");
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
            <div className="relative">
                <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>Email</label>
                <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors`} style={{ borderColor: error ? '#EF4444' : '#4B5563' }}>
                    <MailIcon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                    <input type="email" placeholder="Entrez votre email" className="w-full bg-transparent outline-none ml-3 text-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>
            <div className="relative">
                <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>Mot de passe</label>
                <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors`} style={{ borderColor: error ? '#EF4444' : '#4B5563' }}>
                    <KeyIcon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                    <input type={isVisible ? "text" : "password"} placeholder="Entrez votre mot de passe" className="w-full bg-transparent outline-none ml-3 text-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="focus:outline-none ml-2" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? <EyeSlashFilledIcon className="text-2xl" style={{ color: fxMutedText }} /> : <EyeFilledIcon className="text-2xl" style={{ color: fxMutedText }} />}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <div className="text-right -mt-4">
                <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot_password_email'); setError(''); }} className="text-sm underline" style={{ color: fxAccentGreen }}>Mot de passe oublié ?</a>
            </div>
            <button type="submit" disabled={isLoading} className="w-full font-mono font-bold py-3 text-lg rounded-full shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 flex items-center justify-center">
                {isLoading ? <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Connexion'}
            </button>
            <p className="text-center text-sm mt-4" style={{ color: fxMutedText }}>Pas de compte ? <Link to="/register" className="underline" style={{ color: fxAccentGreen }}>Inscrivez-vous ici</Link></p>
        </form>
    );
};

export default LoginForm;