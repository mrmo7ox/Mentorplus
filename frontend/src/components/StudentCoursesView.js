import React, { useState, useEffect } from "react";
import {me} from '../utils/authutils'
const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';


const StudentCoursesView = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // Add Course Form State
    const [categories, setCategories] = useState([]);
    const [addCourseForm, setAddCourseForm] = useState({ name: "", category: "" });
    const [addCourseError, setAddCourseError] = useState("");
    const [addCourseSuccess, setAddCourseSuccess] = useState("");

    useEffect(() => {
        const fetchCourses = () => {
            const enrolledData = [
                { title: 'Introduction au Trading Algorithmique', desc: 'Apprenez les fondamentaux de la création et du backtesting de stratégies de trading automatisées.', duration: '8 Semaines' },
                { title: 'Analyse Quantitative Avancée', desc: 'Plongez au cœur de l\'arbitrage statistique, des modèles de machine learning et du trading haute fréquence.', duration: '12 Semaines' },
            ];
            const availableData = [
                { title: 'Dynamique du Marché Forex', desc: 'Maîtrisez les subtilités du marché des changes avec des informations professionnelles.', duration: '10 Semaines' },
                { title: 'Stratégies Crypto & DeFi', desc: 'Explorez le monde de la finance décentralisée et construisez des bots de trading pour les actifs crypto.', duration: '12 Semaines' },
            ];
            setTimeout(() => {
                setEnrolledCourses(enrolledData);
                setAvailableCourses(availableData);
                setIsLoading(false);
            }, 1000);
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userObj = await me();
                setUser(userObj);
            } catch (e) {
                setUser(null);
            } finally {
                setUserLoading(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await fetch("http://localhost:8000/api/categories/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Could not fetch categories");
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setCategories([]);
            }
        };
        if (user) {
            fetchCategories();
        }
    }, [user]);

    const handleAddCourseChange = (e) => {
        const { name, value } = e.target;
        setAddCourseForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCourseSubmit = async (e) => {
        e.preventDefault();
        setAddCourseError("");
        setAddCourseSuccess("");
        if (!addCourseForm.name || !addCourseForm.category) {
            setAddCourseError("Name and category are required.");
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
                    category: addCourseForm.category,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setAddCourseError(data.error || "Error adding course.");
            } else {
                setAddCourseSuccess("Course added successfully!");
                setAddCourseForm({ name: "", category: "" });
            }
        } catch (err) {
            setAddCourseError("Network error.");
        }
    };

    if (isLoading || userLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-12">
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
                        <select
                            className="w-full p-2 rounded "
                            name="category"
                            value={addCourseForm.category}
                            onChange={handleAddCourseChange}
                        >
                            <option className="bg-[#242424] " value="">Select Category</option>
                            {categories.map(cat => (
                                <option className="bg-[#242424] focus:bg-[#242424]  hover:bg-[#242424] " key={cat.id} value={cat.id}>{cat.name}</option>
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

            <div>
                <h2 className="text-3xl font-bold mb-8">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {enrolledCourses.map((course, index) => (
                        <div key={index} className="flex flex-col text-left rounded-xl p-6 border transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                            <div className="flex-grow">
                                <div className="flex justify-end items-center mb-4">
                                    <span className="text-xs" style={{ color: fxMutedText }}>{course.duration}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-white">{course.title}</h3>
                                <p className="text-sm" style={{ color: fxMutedText }}>{course.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-8">Available Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {availableCourses.map((course, index) => (
                        <div key={index} className="flex flex-col text-left rounded-xl p-6 border transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                            <div className="flex-grow">
                                <div className="flex justify-end items-center mb-4">
                                    <span className="text-xs" style={{ color: fxMutedText }}>{course.duration}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-white">{course.title}</h3>
                                <p className="text-sm" style={{ color: fxMutedText }}>{course.desc}</p>
                            </div>
                            <button className="w-full mt-6 font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-green-500 text-black hover:bg-green-600">
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentCoursesView;