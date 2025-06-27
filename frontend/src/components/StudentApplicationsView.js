import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const StudentApplicationsView = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = () => {
            const data = [{ title: 'Dynamique du Marché Forex', status: 'Pending', date: '2024-06-15' }];
            setTimeout(() => {
                setApplications(data);
                setIsLoading(false);
            }, 1000);
        };
        fetchApplications();
    }, []);

    const statusColor = { 'Pending': 'text-yellow-400' };

    if (isLoading) return <div>Loading applications...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">My Applications</h2>
            <div className="space-y-4">
                {applications.map((app, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{app.title}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>Applied on: {app.date}</p>
                        </div>
                        <div className={`mt-4 sm:mt-0 font-bold text-lg ${statusColor[app.status]}`}>{app.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentApplicationsView;