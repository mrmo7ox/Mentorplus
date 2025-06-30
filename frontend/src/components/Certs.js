import React, { useEffect, useRef, forwardRef } from 'react';
import ParticleBackground from "./ParticleBackground";
import { useLocation, useNavigate } from 'react-router-dom';

// === Fxology Color Palette ===
const fxDarkBg = '#0F0F0D';
const fxSecondaryBg = '#1A1A1A';
const fxAccentGreen = '#5DD62C';
const fxLightText = '#F3F3F3';
const fxMutedText = '#DFDFDC';
const fxGold = '#FFD700';

// In a real React project, you would typically add these fonts to your index.html or via a CSS import.
const loadGoogleFonts = () => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,700;1,400&family=Dancing+Script:wght@700&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

// === Helper Icons & Components ===
const FxologyLogo = ({ className }) => (
    <svg className={className} width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22H22L12 2ZM12 5.2L18.8 19H5.2L12 5.2ZM12 10.4L15.6 17H8.4L12 10.4Z" fill={fxAccentGreen}/>
    </svg>
);

const CertificateSeal = () => (
    <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill={fxSecondaryBg} stroke={fxGold} strokeWidth="2"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke={fxAccentGreen} strokeWidth="1" strokeDasharray="4 4"/>
        <path d="M42 25 L32 75 H52 L42 25ZM42 28.2 L49.8 72 H35.2 L42 28.2ZM42 33.4 L46.6 69 H38.4 L42 33.4Z" fill={fxAccentGreen}/>
        <text x="50" y="55" fontFamily="monospace" fontSize="10" fill={fxMutedText} textAnchor="middle">MentorPlus</text>
        <text x="50" y="68" fontFamily="monospace" fontSize="8" fill={fxGold} textAnchor="middle">ACADEMY</text>
    </svg>
);


const Certificate = forwardRef(({ studentName, courseName, mentorName, certificateId, issuedAt }, ref) => {
    const certificateStyle = {
        fontFamily: "'Inter', sans-serif",
    };
    const fancyFont = {
        fontFamily: "'Playfair Display', serif",
    };
    const signatureFont = {
        fontFamily: "'Dancing Script', cursive",
    };

    return (
        <div ref={ref} style={certificateStyle} className="w-full max-w-4xl p-8 md:p-12 rounded-lg shadow-2xl border-2 relative bg-[#1A1A1A] border-[#5DD62C]">
            {/* Decorative Corner Borders */}
            <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-[#FFD700]"></div>
            <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-[#FFD700]"></div>
            <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-[#FFD700]"></div>
            <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-[#FFD700]"></div>

            {/* Header */}
            <div className="text-center mb-8 border-b-2 pb-6 border-[#337418]">
                <div className="flex justify-center items-center gap-4">
                    <FxologyLogo />
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider text-[#F3F3F3]" style={fancyFont}>MentorPlus Academy</h1>
                </div>
                <p className="text-2xl md:text-3xl font-light mt-4 tracking-widest text-[#5DD62C]">CERTIFICATE OF COMPLETION</p>
            </div>

            {/* Main Content */}
            <div className="text-center my-10">
                <p className="text-lg mb-2 text-[#DFDFDC]">This certificate is proudly presented to</p>
                <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700]" style={fancyFont}>{studentName}</h2>
                <p className="text-lg mt-4 max-w-2xl mx-auto text-[#DFDFDC]">
                    for successfully completing the course
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold mt-2 text-[#5DD62C]">{courseName}</h3>
            </div>

            {/* Footer with Signatures */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t-2 border-[#337418]">
                <div className="text-center">
                    <p className="text-2xl text-[#F3F3F3]" style={signatureFont}>{mentorName}</p>
                    <div className="border-t-2 w-48 mt-2 border-[#DFDFDC]"></div>
                    <p className="text-sm mt-1 text-[#DFDFDC]">Lead Mentor</p>
                </div>
                <div className="my-8 md:my-0">
                   <CertificateSeal />
                </div>

            </div>
             <p className="text-center text-xs mt-8 font-mono text-[#DFDFDC]">Certificate ID: {certificateId} | Issued on: {issuedAt}</p>
        </div>
    );
});

const CertificatePage = () => {
    const certificateRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const cert = location.state?.cert;

    useEffect(() => {
        loadGoogleFonts();
        const scripts = [
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        ];
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
        });
        // Redirect if no cert data
        if (!cert) {
            navigate('/certifications');
        }
    }, [cert, navigate]);

    if (!cert) {
        return <div className="text-white">No certificate data found. Redirecting...</div>;
    }

    const handleDownloadPdf = async () => {
        if (!window.jspdf || !window.html2canvas) {
            alert("PDF generation libraries are still loading. Please try again in a moment.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const element = certificateRef.current;
        const canvas = await window.html2canvas(element, {
            backgroundColor: fxSecondaryBg,
            scale: 2, // Higher scale for better quality
        });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(data, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('mentorplus-certificate.pdf');
    };

    return (
         <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{backgroundColor: fxDarkBg}}>
            <ParticleBackground />
            <div className="relative z-10 w-full max-w-4xl">
                <Certificate 
                    ref={certificateRef}
                    studentName={cert.student_name}
                    courseName={cert.course_name}
                    mentorName={cert.mentor_name}
                    certificateId={cert.certificate_id}
                    issuedAt={cert.issued_at}
                />
                <div className="text-center mt-8">
                    <button 
                        onClick={handleDownloadPdf}
                        className="font-mono font-bold py-3 px-8 rounded-full text-lg shadow-xl transition-all duration-300 bg-green-500 text-black border border-green-500 hover:bg-green-600 hover:scale-105 active:scale-95"
                    >
                        Download as PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;
