import React, { useState, useEffect } from "react";
import { DownloadIcon } from "./icons";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const StudentCertificationsView = () => {
    const [certifications, setCertifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = () => {
            const data = [{ title: 'Certificate of Completion: Algorithmic Trading Foundations', date: '2023-12-15' }];
            setTimeout(() => {
                setCertifications(data);
                setIsLoading(false);
            }, 1000);
        };
        fetchCerts();
    }, []);

    if (isLoading) return <div>Loading certifications...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">My Certifications</h2>
            <div className="space-y-4">
                {certifications.map((cert, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{cert.title}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>Issued on: {cert.date}</p>
                        </div>
                        <button className="w-full sm:w-auto mt-4 sm:mt-0 font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-green-500 text-black hover:bg-green-600 flex items-center justify-center gap-2">
                            <DownloadIcon /> Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCertificationsView;