import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const MentorApplicationsView = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/mentor/applications/", {
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
        fetchApps();
    }, []);

    const handleAction = async (app_id, action) => {
        try {
            const token = localStorage.getItem("access");
            const response = await fetch("http://localhost:8000/api/mentor/applications/action/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ app_id, action })
            });
            if (!response.ok) throw new Error("Failed to update application");
            // Remove the application from the list after action
            setApplications(applications.filter(app => app.id !== app_id));
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    if (isLoading) return <div>Loading applications...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Pending Applications</h2>
            <div className="space-y-4">
                {applications.map((app, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{app.student_first_name} {app.student_last_name}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>Email: {app.student_email}</p>
                            <p className="text-sm" style={{ color: fxMutedText }}>Applied for "{app.course}" on {app.date}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <button onClick={() => handleAction(app.id, 'approve')} className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-green-500 text-black hover:bg-green-600">Approve</button>
                            <button onClick={() => handleAction(app.id, 'reject')} className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-red-500 text-black hover:bg-red-600">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentorApplicationsView;