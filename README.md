# MentorPlus

MentorPlus is a comprehensive full-stack mentoring platform designed to seamlessly connect mentors with students. It facilitates course management, student applications, and features a unique blockchain-based certification system to issue verifiable digital certificates.

## Features

- **Role-Based Dashboards**: Distinct interfaces and functionalities tailored specifically for Mentors and Students.
- **Course Management**: Mentors can create and manage courses, while students can effortlessly browse and enroll.
- **Application Tracking**: Streamlined workflow for handling mentorship and course applications.
- **Blockchain Certificates**: Immutable, verifiable certificates issued directly on the blockchain upon course completion using Ethereum/Solidity smart contracts.
- **Secure Authentication**: Robust user registration, login, password recovery, and profile management.

## Tech Stack

- **Frontend**: React.js, HTML/CSS, JavaScript
- **Backend**: Django (Python), SQLite (default database)
- **Blockchain**: Solidity, Web3 (Python integration via `blockchain.py`)
- **Containerization**: Docker (Frontend Dockerfile included)

## Project Structure

```text
MentorPlus/
├── backend/
│   ├── api/                # Django app for core API logic (models, views, urls, signals)
│   ├── backend/            # Main Django project settings & ASGI/WSGI configs
│   ├── blockchain/         # CertificateLedger.sol and Python Web3 interaction scripts
│   ├── manage.py           # Django command-line utility
│   └── requirements.txt    # Python backend dependencies
└── frontend/
    ├── public/             # Static frontend assets
    ├── src/                # React source code (components, pages, routing, styles)
    │   ├── components/     # UI Components (Certs, Dashboards, Forms)
    │   └── utils/          # Authentication utilities
    ├── package.json        # Node.js dependencies
    └── Dockerfile          # Docker configuration for frontend deployment
