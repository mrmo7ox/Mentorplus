import React, { useState, useEffect } from "react";
import { DownloadIcon } from "./icons";
import { useNavigate } from "react-router-dom";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const StudentCertificationsView = () => {
    const [certifications, setCertifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCerts = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/student/certificates/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch certificates");
                const data = await response.json();
                setCertifications(data);
            } catch (err) {
                setCertifications([]);
            }
            setIsLoading(false);
        };
        fetchCerts();
    }, []);

    if (isLoading) return <div>Loading certifications...</div>;

    const handleDownload = (cert) => {
        navigate("/cert", { state: { cert } });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">My Certifications</h2>
            <div className="space-y-4">
                {certifications.length === 0 && <div className="text-gray-400">No certificates issued yet.</div>}
                {certifications.map((cert, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{cert.course_name}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>Mentor: {cert.mentor_name}</p>
                            <p className="text-sm" style={{ color: fxMutedText }}>Issued on: {cert.issued_at}</p>
                            <p className="text-xs mt-2" style={{ color: fxMutedText }}>Feedback: {cert.feedback}</p>
                        </div>
                        <button
                            className="w-full sm:w-auto mt-4 sm:mt-0 font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-green-500 text-black hover:bg-green-600 flex items-center justify-center gap-2"
                            onClick={() => handleDownload(cert)}
                        >
                            <DownloadIcon /> Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCertificationsView;