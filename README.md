# 🌟 Habitly — Build Better Habits, One Day at a Time

**Live Site:** [https://habitly-app.netlify.app](https://habitly-app.netlify.app)

---

## 🧭 Overview

**Habitly** is a modern and interactive habit-tracking web app designed to help users build consistent daily routines and achieve personal growth.  
With an elegant UI, streak tracking, and motivational features, Habitly makes self-improvement both engaging and rewarding.

---

## ✨ Features

- 🔐 **User Authentication** — Secure Firebase authentication (Register, Login, Logout).
- 🌗 **Light & Dark Themes** — Dynamic theme switching with real-time UI sync.
- 🧠 **Smart Habit Tracking** — Track daily progress, maintain streaks, and visualize growth.
- 🌍 **Public Habits** — Browse and get inspired by habits created by others.
- 🧍‍♂️ **Personal Dashboard** — View your habits, daily streak, and profile insights.
- ⚡ **Framer Motion Animations** — Smooth, modern animations across all components.
- 🛠️ **Protected Routes** — Access user-only pages like “Add Habit”, “My Habits” and “Profile” securely.

---

## 🧰 Tech Stack

- ⚛️ **React (Vite)** — Modern, high-performance UI library for building fast SPAs
- 🧩 **React DOM** — Efficient DOM rendering engine for React
- 🧭 **React Router** — Smooth and intuitive client-side navigation
- 💅 **Tailwind CSS** — Utility-first CSS framework for rapid responsive design
- 💫 **Framer Motion** — Powerful animation library for React with smooth transitions
- 🔥 **Firebase Authentication** — Secure user management
- 🧭 **React Router** — Client-side navigation
- 🧮 **SweetAlert2** — Beautiful, customizable alert and confirmation modals
- 🌪️ **AOS (Animate On Scroll)** — Scroll-based animations to enhance user experience
- 🎞️ **Animate.css** — Prebuilt CSS animation library for quick motion effects
- ⚡ **Axios** — Promise-based HTTP client for API requests
- 🌀 **Swiper.js** — Modern, touch-friendly carousel and slider library
- ✨ **Lucide React** — Beautiful, consistent open-source icon set for React
- 🧠 **React Simple Typewriter** — Typing text animation for headings or hero sections
- 🎭 **React Icons** — Large collection of popular icon packs for React

---

## 🧑‍💻 Local Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/saifurrahmanctg/habitly-client.git
   cd habitly-client
   ```

## ⚙️ Install dependencies:

```bash
npm install
```

Create a .env file in the root and add
your Firebase credentials:

```bash
VITE_apiKey=your_api_key
VITE_authDomain=your_auth_domain
VITE_projectId=your_project_id
```

Start the development server:

```bash
npm run dev
```

## 📂 Folder Structure

src/
│
├── assets/
│ ├── logo-dark.png
│ └── logo-light.png
│
├── Components/
│ ├── FeaturedHabit.jsx
│ ├── Footer.jsx
│ ├── HabitCard.jsx
│ ├── Loader.jsx
│ ├── Navbar.jsx
│ ├── Slider.jsx
│ ├── TopContributors.jsx
│ └── WhyBuildHabits.jsx
│
├── firebase/
│ └── firebase.config.js
│
├── Layouts/
│ └── MainLayout.jsx
│
├── Pages/
│ ├── AddHabit.jsx
│ ├── AllHabit.jsx
│ ├── Error404.jsx
│ ├── HabitCard.jsx
│ ├── Home.jsx
│ ├── MyHabit.jsx
│ └── Profile.jsx
│
├── Provider/
│ └── AuthProvider.jsx
│
├── Routes/
│ ├── PrivateRoute.jsx
│ └── Router.jsx
│
├── UsersPage/
│ ├── Login.jsx
│ └── Register.jsx
│
├── utils/
│ ├── useCalculateStreak.js
│ └── useTheme.jsx
│
├── index.css
├── main.jsx
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js

---

Built with ❤️ by [Your Name]
© 2025 Habitly — All Rights Reserved.
