import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';

const fxDarkBg = '#0F0F0D';
const fxSecondaryBg = '#1A1A1A';
const fxAccentGreen = '#5DD62C';
const fxAccentDarkGreen = '#337418';
const fxLightText = '#F3F3F3';
const fxMutedText = '#DFDFDC';

const FxologyLogo = () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22H22L12 2ZM12 5.2L18.8 19H5.2L12 5.2ZM12 10.4L15.6 17H8.4L12 10.4Z" fill={fxAccentGreen}/>
    </svg>
);


const HomePage = () => {
    const infoCards = [
        { title: 'Apprentissage pratique', desc: 'Chaque cours vous guidera à travers tout le processus de conceptualisation et de construction d\'un projet.', num: '01', assetColor: fxAccentGreen },
        { title: 'Mentorat par nos experts', desc: 'Profitez de l\'expérience de votre mentor grâce à des retours exclusifs et pertinents.', num: '02', assetColor: fxAccentDarkGreen },
        { title: 'Compétences largement applicables', desc: 'L\'Académie est conçue pour vous fournir des compétences qui stimuleront votre croissance professionnelle.', num: '03', assetColor: '#4B5563' },
        { title: 'Reconnaissance', desc: 'À la fin, vous recevrez un certificat attestant de vos nouvelles compétences.', num: '04', assetColor: fxLightText },
    ];

    const courseCards = [
        { title: 'Introduction au Trading Algorithmique', desc: 'Apprenez les fondamentaux de la création et du backtesting de stratégies de trading automatisées.', category: 'Débutant', duration: '8 Semaines' },
        { title: 'Analyse Quantitative Avancée', desc: 'Plongez au cœur de l\'arbitrage statistique, des modèles de machine learning et du trading haute fréquence.', category: 'Avancé', duration: '12 Semaines' },
        { title: 'Dynamique du Marché Forex', desc: 'Maîtrisez les subtilités du marché des changes avec des informations professionnelles.', category: 'Intermédiaire', duration: '10 Semaines' },
        { title: 'Stratégies Crypto & DeFi', desc: 'Explorez le monde de la finance décentralisée et construisez des bots de trading pour les actifs crypto.', category: 'Expert', duration: '12 Semaines' },
    ];
    
    const handleScroll = (e, sectionId) => {
        e.preventDefault();
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen font-sans antialiased overflow-x-hidden" style={{ backgroundColor: fxDarkBg, color: fxLightText }}>
            <style>{`
                html { scroll-behavior: smooth; }
            `}</style>
            <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-20 z-10">
                <ParticleBackground />
                <nav className="absolute top-0 left-0 right-0 flex justify-between items-center py-4 px-8 md:px-12 z-20">
                    <div className="flex items-center gap-4"> <FxologyLogo /> </div>
                    <div className="hidden lg:flex items-center gap-8 font-medium text-white">
                        <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="hover:text-green-400 transition-colors">À propos</a>
                        <a href="#courses" onClick={(e) => handleScroll(e, 'courses')} className="hover:text-green-400 transition-colors">Cours</a>
                        <Link to="/login" className="hover:text-green-400 transition-colors">Connexion</Link>
                        <Link to="/register" className="hover:text-green-400 transition-colors">S'inscrire</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="font-mono font-semibold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 hover:scale-105 active:scale-95">
                            Démarrer votre parcours
                        </Link>
                        <button className="lg:hidden focus:outline-none p-2 rounded-md" style={{ backgroundColor: fxSecondaryBg, color: fxLightText }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </nav>
                <div className="relative z-10 pt-20">
                    <p className="text-lg md:text-xl font-bold mb-4 tracking-wider uppercase" style={{ color: fxAccentGreen }}>Notre Capital. Votre Succès.</p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 uppercase text-white">
                        Ton avenir tech<br />sans limite de temps
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-12 text-sm md:text-base font-medium" style={{ color: fxMutedText }}>
                        {['Accompagnement personnalisé', 'Performance', 'Communauté engagée', 'Programmes uniques'].map(item => (
                            <span key={item} className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fxAccentGreen }}></span> {item}
                            </span>
                        ))}
                    </div>
                    <Link to="/login" className="font-mono inline-block font-bold py-3 px-8 rounded-full text-lg shadow-xl transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 hover:scale-105 active:scale-95">
                        Démarrer votre parcours
                    </Link>
                </div>
            </header>
            <main>
                <section id="about" className="py-24 md:py-36 border-y" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                    <div className="container mx-auto px-6 md:px-20 text-center">
                        <h2 className="text-4xl md:text-6xl font-extrabold uppercase mb-8 text-white tracking-tighter">Qu'y a-t-il pour vous ?</h2>
                        <p className="text-lg md:text-xl font-light mb-16 max-w-3xl mx-auto" style={{ color: fxMutedText }}>
                            Acquérez toutes les compétences nécessaires pour lancer votre parcours professionnel grâce au mentorat de professionnels de l'industrie.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {infoCards.map((item) => (
                                <div key={item.num} className="relative rounded-xl p-8 shadow-xl border text-left transform hover:-translate-y-2 transition-transform duration-300" style={{ backgroundColor: fxDarkBg, borderColor: fxSecondaryBg }}>
                                    <p className="text-base font-light mb-4" style={{ color: fxMutedText }}>{item.desc}</p>
                                    <h3 className="font-bold text-2xl leading-tight mb-4 text-white">{item.title}</h3>
                                    <span className="absolute bottom-4 right-4 text-7xl font-extrabold opacity-10 select-none pointer-events-none" style={{ color: item.assetColor }}>
                                        {item.num}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="courses" className="py-24 md:py-36" style={{ backgroundColor: fxDarkBg }}>
                    <div className="container mx-auto px-6 md:px-20 text-center">
                        <h2 className="text-4xl md:text-6xl font-extrabold uppercase mb-16 text-white tracking-tighter">COURS</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {courseCards.map((course, index) => (
                                <div key={index} className="flex flex-col text-left rounded-xl p-6 border transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" style={{ backgroundColor: fxAccentDarkGreen, color: fxAccentGreen }}>{course.category}</span>
                                            <span className="text-xs" style={{ color: fxMutedText }}>{course.duration}</span>
                                        </div>
                                        <h3 className="font-bold text-xl mb-2 text-white">{course.title}</h3>
                                        <p className="text-sm" style={{ color: fxMutedText }}>{course.desc}</p>
                                    </div>
                                    <button className="w-full mt-6 font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-green-500 hover:text-black">
                                        En savoir plus
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <footer className="py-8 px-6 md:px-12 text-center border-t z-0" style={{ backgroundColor: fxDarkBg, color: 'gray', borderColor: fxSecondaryBg }}>
                <p className="text-sm">&copy; {new Date().getFullYear()} Fxology. Tous droits réservés.</p>
            </footer>
        </div>
    );
};


export default HomePage;
