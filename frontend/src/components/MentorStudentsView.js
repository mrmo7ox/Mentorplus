import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const MentorStudentsView = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-blue-500 hover:text-black">Evaluate</button>
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-green-500 hover:text-black">Issue Certificate</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentorStudentsView;