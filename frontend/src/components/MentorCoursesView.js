import React, { useState, useEffect } from "react";


const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const MentorCoursesView = ({ user }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [addCourseForm, setAddCourseForm] = useState({ name: "", description: "", category: "" });
    const [addCourseError, setAddCourseError] = useState("");
    const [addCourseSuccess, setAddCourseSuccess] = useState("");

    // Fetch courses created by this mentor
    useEffect(() => {
        async function fetchCourses() {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/my-courses/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();
                // Assumes backend returns: [{ id, name, description, category: {id, name}, ... }]
                setCourses(data);
            } catch (err) {
                setCourses([]);
            }
            setIsLoading(false);
        }
        fetchCourses();
    }, []);

    // Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/categories/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setCategories([]);
            }
        }
        fetchCategories();
    }, []);

    const handleAddCourseChange = (e) => {
        setAddCourseForm({ ...addCourseForm, [e.target.name]: e.target.value });
    };

    const handleAddCourseSubmit = async (e) => {
        e.preventDefault();
        setAddCourseError("");
        setAddCourseSuccess("");
        if (!addCourseForm.name || !addCourseForm.description || !addCourseForm.category) {
            setAddCourseError("Name, description, and category are required.");
            return;
        }
        try {
            const token = localStorage.getItem("access");
            const response = await fetch("http://localhost:8000/api/add-course/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: addCourseForm.name,
                    description: addCourseForm.description,
                    category: addCourseForm.category,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setAddCourseError(data.error || "Error adding course.");
            } else {
                setAddCourseSuccess("Course added successfully!");
                setCourses(prev => [...prev, data]);
                setAddCourseForm({ name: "", description: "", category: "" });
            }
        } catch (err) {
            setAddCourseError("Network error.");
        }
    };

    if (isLoading) return <div>Loading courses...</div>;

    return (
        <div>
            {user?.grp === 2 && (
                <div className="mb-10 p-6 rounded-xl border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                    <h2 className="text-2xl font-bold mb-4 text-white">Add a Course</h2>
                    <form className="space-y-4" onSubmit={handleAddCourseSubmit}>
                        <input
                            className="w-full p-2 rounded"
                            placeholder="Course Title"
                            name="name"
                            value={addCourseForm.name}
                            onChange={handleAddCourseChange}
                        />
                        <input
                            className="w-full p-2 rounded"
                            placeholder="Description ..."
                            name="description"
                            value={addCourseForm.description}
                            onChange={handleAddCourseChange}
                        />
                        <select
                            className="w-full p-2 rounded"
                            name="category"
                            value={addCourseForm.category}
                            onChange={handleAddCourseChange}
                        >
                            <option className="bg-[#242424]" value="">Select Category</option>
                            {categories.map(cat => (
                                <option className="bg-[#242424]" key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {addCourseError && <div className="text-red-500">{addCourseError}</div>}
                        {addCourseSuccess && <div className="text-green-500">{addCourseSuccess}</div>}
                        <button type="submit" className="bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-600 font-semibold">
                            Add Course
                        </button>
                    </form>
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Courses</h2>
            </div>
            <div className="space-y-4">
                {courses.length === 0 && (
                    <div className="text-gray-400">No courses found.</div>
                )}
                {courses.map((course, index) => (
                    <div key={course.id || index} className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-6 border" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                        <div>
                            <h3 className="font-bold text-xl text-white">{course.name || course.title}</h3>
                            <p className="text-sm" style={{ color: fxMutedText }}>{course.description}</p>
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