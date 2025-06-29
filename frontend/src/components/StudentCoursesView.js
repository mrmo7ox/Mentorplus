import React, { useState, useEffect } from "react";
import { me } from '../utils/authutils';

const fxSecondaryBg = '#1A1A1A';
const fxMutedText = '#DFDFDC';

const StudentCoursesView = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [subscribing, setSubscribing] = useState({}); // Track which course is being subscribed to

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("access");

                const enrolledResponse = await fetch("http://localhost:8000/api/studient/courses", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const enrolledData = enrolledResponse.ok ? await enrolledResponse.json() : [];

                const availableResponse = await fetch("http://localhost:8000/api/getcourses", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const availableData = availableResponse.ok ? await availableResponse.json() : [];

                setEnrolledCourses(enrolledData);
                setAvailableCourses(availableData);
            } catch (err) {
                setEnrolledCourses([]);
                setAvailableCourses([]);
            }
            setIsLoading(false);
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

    const subscribe = async (courseId) => {
        setSubscribing(prev => ({ ...prev, [courseId]: true }));
        try {
            const token = localStorage.getItem("access");
            await fetch("http://localhost:8000/api/studient/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ course_id: courseId }),
            });
        } catch (err) {
            console.log(err)
        }
        setSubscribing(prev => ({ ...prev, [courseId]: false }));
    };

    if (isLoading || userLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold mb-8">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {enrolledCourses.map((course, index) => (
                        <div key={index} className="flex flex-col text-left rounded-xl p-6 border transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10" style={{ backgroundColor: fxSecondaryBg, borderColor: '#2d2d2d' }}>
                            <div className="flex-grow">
                                <div className="flex justify-end items-center mb-4">
                                    <span className="text-xs" style={{ color: fxMutedText }}>{course.duration}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-white">{course.name || course.title}</h3>
                                <p className="text-sm" style={{ color: fxMutedText }}>{course.description || course.desc}</p>
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
                                <h3 className="font-bold text-xl mb-2 text-white">{course.name || course.title}</h3>
                                <p className="text-sm" style={{ color: fxMutedText }}>{course.description || course.desc}</p>
                            </div>
                            <button
                                onClick={() => subscribe(course.id)}
                                disabled={!!subscribing[course.id]}
                                className={`w-full mt-6 font-mono text-sm font-semibold py-2 px-4 rounded-full transition-colors bg-green-500 text-black hover:bg-green-600 ${subscribing[course.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {subscribing[course.id] ? "Applying..." : "Apply Now"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentCoursesView;