import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const MentorStudentsView = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = () => {
            const data = [
                { name: 'Charlie Brown', course: 'Intro to Algotrading' },
                { name: 'Lucy van Pelt', course: 'Intro to Algotrading' },
                { name: 'Linus van Pelt', course: 'Advanced Quant Analysis' },
            ];
            setTimeout(() => {
                setStudents(data);
                setIsLoading(false);
            }, 1000);
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
                            <h3 className="font-bold text-xl text-white">{student.name}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>{student.course}</p>
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