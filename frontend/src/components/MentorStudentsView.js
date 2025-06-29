import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const MentorStudentsView = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [certStudent, setCertStudent] = useState(null);
    const [evaluation, setEvaluation] = useState("");
    const [evalError, setEvalError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/mentor/students/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch students");
                const data = await response.json();
                setStudents(data);
            } catch (err) {
                setStudents([]);
            }
            setIsLoading(false);
        };
        fetchStudents();
    }, []);

    const handleOpenCert = (student) => {
        setCertStudent(student);
        setEvaluation("");
        setEvalError("");
    };

    const handleCloseCert = () => {
        setCertStudent(null);
        setEvaluation("");
        setEvalError("");
    };

    const handleEvalChange = (e) => {
        const value = e.target.value;
        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 20) {
            setEvalError("Evaluation must be no more than 20 words.");
        } else {
            setEvalError("");
        }
        setEvaluation(value);
    };

    const handleIssueCert = async () => {
        const wordCount = evaluation.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount === 0 || wordCount > 25) {
            setEvalError("Evaluation must be no more than 25 words.");
            return;
        }
        setSubmitting(true);
        // TODO: Call backend to issue certificate
        setTimeout(() => {
            setSubmitting(false);
            setCertStudent(null);
            setEvaluation("");
            setEvalError("");
            alert("Certificate issued!");
        }, 1000);
    };

    if (isLoading) return <div>Loading students...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">My Students</h2>
            <div className="space-y-4">
                {students.map((student, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div className='flex-1'>
                            <h3 className="font-bold text-xl text-white">{student.student_first_name} {student.student_last_name}</h3>
                            <p className="text-xs" style={{ color: fxMutedText }}>{student.student_email}</p>

                            <p className="text-sm" style={{ color: fxMutedText }}>{student.course_name}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-green-500 hover:text-black" onClick={() => handleOpenCert(student)}>Issue Certificate</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certificate Issue Modal/Card */}
            {certStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-[#232323] rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Issue Certificate</h3>
                        <p className="text-gray-300 mb-2">Student: <span className="font-semibold">{certStudent.student_first_name} {certStudent.student_last_name}</span></p>
                        <p className="text-gray-300 mb-2">Course: <span className="font-semibold">{certStudent.course_name}</span></p>
                        <textarea
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 h-24 resize-none mb-2"
                            placeholder="Enter evaluation (max 25 words)"
                            value={evaluation}
                            onChange={handleEvalChange}
                            maxLength={250}
                        />
                        {evalError && <div className="text-red-500 mb-2">{evalError}</div>}
                        <div className="text-yellow-400 text-xs mb-4">Warning: This operation is <span className="font-bold">irreversible</span>. Once issued, the certificate cannot be revoked.</div>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleCloseCert} disabled={submitting} className="font-mono font-semibold py-2 px-6 rounded-full text-base transition-colors bg-gray-600 hover:bg-gray-700 text-white">Cancel</button>
                            <button onClick={handleIssueCert} disabled={submitting || !!evalError || evaluation.trim().split(/\s+/).filter(Boolean).length === 0} className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 disabled:opacity-50">{submitting ? 'Issuing...' : 'Issue Certificate'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorStudentsView;