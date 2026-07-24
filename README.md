# Project Overview

This project is set up as a monorepo and consists mainly of two parts: the Frontend and the Backend. It is designed to be simple and easy to understand.

## Folder Structure

* `apps/` - Contains the main application code.
  * `backend/` - The backend code (built with Node.js and Express).
  * `frontend/` - The frontend code (built with React and Vite).
* `docs/` - A place to store project documentation and related information.
* `packages/` - A directory for shared packages (currently empty).

## Installed Packages

### Backend
The main packages installed in the backend are:
* **express**: To build the web server.
* **prisma, @prisma/client**: To connect to and manage the database.
* **cors**: To allow cross-origin requests between the website and the server.
* **dotenv**: To load environment variables and secrets.
* **helmet**: To enhance server security.
* **morgan**: To log HTTP requests.
* **compression**: To compress response sizes and improve speed.
* **nodemon**: To automatically restart the server during development when code changes.

### Frontend
The main packages installed in the frontend are:
* **react, react-dom**: To build the website's design and User Interface (UI).
* **vite**: To serve and build the code quickly.
* **oxlint**: To catch and fix small code errors (linting).
