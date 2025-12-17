# FA25-Team115

Project Summary
LoveDice is a social dating–wager web app where friends propose dates, place playful, non-monetary bets, and generate dares using a virtual heart-pipped dice. The goal of LoveDice is to make dating more fun and social by involving friends as matchmakers and participants, while keeping the experience lighthearted and pressure-free.

Team Members & Roles
Aryan — Backend & API development
Vishwa — Frontend development & UI interactions
Raizel — Frontend development & product design
Aadeesh — Frontend development & testing support

Backend:
    
    1) Make sure you have MongoDB installed and an instance running
    2) Make sure uv package manager is installed and then go to love-dice/backend
    3) make a virtual environment in uv by running `uv venv` in the terminal
    4) run the virtual environment by running this in the terminal `.venv/Scripts/activate`
    5) Then install all dependencies by running `uv pip install "requirements.txt"`
    6) Then run this to start the backend `uvicorn server:app --reload --host 0.0.0.0 --port 8000`
    
Install yarn package manager globally and then run the following commands in the love-dice/frontend directory:
    yarn install

1. Start the development server:
    yarn start


Basic Technical architecture:
    The love-dice application uses a simple three-layer architecture consisting of a React frontend, a FastAPI backend, and a MongoDB database. The frontend handles user interaction and sends HTTP requests to the backend, which processes logic and communicates with the database. Data is exchanged using JSON, and the frontend never accesses the database directly. This clear separation of components makes the system modular, secure, and easy to maintain.



