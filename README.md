# Fulkopi Backend

This is the backend for **Fulkopi**, a MERN-stack e-commerce app with secure Google OAuth, custom login, and SSLCommerz payment integration. The backend is built with **Express.js** and **MongoDB**, using **Express-Validator** for reliable API validation and data integrity.

It serves the React + Redux frontend and includes a Dockerfile for container deployment.

## ✨ Features

- RESTful API built with **Express.js**
- **MongoDB** database integration
- User authentication: Google OAuth + custom login
- Payment integration via **SSLCommerz**
- Input validation and sanitization using **Express-Validator**
- Configurable CORS for frontend URLs
- Modular folder structure for routes, controllers, services, utilities, and middleware
- Ready for production deployment with **Docker**

## ⚙️ Environment Variables

Create a `.env` file in the project root with these variables:

```
PORT=8080
URL=                          # Backend URL (production if needed)
JWT_KEY=                      # Secret key for JWT authentication
STORE_ID=                     # SSLCommerz store ID
STORE_PASSWORD=               # SSLCommerz store password
GOOGLE_CLIENT_ID=             # Google OAuth client ID
GOOGLE_CLIENT_SECRET=         # Google OAuth client secret
ORIGIN=https://fulkopi-frontend.vercel.app,http://localhost:5173
```

Replace placeholders with your actual credentials.

## 🚀 Getting Started

1. Clone the repository:

```
git clone https://github.com/mezbaur2004/fulkopiBackend.git
cd fulkopiBackend
```

2. Install dependencies:

```
npm install
```

3. Run the server in development mode (restarts on file changes):

```
npm run dev
```

   Or run it once with `npm start`.

The server will start on the port set in `.env` (default `8080`). Open your frontend or a tool like Postman to test endpoints.

## 📁 Project Structure

```
fulkopiBackend/
├─ src/
│  ├─ controller/     # Handles API logic
│  ├─ middleware/     # Custom middleware (auth, validation, errors)
│  ├─ model/          # MongoDB models
│  ├─ route/          # Express routes
│  ├─ service/        # Business logic or DB access
│  ├─ utility/        # Helper functions
│  └─ validators/     # Request validation logic
├─ DB json test examples/  # Example test data
├─ app.js             # Express app setup
├─ index.js           # Server entry point
├─ Dockerfile         # Docker configuration
├─ package.json
└─ README.md
```

## 🧑‍💻 Author

**Mezbaur Are Rafi** – [GitHub](https://github.com/mezbaur2004)
