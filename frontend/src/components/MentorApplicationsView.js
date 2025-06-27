import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const MentorApplicationsView = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApps = () => {
            const data = [
                { name: 'Sally Brown', course: 'Intro to Algotrading', date: '2024-06-20' },
                { name: 'Peppermint Patty', course: 'Advanced Quant Analysis', date: '2024-06-18' },
            ];
            setTimeout(() => {
                setApplications(data);
                setIsLoading(false);
            }, 1000);
        };
        fetchApps();
    }, []);

    if (isLoading) return <div>Loading applications...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Pending Applications</h2>
            <div className="space-y-4">
                {applications.map((app, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{app.name}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>Applied for "{app.course}" on {app.date}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-green-500 text-black hover:bg-green-600">Approve</button>
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-red-500 text-black hover:bg-red-600">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentorApplicationsView;