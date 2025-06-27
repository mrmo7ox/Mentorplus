import React, { useState, useEffect } from "react";

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const MentorCoursesView = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = () => {
            const data = [
                { title: 'Introduction au Trading Algorithmique', students: 25, status: 'Active' },
                { title: 'Analyse Quantitative Avancée', students: 18, status: 'Active' },
            ];
            setTimeout(() => {
                setCourses(data);
                setIsLoading(false);
            }, 1000);
        };
        fetchCourses();
    }, []);

    if (isLoading) return <div>Loading courses...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Courses</h2>
                <button className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600">Add New Course</button>
            </div>
            <div className="space-y-4">
                {courses.map((course, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{course.title}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>{course.students} students enrolled</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-yellow-500 hover:text-black">Edit</button>
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-red-500 hover:text-black">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentorCoursesView;