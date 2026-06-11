# Prime Net — Digital Subscription Marketplace

A full-stack marketplace for buying and selling digital subscriptions including OTT platforms, AI tools, VPN services, educational platforms, software licenses, cloud storage plans, and premium memberships.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, Zustand, TanStack Query |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | Firebase (Email, Google, Phone OTP) |
| Payments | Razorpay, Stripe |
| Notifications | Firebase Cloud Messaging |

## Project Structure

```
Prime-net/
├── frontend/    # React + Vite app
├── backend/     # Express + TypeScript API
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Firebase project
- Razorpay account
- Stripe account

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your environment variables
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Fill in your environment variables
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

## License

MIT
