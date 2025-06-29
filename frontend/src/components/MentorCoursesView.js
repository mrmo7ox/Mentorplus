import React, { useState, useEffect } from "react";

// --- Style Constants ---
const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';
const fxSecondaryBgTransparent = 'rgba(26, 26, 26, 0.8)';
const fxAccentDarkGreen = '#337418';
const fxAccentGreen = '#5DD62C';

// --- Mentor Views ---
const MentorCoursesView = ({ user }) => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [newCourseData, setNewCourseData] = useState({ name: '', description: '', duration: '', category: '' });
    const [submissionStatus, setSubmissionStatus] = useState({ error: null, success: null });
    const [editCourseId, setEditCourseId] = useState(null);
    const [deleteCourseId, setDeleteCourseId] = useState(null);
    console.log("User prop in MentorCoursesView:", user); // <-- ADD THIS LINE
    
    // Fetch courses created by this mentor
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/me/mentor/Courses", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch courses.');
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setCourses([]);
                console.error(err);
            }
            setIsLoading(false);
        };
        fetchCourses();
    }, []);

    // Fetch categories when the "Add Course" form is opened
    useEffect(() => {
        const fetchCategories = async () => {
            if (isAddingCourse) {
                try {
                    const token = localStorage.getItem("access");
                    const response = await fetch("http://localhost:8000/api/categories/", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                     if (!response.ok) {
                        throw new Error('Failed to fetch categories.');
                    }
                    const data = await response.json();
                    setCategories(data);
                } catch (err) {
                    setCategories([]);
                    console.error(err);
                }
            }
        };
        fetchCategories();
    }, [isAddingCourse]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'duration') {
            // Only allow integer values
            const intValue = value.replace(/[^0-9]/g, '');
            setNewCourseData(prev => ({ ...prev, [name]: intValue }));
        } else {
            setNewCourseData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditClick = (course) => {
        setEditCourseId(course.id);
        setIsAddingCourse(true);
        setNewCourseData({
            name: course.name || '',
            description: course.description || '',
            duration: course.duration ? String(course.duration) : '',
            category: course.category ? course.category.id : ''
        });
    };

    const handleDeleteClick = (courseId) => {
        setDeleteCourseId(courseId);
    };

    const confirmDelete = async () => {
        if (!deleteCourseId) return;
        try {
            const token = localStorage.getItem("access");
            const response = await fetch("http://localhost:8000/api/mentor/delete-course/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ course_id: deleteCourseId }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error deleting course.");
            setCourses(prev => prev.filter(c => c.id !== deleteCourseId));
            setDeleteCourseId(null);
        } catch (err) {
            alert(err.message);
            setDeleteCourseId(null);
        }
    };

    const cancelDelete = () => {
        setDeleteCourseId(null);
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setSubmissionStatus({ error: null, success: null });

        if (!newCourseData.name || !newCourseData.description || !newCourseData.duration || !newCourseData.category) {
            setSubmissionStatus({ error: "All fields are required.", success: null });
            return;
        }

        try {
            const token = localStorage.getItem("access");
            let url, method, body;
            if (editCourseId) {
                url = "http://localhost:8000/api/mentor/edit-course/";
                method = "POST";
                body = JSON.stringify({ ...newCourseData, course_id: editCourseId });
            } else {
                url = "http://localhost:8000/api/add-course/";
                method = "POST";
                body = JSON.stringify(newCourseData);
            }
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || (editCourseId ? "Error editing course." : "Error adding course."));
            setSubmissionStatus({ success: editCourseId ? "Course updated successfully!" : "Course added successfully!", error: null });
            if (editCourseId) {
                setCourses(prev => prev.map(c => c.id === editCourseId ? { ...c, ...newCourseData, category: c.category && newCourseData.category ? { ...c.category, id: newCourseData.category } : c.category } : c));
            } else {
                setCourses(prevCourses => [data, ...prevCourses]);
            }
            setTimeout(() => {
                setIsAddingCourse(false);
                setNewCourseData({ name: '', description: '', duration: '', category: '' });
                setSubmissionStatus({ error: null, success: null });
                setEditCourseId(null);
            }, 1500);
        } catch (err) {
            setSubmissionStatus({ error: err.message, success: null });
        }
    };

    if (isLoading) return <div>Loading courses...</div>;

    if (isAddingCourse) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-white">{editCourseId ? 'Edit Course' : 'Add a New Course'}</h2>
                <form onSubmit={handleAddCourse} className="p-8 space-y-6 rounded-xl" style={{ backgroundColor: fxSecondaryBgTransparent, backdropFilter: 'blur(5px)' }}>
                    <input name="name" value={newCourseData.name} onChange={handleInputChange} placeholder="Course Title" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500" />
                    <textarea name="description" value={newCourseData.description} onChange={handleInputChange} placeholder="Course Description" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 h-24 resize-none"></textarea>
                    <input name="duration" value={newCourseData.duration} onChange={handleInputChange} placeholder="Duration (weeks)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500" maxLength={3} type="number" min="1" />
                    <select name="category" value={newCourseData.category} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500">
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {submissionStatus.error && <div className="text-red-500">{submissionStatus.error}</div>}
                    {submissionStatus.success && <div className="text-green-500">{submissionStatus.success}</div>}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => { setIsAddingCourse(false); setEditCourseId(null); setNewCourseData({ name: '', description: '', duration: '', category: '' }); }} className="font-mono font-semibold py-2 px-6 rounded-full text-base transition-colors bg-gray-600 hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600">{editCourseId ? 'Save Changes' : 'Save Course'}</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Courses</h2>
                 {user?.grp === 2 && (
                    <button onClick={() => setIsAddingCourse(true)} className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600">Add New Course</button>
                 )}
            </div>
            <div className="space-y-4">
                {courses.length === 0 && (
                     <div className="text-gray-400">No courses found.</div>
                )}
                {courses.map((course, index) => (
                    <div key={course.id || index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{course.name}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>{course.description}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            {course.category && (
                                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" style={{ backgroundColor: fxAccentDarkGreen, color: fxAccentGreen }}>{course.category.name}</span>
                            )}
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-yellow-500 hover:text-black" onClick={() => handleEditClick(course)}>Edit</button>
                            <button className="font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-gray-700/50 text-white hover:bg-red-500 hover:text-black" onClick={() => handleDeleteClick(course.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Custom Delete Confirmation Modal */}
            {deleteCourseId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-[#232323] rounded-xl shadow-lg p-8 max-w-sm w-full text-center border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Delete Course?</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={cancelDelete} className="font-mono font-semibold py-2 px-6 rounded-full text-base transition-colors bg-gray-600 hover:bg-gray-700 text-white">Cancel</button>
                            <button onClick={confirmDelete} className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-red-500 text-black border border-red-500 hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorCoursesView;