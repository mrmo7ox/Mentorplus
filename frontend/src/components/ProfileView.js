import React, { useState, useEffect } from "react";
import { me } from "../utils/authutils";
import { MailIcon, KeyIcon, EyeSlashFilledIcon, EyeFilledIcon } from "./icons";

async function updateProfileApi(updatedData) {
    const token = localStorage.getItem("access");
    const response = await fetch("http://127.0.0.1:8000/api/me/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return await response.json();
}

async function updatepasswordApi(new_pass) {
    const token = localStorage.getItem("access");
    const response = await fetch("http://127.0.0.1:8000/api/password/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(new_pass)
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return await response.json();
}

const InfoField = ({ name, label, value, icon, type = "text", isEditing, onChange }) => {
    const Icon = icon;
    return (
        <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-sm z-10" style={{ backgroundColor: "#1A1A1A" }}>{label}</label>
            <div className="relative flex items-center bg-transparent border rounded-xl px-4 py-3" style={{ borderColor: "#4B5563" }}>
                <Icon className="text-2xl flex-shrink-0" style={{ color: "#DFDFDC" }} />
                <input
                    name={name}
                    type={type}
                    value={value}
                    readOnly={!isEditing}
                    onChange={isEditing ? onChange : undefined}
                    className={`w-full bg-transparent outline-none ml-3 text-lg ${isEditing ? "text-white" : "text-gray-400"}`}
                />
            </div>
        </div>
    );
};

const ProfileView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const fetchUser = async () => {
        setIsLoading(true);
        const data = await me();
        if (data) {
            setUserData({
                firstName: data.first || "",
                lastName: data.last || "",
                email: data.email || ""
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        try {
            await updateProfileApi({
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email
            });
            setIsEditing(false);
            await fetchUser();
        } catch (err) {
            setSaveError("Error updating profile. Please try again.");
        }
        setIsSaving(false);
    };

    if (isLoading) return <div>Loading profile...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Profile Settings</h2>
            <div className="p-8 space-y-8 rounded-xl" style={{ backgroundColor: "rgba(26,26,26,0.8)", backdropFilter: "blur(5px)" }}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl" style={{ backgroundColor: "#1A1A1A" }}>
                            <span role="img" aria-label="user">👤</span>
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold">{userData.firstName} {userData.lastName}</h2>
                        <p style={{ color: "#DFDFDC" }}>{userData.email}</p>
                    </div>
                </div>
                <form onSubmit={handleSave}>
                    <div className="border-t border-gray-700 my-6"></div>
                    <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoField
                            name="firstName"
                            label="First Name"
                            value={userData.firstName}
                            icon={() => <span>👤</span>}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                        <InfoField
                            name="lastName"
                            label="Last Name"
                            value={userData.lastName}
                            icon={() => <span>👤</span>}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                        <InfoField
                            name="email"
                            label="Email"
                            value={userData.email}
                            icon={MailIcon}
                            type="email"
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                    </div>
                    {saveError && <div className="text-red-500 mt-4">{saveError}</div>}
                    <div className="mt-6 flex justify-end gap-4">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="font-mono font-semibold py-2 px-6 rounded-full text-base transition-colors bg-gray-600 hover:bg-gray-700"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 flex items-center justify-center"
                                >
                                    {isSaving ? '...' : 'Save'}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
                {/* Password Section (unchanged) */}
                <div>
                    <div className="border-t border-gray-700 my-6"></div>
                    <h3 className="text-xl font-semibold mb-6">Change Password</h3>
                    <div className="space-y-6">
                        <div className="relative">
                            <label className="absolute -top-3 left-3 px-1 text-sm z-10" style={{ backgroundColor: "#1A1A1A" }}>Current Password</label>
                            <div className="relative flex items-center bg-transparent border rounded-xl px-4 py-3" style={{ borderColor: "#4B5563" }}>
                                <KeyIcon className="text-2xl" style={{ color: "#DFDFDC" }} />
                                <input type={isPasswordVisible ? 'text' : 'password'} className="w-full bg-transparent outline-none ml-3 text-lg" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="absolute -top-3 left-3 px-1 text-sm z-10" style={{ backgroundColor: "#1A1A1A" }}>New Password</label>
                            <div className="relative flex items-center bg-transparent border rounded-xl px-4 py-3" style={{ borderColor: "#4B5563" }}>
                                <KeyIcon className="text-2xl" style={{ color: "#DFDFDC" }} />
                                <input type={isPasswordVisible ? 'text' : 'password'} className="w-full bg-transparent outline-none ml-3 text-lg" />
                                <button type="button" className="focus:outline-none ml-2" onClick={() => setIsPasswordVisible(p => !p)}>
                                    {isPasswordVisible ? <EyeSlashFilledIcon className="text-2xl" style={{ color: "#DFDFDC" }} /> : <EyeFilledIcon className="text-2xl" style={{ color: "#DFDFDC" }} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={updatepasswordApi} className="font-mono font-bold py-2 px-6 rounded-full text-base shadow-md transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600">Update Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;