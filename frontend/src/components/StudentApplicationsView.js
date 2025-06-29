import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const StudentApplicationsView = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/student/applications/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch applications");
                const data = await response.json();
                setApplications(data);
            } catch (err) {
                setApplications([]);
            }
            setIsLoading(false);
        };
        fetchApplications();
    }, []);

    const handleCancel = async (appId) => {
        try {
            const token = localStorage.getItem("access");
            const response = await fetch("http://localhost:8000/api/student/cancel-application/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ app_id: appId })
            });
            if (!response.ok) throw new Error("Failed to cancel application");
            setApplications(prev => prev.filter(app => app.id !== appId));
        } catch (err) {
            alert("Could not cancel application.");
        }
    };

    const statusColor = {
        'pending': 'text-yellow-400',
        'accepted': 'text-green-400',
        'rejected': 'text-red-500',
    };

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
                        <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                            <div className={`font-bold text-lg ${statusColor[app.status?.toLowerCase()]}`}>{app.status}</div>
                            {app.status?.toLowerCase() === 'pending' && (
                                <button onClick={() => handleCancel(app.id)} className="mt-2 font-mono text-xs font-semibold py-1 px-4 rounded-full transition-colors bg-red-500 text-black hover:bg-red-600">Cancel</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentApplicationsView;