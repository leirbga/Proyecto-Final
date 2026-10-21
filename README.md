# 🚀 WebCraft - E-Commerce & Web Management Platform

WebCraft is a full-stack, secure, and responsive e-commerce web application designed to offer a seamless experience for both clients and developers. The platform features role-based access control (RBAC), JWT authentication via `httpOnly` cookies, dynamic payment interfaces, and a strict API/View architecture hosted on Render.

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js**: Server runtime environment.
- **Express.js**: Web framework for API routes and static view serving.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM).
- **JSON Web Tokens (JWT)**: Secure user session management via `httpOnly` cookies.
- **Bcrypt**: Password hashing and verification.
- **Cookie-Parser**: Middleware to handle HTTP cookies.
- **CORS & Morgan**: Cross-origin request handling and HTTP request logging.

### **Frontend**
- **HTML5 & CSS3**: Structure and styling.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **JavaScript (ES6+)**: DOM manipulation and client-side logic.
- **Axios / Fetch API**: Asynchronous HTTP requests to the backend.

---

## ✨ Key Features

1. **Secure JWT Authentication**:
   - Registration and login system using `bcrypt` password hashing.
   - Session management powered by JWTs stored in secure `httpOnly` cookies (`accessToken`) to prevent XSS attacks.

2. **Role-Based Access Control (RBAC)**:
   - **Client Interface (`/Web-Clientes`)**: Protected environment for authenticated users to view products, manage the shopping cart, and complete orders.
   - **Developer Panel (`/Web-Dev`)**: Restricted portal for users with `dev` permissions to manage system resources.

3. **Dynamic Payment UI**:
   - Interactive checkout supporting both Credit Card and PayPal.
   - Synchronized client-side form validation that dynamically toggles required inputs based on the selected payment method.

4. **Dual Middleware Architecture**:
   - **API Middlewares (`userExtractor`, `isDev`)**: Protects REST endpoints by returning structured JSON responses (`401`, `403`).
   - **View Middlewares (`userExtractorView`, `isDevView`)**: Protects full HTML pages by redirecting unauthenticated or unauthorized users to a custom `/error/` page.

5. **Smooth Internal Navigation**:
   - Anchor links (`#acerca-de`, `#contacto`) with CSS `scroll-behavior: smooth` for fluid single-page scrolling.

---

## 📁 Project Structure

```text
├── components/          # Reusable UI components
├── img/                 # Application static images
├── login/               # Login view assets
├── registro/            # Registration view assets
├── Carrito/             # Shopping cart view assets
├── MisPaginas/          # User project management assets
├── PaginaPrincipal/     # Main landing page & error templates
│   ├── back/            # Models and API controllers
│   │   ├── controllers/ # Express routes (login, users, cart, etc.)
│   │   └── models/      # Mongoose schemas (User, WebPost, etc.)
│   └── error/           # Centralized error view
├── Web-Clientes/        # Protected client dashboard & store
├── Web-Dev/             # Protected developer management panel
├── middleware/          # Authentication & Authorization middlewares
├── app.js               # Main Express application entry point
├── .env                 # Environment variables (git-ignored)
└── package.json         # Dependencies and scripts
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3003
MONGO_URI_TEST=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret_key
NODE_ENV=production
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB database (local or MongoDB Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/webcraft.git
   cd webcraft
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3003`.

---

## ☁️ Deployment Notes (Render)

- **Case-Sensitivity**: The production environment runs on Linux, which enforces strict case-sensitivity for file paths and Express routes (e.g., `/Web-Dev` vs `/Web-dev`). Ensure all route definitions match folder names exactly.
- **Cookies**: Set `sameSite: 'lax'` (or `'strict'`) and `secure: process.env.NODE_ENV === 'production'` for production cookie safety.