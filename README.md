# Leaf Disease Detection Application 🌿🔬

An AI-powered application designed to help users identify plant species and detect leaf diseases through image analysis. This project features a full-stack architecture with a robust backend, a responsive web interface, and a cross-platform mobile app.

## 🚀 Key Features

- **AI Disease Detection**: Leverages advanced models (including Gemini AI integration) to identify plants and diagnose potential diseases from leaf images.
- **Mobile App**: A user-friendly React Native (Expo) app for scanning leaves on the go.
- **Web Dashboard**: A React-based web interface for managing scans, viewing history, and detailed analysis.
- **Backend API**: A high-performance FastAPI server managing data, authentication, and AI model interactions.
- **Secure Authentication**: Built-in user sign-in and account management system.
- **Scan History**: Keep track of previous assessments and monitor plant health over time.

## 🛠️ Technology Stack

- **Web Frontend**: React, Vite, Axios, TailwindCSS (for modern UI).
- **Mobile Frontend**: React Native, Expo.
- **Backend**: Python, FastAPI, SQLAlchemy.
- **Database**: SQLite (local development), SQL scripts provided for initialization.
- **AI/ML**: Google Gemini AI API integration for intelligent plant recognition.

## 📁 Repository Structure

- `backend/`: FastAPI server source code and database migrations.
- `frontend/`: React + Vite web application.
- `mobile-frontend/`: Expo React Native mobile application.
- `leafdiseasedetection.sql`: Database schema initialization script.

## 🔧 Getting Started

### 1. Backend Setup
- Navigate to `/backend`
- Create a virtual environment: `python -m venv venv`
- Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
- Install dependencies: `pip install -r requirements.txt`
- Run the server: `python -m app.main`

### 2. Web Frontend Setup
- Navigate to `/frontend`
- Install dependencies: `npm install`
- Start development server: `npm run dev`

### 3. Mobile Frontend Setup
- Navigate to `/mobile-frontend/LeafApp-Frontend-main`
- Install dependencies: `npm install`
- Start Expo: `npx expo start`
