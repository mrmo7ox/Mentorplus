import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import { UserIcon, MailIcon, KeyIcon , EyeSlashFilledIcon ,EyeFilledIcon } from './components/icons';

const fxDarkBg = '#0F0F0D';
const fxAccentGreen = '#5DD62C';
const fxLightText = '#F3F3F3';
const fxMutedText = '#DFDFDC';
const fxSecondaryBgTransparent = 'rgba(26, 26, 26, 0.7)';




const RegisterPage = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', repeatPassword: '' });
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.firstName) tempErrors.firstName = "Le prénom est requis.";
        if (!formData.lastName) tempErrors.lastName = "Le nom de famille est requis.";
        if (!formData.email) tempErrors.email = "L'email est requis.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = "L'email n'est pas valide.";
        if (!formData.password) tempErrors.password = "Le mot de passe est requis.";
        else if (formData.password.length < 8) tempErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
        if (formData.password !== formData.repeatPassword) tempErrors.repeatPassword = "Les mots de passe ne correspondent pas.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        console.log("Form submitted successfully!", formData);
    };

    return (
        <div className="min-h-screen font-sans antialiased relative" style={{ backgroundColor: fxDarkBg, color: fxLightText }}>
            <ParticleBackground />
            <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
                <div className="w-full max-w-md p-8 rounded-xl shadow-lg border" style={{ backgroundColor: fxSecondaryBgTransparent, borderColor: fxDarkBg, backdropFilter: 'blur(5px)' }}>
                    <div className="flex flex-col items-center mb-6">
                        <UserIcon className="text-5xl mb-3" style={{ color: fxAccentGreen }} />
                        <h2 className="text-3xl font-bold text-center mb-1">Créer un compte</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {[
                          {key: 'firstName', label: 'Prénom', icon: UserIcon, type: 'text'},
                          {key: 'lastName', label: 'Nom de famille', icon: UserIcon, type: 'text'},
                          {key: 'email', label: 'Email', icon: MailIcon, type: 'email'},
                          {key: 'password', label: 'Mot de passe', icon: KeyIcon, type: 'password'},
                          {key: 'repeatPassword', label: 'Répéter le mot de passe', icon: KeyIcon, type: 'password'},
                        ].map(field => {
                            const isPasswordField = field.type === 'password';
                            const isVisible = (field.key === 'password' && isPasswordVisible) || (field.key === 'repeatPassword' && isRepeatPasswordVisible);
                            const type = isPasswordField ? (isVisible ? 'text' : 'password') : field.type;
                            const Icon = field.icon;
                            
                            return (
                                <div className="relative" key={field.key}>
                                    <label className="absolute -top-3 left-3 px-1 text-lg z-10" style={{ backgroundColor: '#1A1A1A' }}>{field.label}</label>
                                    <div className={`relative flex items-center bg-transparent border rounded-xl px-4 py-3 focus-within:border-green-500 hover:border-green-500 transition-colors`} style={{ borderColor: errors[field.key] ? '#EF4444' : '#4B5563' }}>
                                        <Icon className="text-2xl flex-shrink-0" style={{ color: fxMutedText }} />
                                        <input name={field.key} type={type} placeholder={`Entrez votre ${field.label.toLowerCase()}`} className="w-full bg-transparent outline-none ml-3 text-lg" value={formData[field.key]} onChange={handleChange} />
                                        {isPasswordField && (
                                            <button type="button" className="focus:outline-none ml-2" onClick={() => field.key === 'password' ? setIsPasswordVisible(p => !p) : setIsRepeatPasswordVisible(p => !p)}>
                                                {isVisible ? <EyeSlashFilledIcon className="text-2xl" style={{ color: fxMutedText }} /> : <EyeFilledIcon className="text-2xl" style={{ color: fxMutedText }} />}
                                            </button>
                                        )}
                                    </div>
                                    {errors[field.key] && <p className="text-red-500 text-sm mt-1">{errors[field.key]}</p>}
                                </div>
                            )
                        })}
                        <button type="submit" disabled={isLoading} className="w-full font-mono font-bold py-3 text-lg rounded-full shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 flex items-center justify-center">
                            {isLoading ? <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'S\'inscrire'}
                        </button>
                        <p className="text-center text-sm mt-4" style={{ color: fxMutedText }}>Vous avez déjà un compte ? <Link to="/login" className="underline" style={{ color: fxAccentGreen }}>Connectez-vous ici</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
