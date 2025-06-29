import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import { isTokenValid, logoutAndRedirect, user_role} from './utils/authutils.js';
import StudentCoursesView from './components/StudentCoursesView';
import StudentApplicationsView from './components/StudentApplicationsView';
import StudentCertificationsView from './components/StudentCertificationsView';
import MentorCoursesView from './components/MentorCoursesView';
import MentorStudentsView from './components/MentorStudentsView';
import MentorApplicationsView from './components/MentorApplicationsView';
import ProfileView from './components/ProfileView';
import Header from './components/Header';

import {
  ProfileIcon,
  CoursesIcon,
  ApplicationsIcon,
  CertificateIcon,
  StudentsIcon,
  LogoutIcon,
  DoubleChevronLeftIcon
} from './components/icons';

const fxDarkBg = '#0F0F0D';
const fxSecondaryBgTransparent = 'rgba(26, 26, 26, 0.8)';
const fxAccentGreen = '#5DD62C';
const fxLightText = '#F3F3F3';

const UserIcon = ProfileIcon;

const userroole = await user_role() ;
const Dashboard = ({ userRole = userroole}) => {
    const [activeTab, setActiveTab] = useState('My Courses');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        isTokenValid().then(valid => {
            if (!valid) navigate('/login');
        });
    }, [navigate]);

    const studentTabs = [
        { name: 'Courses', icon: CoursesIcon },
        { name: 'My Applications', icon: ApplicationsIcon },
        { name: 'Certifications', icon: CertificateIcon },
        { name: 'Profile', icon: ProfileIcon },
    ];

    const mentorTabs = [
        { name: 'My Courses', icon: CoursesIcon },
        { name: 'My Students', icon: StudentsIcon },
        { name: 'Applications', icon: ApplicationsIcon },
        { name: 'Profile', icon: ProfileIcon },
    ];

    const tabs = userRole === 1 ? studentTabs : mentorTabs;
    useEffect(() => {
        if (!tabs.find(t => t.name === activeTab)) {
            setActiveTab(tabs[0].name);
        }
    }, [userRole, tabs, activeTab]);

    const renderContent = () => {
        if (userRole === 1) {
            switch (activeTab) {
                case 'Courses': return <StudentCoursesView />;
                case 'My Applications': return <StudentApplicationsView />;
                case 'Certifications': return <StudentCertificationsView />;
                case 'Profile': return <ProfileView />;
                default: return <StudentCoursesView />;
            }
        } else { 
            switch (activeTab) {
                case 'My Courses': return <MentorCoursesView />;
                case 'My Students': return <MentorStudentsView />;
                case 'Applications': return <MentorApplicationsView />;
                case 'Profile': return <ProfileView />;
                default: return <MentorCoursesView />;
            }
        }
    };

    return (
        <div className="min-h-screen font-sans antialiased relative" style={{ backgroundColor: fxDarkBg, color: fxLightText }}>
            <ParticleBackground />
            <div className="relative flex flex-col min-h-screen">
                <Header pageTitle="Dashboard" userRole="studient" />
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Navigation */}
                    <aside className={`flex flex-col flex-shrink-0 p-4 transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'}`} style={{ backgroundColor: fxSecondaryBgTransparent, backdropFilter: 'blur(10px)' }}>
                        <div className="flex-grow">
                            <nav className="flex flex-col space-y-4">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab(tab.name)}
                                        className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${!isSidebarExpanded && 'justify-center'} ${activeTab === tab.name ? 'bg-green-500 text-black' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
                                    >
                                        <tab.icon className="text-2xl flex-shrink-0" />
                                        <span className={`font-semibold whitespace-nowrap ${isSidebarExpanded ? 'inline' : 'hidden'}`}>{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="w-full">
                            <button
                                onClick={() => logoutAndRedirect(navigate)}
                                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-700/50 hover:text-white ${!isSidebarExpanded && 'justify-center'}`}
                            >
                                <LogoutIcon className="text-2xl flex-shrink-0" />
                                <span className={`font-semibold whitespace-nowrap ${isSidebarExpanded ? 'inline' : 'hidden'}`}>Logout</span>
                            </button>
                            <div className="border-t border-gray-700 my-2"></div>
                            <button
                                onClick={() => setIsSidebarExpanded(prev => !prev)}
                                className={`w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}
                            >
                                <DoubleChevronLeftIcon className={`w-6 h-6 transition-transform duration-300 ${!isSidebarExpanded && 'rotate-180'}`} />
                            </button>
                        </div>
                    </aside>
                    {/* Main Content */}
                    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;