# 🧠 AI-Powered Knowledge Base Automation

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

An intelligent, full-stack application designed to streamline the creation and management of Knowledge Base (KB) articles. By seamlessly extracting content from raw files and leveraging the power of Google's Gemini AI, this system eliminates manual data entry and accelerates the documentation pipeline.

## ✨ Key Features

* **🤖 Automated AI Drafting**: Utilizes the Google Gemini API to analyze uploaded documents and instantly generate structured, professional KB drafts.
* **📄 Multi-Format Document Parsing**: Built-in support for extracting text from diverse file types including `PDF`, `.docx`, `.txt`, and `.msg` files.
* **👥 Role-Based Access Control (RBAC)**: Secure routing and dashboard interfaces tailored for different user roles (Editors, Reviewers, and Viewers).
* **⚡ Modern Frontend**: A reactive, fast, and intuitive user interface built with Vue.js and Vite.
* **🗄️ Robust Backend**: A scalable Node.js and Express backend backed by MongoDB for secure data persistence.

## 🛠️ Tech Stack

**Frontend:**
* Vue.js (Vite)
* Vue Router (Frontend Routing)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (ODM)
* JWT (JSON Web Tokens) for Authentication

**AI & Processing:**
* `@google/genai` (Google Gemini API)
* `pdf-parse` (PDF extraction)
* `mammoth` (DOCX extraction)
* `multer` (Multipart/form-data handling)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB (Local instance or Atlas URI)
* Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
