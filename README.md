# Am I the Liar?

A multiplayer social deduction party game web app built with React and Supabase. Players join rooms, receive secret words from various categories, and try to identify who among them is the "liar" with a different word or no word at all.

## Live Demo
🌐 **[Play Now: amitheliar.vercel.app](https://amitheliar.vercel.app/)**

## Game Overview

"Am I the Liar?" is a party game where players receive related words from a chosen category. One player (the liar) receives either a different word or the word "LIAR!" depending on game settings. Through discussion and questioning, players must figure out who the liar is while the liar tries to blend in.

## Features

### 🎮 **Core Gameplay**
- **Real-time Multiplayer**: Join rooms with up to 12+ players using 6-digit room codes
- **11 Word Categories**: Choose from Food, Fast Food, Fruits, Cities, Animals, Sports, Celebrities, Soccer Players, NBA Players, Mythical Creatures, and Animation Characters
- **300+ Word Combinations**: Balanced pairs ensure fair gameplay with each word appearing as both majority and minority
- **Smart Liar Selection**: True randomization using Fisher-Yates shuffle algorithm
- **Flexible Liar Settings**: Choose number of liars (1-3) and whether they get "LIAR!" or category words

### 📱 **User Experience**
- **QR Code Integration**: Generate QR codes for easy room joining via mobile devices
- **Custom Branding**: Features custom "Yappie" mascot images throughout the interface
- **Responsive Design**: Optimized for both desktop and mobile play
- **Word Feedback System**: Players can rate word combinations with thumbs up/down
- **Game Tips**: Contextual tips and strategies displayed during gameplay
- **URL Deep Linking**: Direct room access via shareable URLs

### 🔧 **Technical Features**
- **Real-time Sync**: Supabase integration for live player updates and game state
- **Connection Resilience**: Automatic reconnection and state sync when players return
- **Host Migration**: Robust game management with host controls
- **Background Monitoring**: Maintains game state during app backgrounding
- **Clean Exit Handling**: Graceful cleanup when players leave

## Tech Stack

- **Frontend**: React 18.2.0 with Create React App
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Styling**: Tailwind CSS with custom utility classes
- **Icons**: Custom SVG icons with hover states
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Project Structure

```
src/
├── App.js                     # Main app container with game state management
├── index.js                   # React entrypoint
├── components/                # Reusable UI components
│   ├── NicknameModal.jsx      # Room creation/joining modal
│   ├── RulesModal.jsx         # Game rules display
│   ├── QRcode.jsx             # QR code generator for room sharing
│   ├── PlayersList.jsx        # Real-time player list display
│   ├── WordRevealer.jsx       # Secret word reveal component
│   ├── LiarWordToggle.jsx     # Liar word mode toggle
│   ├── NumOfLiarControl.jsx   # Number of liars selector
│   ├── Tips.jsx               # Contextual game tips
│   └── [button, input, modal, icons].jsx  # Base UI components
├── pages/                     # Main game screens
│   ├── HomePage.jsx           # Landing page with game options
│   ├── LobbyPage.jsx          # Pre-game lobby with player management
│   ├── CategoryPage.jsx       # Category selection screen
│   └── GamePage.jsx           # Main gameplay interface
├── data/
│   ├── categories.js          # 300+ word combinations across 11 categories
│   └── tips.js                # Game strategy tips
├── utils/
│   ├── gameService.js         # Supabase integration & game logic
│   ├── helper.js              # Utility functions (clipboard, etc.)
│   └── supabase.js            # Supabase client configuration
└── hooks/
    └── useSwipe.js            # Mobile swipe gesture support
```

## How to Play

1. **Create or Join**: Host creates a room and shares the 6-digit code or QR code
2. **Choose Category**: Host selects from 11 available word categories  
3. **Configure Game**: Set number of liars (1-3) and liar word mode
4. **Receive Words**: Players get secret words - most receive the same word, liar(s) get different ones
5. **Discussion Phase**: Players ask questions and discuss to identify the liar
6. **Voting**: Players vote on who they think the liar is
7. **Reveal**: Discover if the group successfully identified the liar!

## Categories Available

- **Food** (30 combinations): Pizza vs Burger, Pasta vs Rice, Coffee vs Tea, etc.
- **Fast Food** (20 combinations): McDonald's vs Burger King, KFC vs Popeyes, etc.
- **Fruits** (30 combinations): Apple vs Orange, Banana vs Mango, etc.
- **Cities** (32 combinations): Madrid vs London, Tokyo vs Shanghai, etc.
- **Animals** (38 combinations): Lion vs Tiger, Elephant vs Hippopotamus, etc.
- **Sports** (34 combinations): Soccer vs Basketball, Tennis vs Badminton, etc.
- **Celebrities** (21 combinations): Taylor Swift vs Katy Perry, etc.
- **Soccer Players** (19 combinations): Ronaldo vs Messi, Neymar vs Mbappe, etc.
- **NBA Players** (16 combinations): LeBron vs Jordan, Curry vs Thompson, etc.
- **Mythical Creatures** (15 combinations): Dragon vs Unicorn, Phoenix vs Griffin, etc.
- **Animation Characters** (30 combinations): Mickey vs Bugs Bunny, Pikachu vs Sonic, etc.

## Running Locally

**Prerequisites**: Node.js 18+ and npm

1. **Clone and Install**:
```bash
git clone <repository-url>
cd Liar_Liar
npm install
```

2. **Environment Setup**:
Create `.env.local` with your Supabase credentials:
```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Start Development Server**:
```bash
npm start
```

4. **Open**: http://localhost:3000

## Database Schema

The game uses Supabase with the following key tables:

- **`rooms`**: Game room management with status tracking
- **`players`**: Player information and active status with heartbeat system
- **`game_sessions`**: Individual game rounds with category and settings
- **Real-time subscriptions**: Live updates for player joins/leaves and game state changes

## Key Features Implementation

### 🎯 **Fair Randomization**
Uses Fisher-Yates shuffle algorithm to ensure truly random liar selection, preventing the host from always being chosen.

### 🔄 **Real-time Synchronization** 
- Players automatically sync when returning from background
- Robust connection health monitoring
- Graceful handling of network interruptions
- Automatic state recovery on reconnection

### 📊 **Balanced Word Combinations**
Each category features carefully balanced word pairs where every word appears as both majority and minority across different combinations, ensuring no word gives away the game.

### 🎨 **Custom Branding**
Features custom "Yappie" mascot illustrations throughout the interface, replacing generic emojis with branded artwork.

## Deployment

**Frontend (Vercel)**:
```bash
npm run build
# Deploy to Vercel or your preferred hosting platform
```

**Backend**: Hosted on Supabase with PostgreSQL database and real-time subscriptions.

## Future Enhancements

- **Analytics Dashboard**: Game statistics and popular categories
- **Custom Categories**: User-generated word combinations  
- **Tournament Mode**: Bracket-style multi-round competitions
- **Mobile App**: React Native version for enhanced mobile experience
- **Feedback Analytics**: Backend integration for word combination ratings
- **Audio Support**: Voice chat integration for remote play

## Contributing

This is a complete, production-ready game! Contributions welcome for:
- Additional word categories and combinations
- UI/UX improvements
- Performance optimizations
- Mobile app development
- Analytics and insights features

## License

This project is provided as-is under standard open source practices.

