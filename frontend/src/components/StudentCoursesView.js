import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const StudentCoursesView = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = () => {
            const enrolledData = [
                { title: 'Introduction au Trading Algorithmique', desc: 'Apprenez les fondamentaux de la création et du backtesting de stratégies de trading automatisées.', duration: '8 Semaines' },
                { title: 'Analyse Quantitative Avancée', desc: 'Plongez au cœur de l\'arbitrage statistique, des modèles de machine learning et du trading haute fréquence.', duration: '12 Semaines' },
            ];
            const availableData = [
                { title: 'Dynamique du Marché Forex', desc: 'Maîtrisez les subtilités du marché des changes avec des informations professionnelles.', duration: '10 Semaines' },
                { title: 'Stratégies Crypto & DeFi', desc: 'Explorez le monde de la finance décentralisée et construisez des bots de trading pour les actifs crypto.', duration: '12 Semaines' },
            ];
            setTimeout(() => {
                setEnrolledCourses(enrolledData);
                setAvailableCourses(availableData);
                setIsLoading(false);
            }, 1000);
        };
        fetchCourses();
    }, []);

    if (isLoading) return <div>Loading Courses...</div>;

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold mb-8">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {enrolledCourses.map((course, index) => (
                        <div key={index} className="flex flex-col text-left rounded-xl p-6 border transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                            <div className="flex-grow">
                                <div className="flex justify-end items-center mb-4">
                                    <span className="text-xs" style={{ color: fxMutedText }}>{course.duration}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-white">{course.title}</h3>
                                <p className="text-sm" style={{ color: fxMutedText }}>{course.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-8">Available Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {availableCourses.map((course, index) => (
                        <div key={index} className="flex flex-col text-left rounded-xl p-6 border transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                            <div className="flex-grow">
                                <div className="flex justify-end items-center mb-4">
                                    <span className="text-xs" style={{ color: fxMutedText }}>{course.duration}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-white">{course.title}</h3>
                                <p className="text-sm" style={{ color: fxMutedText }}>{course.desc}</p>
                            </div>
                            <button className="w-full mt-6 font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-green-500 text-black hover:bg-green-600">
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentCoursesView;