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