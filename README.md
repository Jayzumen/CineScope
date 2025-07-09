# CineScope

CineScope is a sleek movie database web application that lets you discover, search, and explore movies, TV series, and actors using real-time data from the [TMDB API](https://www.themoviedb.org/documentation/api). Users can browse trending content, view detailed information, watch trailers, and manage their favorites—all with seamless authentication.

## Features

- 🔍 **Search** for movies, TV series, and actors
- 🎬 **Trending** and daily highlights for movies and shows
- 📝 **Detailed pages** for each movie, show, and actor
- ❤️ **Like/Favorite** movies and shows (user-specific)
- ▶️ **Watch trailers** directly in the app
- 👤 **User authentication** with Google and GitHub
- ⚡ **Responsive** and modern UI

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, SSR/SSG)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, custom Google Fonts
- **UI Components:** Radix UI, Lucide Icons, React Icons, ShadCN
- **State & Auth:** Firebase (Firestore, Auth)
- **Auth Providers:** Google, GitHub
- **API:** TMDB API
- **Notifications:** React Toastify, Sonner
- **Video:** React Player

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cinescope.git
   cd cinescope
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Firebase and TMDB API credentials.

4. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

- `src/app/` – Main application pages and routes
- `src/components/` – Reusable UI components
- `src/lib/` – API and data fetching utilities
- `src/types/` – TypeScript type definitions
- `src/utils/` – Firebase and provider setup

## Credits

- Data provided by [TMDB API](https://www.themoviedb.org/documentation/api)
- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN](https://ui.shadcn.com/) and [Firebase](https://firebase.google.com/)
