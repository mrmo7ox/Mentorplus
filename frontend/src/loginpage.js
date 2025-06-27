import React, {  useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import './styles/LoginPage.css';
import { MailIcon, KeyIcon, EyeSlashFilledIcon, EyeFilledIcon, PadlockIcon } from './components/icons';

const fxDarkBg = '#0F0F0D';
const fxAccentGreen = '#5DD62C';
const fxLightText = '#F3F3F3';
const fxMutedText = '#DFDFDC';
const fxSecondaryBgTransparent = 'rgba(26, 26, 26, 0.7)';





const LoginPage = ({ onNavigateToHome }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (value) => {
        if (!value) { setEmailError('L\'email est requis.'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setEmailError('Veuillez entrer une adresse email valide.'); return false; }
        setEmailError(''); return true;
    };
    const validatePassword = (value) => {
        if (!value) { setPasswordError('Le mot de passe est requis.'); return false; }
        if (value.length < 8) { setPasswordError('Le mot de passe doit contenir au moins 8 caractères.'); return false; }
        setPasswordError(''); return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email) || !validatePassword(password)) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        if(onNavigateToHome) onNavigateToHome();
    };

    return (
        <div className="min-h-screen font-sans antialiased relative" style={{ backgroundColor: fxDarkBg, color: fxLightText }}>
            <ParticleBackground />
            <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
                <div className="w-full max-w-md p-8 rounded-xl shadow-lg border" style={{ backgroundColor: fxSecondaryBgTransparent, borderColor: fxDarkBg, backdropFilter: 'blur(5px)' }}>
                    <div className="flex flex-col items-center mb-6">
                        <PadlockIcon className="text-5xl mb-3" style={{ color: fxAccentGreen }} />
                        <h2 className="text-3xl font-bold text-center mb-1">Connectez-vous à votre compte</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="relative">
                            <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>Email</label>
                            <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 hover:border-green-500 transition-colors`} style={{ borderColor: emailError ? '#EF4444' : '#4B5563' }}>
                                <MailIcon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                                <input type="email" placeholder="Entrez votre email" className="w-full bg-transparent outline-none ml-3 text-lg" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => validateEmail(email)} />
                            </div>
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>
                        <div className="relative">
                            <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>Mot de passe</label>
                            <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 hover:border-green-500 transition-colors`} style={{ borderColor: passwordError ? '#EF4444' : '#4B5563' }}>
                                <KeyIcon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                                <input type={isVisible ? "text" : "password"} placeholder="Entrez votre mot de passe" className="w-full bg-transparent outline-none ml-3 text-lg" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => validatePassword(password)} />
                                <button type="button" className="focus:outline-none ml-2" onClick={() => setIsVisible(!isVisible)}>
                                    {isVisible ? <EyeSlashFilledIcon className="text-2xl" style={{ color: fxMutedText }} /> : <EyeFilledIcon className="text-2xl" style={{ color: fxMutedText }} />}
                                </button>
                            </div>
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full font-mono font-bold py-3 text-lg rounded-full shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 flex items-center justify-center">
                            {isLoading ? <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Connexion'}
                        </button>
                        <p className="text-center text-sm mt-4" style={{ color: fxMutedText }}>
                            Vous n'avez pas de compte ? <Link to="/register" className="underline" style={{ color: fxAccentGreen }}>Inscrivez-vous ici</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default LoginPage;
