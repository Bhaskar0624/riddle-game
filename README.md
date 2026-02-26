# Smart Picture Riddle Quiz Game

An interactive educational quiz game with beautiful animations, sound effects, and a massive dataset of 200+ questions across 15 categories.

## Features

- 15 themed categories with 200+ unique riddles
- High-quality images from Unsplash (fast loading with preloading)
- 15-second timer per question
- Sound effects and confetti celebrations
- Score tracking system
- Beautiful UI with Tailwind CSS and Motion animations
- Responsive design

## Categories

1. Agriculture (15 items)
2. Animals (15 items)
3. Science (14 items)
4. Mathematics (13 items)
5. Sports (13 items)
6. Food (14 items)
7. Travel (13 items)
8. Music (12 items)
9. Technology (12 items)
10. Nature (13 items)
11. History (12 items)
12. Space (11 items)
13. Art (11 items)
14. Buildings (11 items)
15. Education (11 items)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Recent Improvements

- Expanded database from 50 to 200+ questions
- Added 10 new categories (Animals, Sports, Food, Travel, Music, Technology, Nature, Space, Art, Buildings, Education)
- Switched from LoremFlickr to Unsplash for higher quality, more relevant images
- Implemented image preloading for instant loading
- Optimized performance with eager loading strategy
- Better image-to-riddle matching

## Tech Stack

- React 19 + TypeScript
- Vite for blazing fast dev server
- Tailwind CSS for styling
- Motion (Framer Motion) for animations
- Canvas Confetti for celebrations
- Lucide React for icons
