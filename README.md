# Queens Masala - Fullstack E-commerce

This repository contains the initial scaffold for Queens Masala fullstack application.

Folders:
- backend/ - Express API, Mongoose models, seed script
- frontend/ - React + Vite + Tailwind frontend scaffold

Run the backend seed script after setting MONGODB_URI in .env or using local MongoDB:

cd backend
npm install
npm run seed
npm run dev

cd frontend
npm install
npm run dev

Environment variables should be placed in backend/.env (see .env.example)
