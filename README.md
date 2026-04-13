# UrbanEats - Food Delivery Website

A full-stack food delivery web application built with React and Express.

## Features

- **Browse Menu** - 32 products across 8 categories (Pizza, Pasta, Asian, Mexican, Burgers, Wraps, Vegan, Mediterranean)
- **Category Slider** - Responsive pagination: all products on desktop, 2 per page on tablet, 1 on mobile with dot navigation
- **Shopping Cart** - Add, update quantity, and remove items with real-time cart badge
- **Checkout Flow** - Cart summary -> Payment -> Order confirmation
- **Authentication** - Register, login, and JWT-based session management
- **User Profile** - View account info and last 10 orders
- **GitHub Pages Mode** - Works without backend using seed data and localStorage

## Tech Stack

**Frontend:** React 19, Vite, React Router, Context API  
**Backend:** Node.js, Express 5, SQLite3, JWT, Bcrypt  
**CI/CD:** GitHub Actions (PR testing + GitHub Pages deployment)

## Getting Started

### Prerequisites

- Node.js 18+

### Run locally

```bash
# Backend
cd backend
echo "JWT_SECRET=your-secret-key" > .env
npm install
node server.js
# Runs on http://localhost:3001

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Run in mock mode (no backend needed)

```bash
cd frontend
VITE_USE_MOCK=true npm run dev
```

## Project Structure

```
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── context/       # React Context (Auth, Cart)
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API client layer (with mock support)
│   │   ├── data/          # Seed data for GitHub Pages mode
│   │   ├── config/        # API configuration
│   │   ├── styles/        # Component CSS
│   │   └── images/        # Static assets
│   └── package.json
├── backend/               # Node.js + Express API
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── repositories/      # Database queries
│   ├── routes/            # API endpoints
│   ├── middleware/         # JWT auth middleware
│   ├── db/                # SQLite database + schemas
│   ├── __tests__/         # Jest tests
│   └── package.json
└── .github/workflows/     # CI/CD pipelines
    ├── ci.yml             # PR testing (lint + build + tests)
    └── deploy.yml         # GitHub Pages deployment
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /products | No | Get all products |
| POST | /auth/register | No | Create account |
| POST | /auth/login | No | Login, returns JWT |
| GET | /auth/me | Yes | Get user profile |
| GET | /cart | Yes | Get cart items |
| POST | /cart | Yes | Add item to cart |
| PUT | /cart | Yes | Update item quantity |
| DELETE | /cart | Yes | Remove item from cart |
| GET | /orders | Yes | Get user orders |
| POST | /orders | Yes | Checkout (cart to order) |

## CI/CD

- **Pull Requests** - Runs lint, build, and backend tests automatically
- **Push to main** - Builds frontend in mock mode and deploys to GitHub Pages

## License

This project is open-source and licensed under the MIT License.