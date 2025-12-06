# 25th Anniversary Journey Website

A desktop-first, immersive, interactive journey-style website celebrating a couple's 25th anniversary. The experience features a guided journey through memories, messages from friends and family, video messages, and a surprise finale with confetti.

## Features

- **Journey Page**: Scroll through 7-10 animated chapters with photos, anecdotes, and micro-interactions
- **Messages Page**: Corkboard-style layout with dozens of wishes from friends and family
- **Videos Page**: Polaroid-style video cards with lightbox playback
- **Surprise Page**: Cinematic montage with confetti celebration
- **Admin Page**: Desktop-only interface for managing chapters, messages, and content

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** (with custom warm scrapbook theme)
- **Framer Motion** (animations)
- **canvas-confetti** (celebration effects)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sai-mini
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```bash
# Site Configuration
NEXT_PUBLIC_SITE_NAME="25th Anniversary Journey"
NEXT_PUBLIC_COUPLE_NAME="John & Jane"

# Optional: Password protection for the site
SITE_PASSWORD=""

# Optional: Admin password (if implementing admin auth)
ADMIN_PASSWORD=""
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
sai-mini/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (boarding pass)
│   ├── journey/           # Main journey experience
│   ├── messages/          # Message wall
│   ├── videos/            # Video messages
│   ├── surprise/          # Finale page
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── journey/          # Journey-specific components
│   ├── messages/         # Message components
│   ├── videos/           # Video components
│   ├── surprise/         # Surprise components
│   ├── admin/            # Admin components
│   └── interactions/     # Micro-interaction components
├── data/                 # JSON data files
│   ├── chapters.json    # Chapter/memory data
│   ├── messages.json    # Message data
│   └── videos.json      # Video data
├── lib/                  # Utility functions
│   ├── data.ts          # Data loading utilities
│   ├── utils.ts         # Helper functions
│   └── animations.ts    # Framer Motion variants
├── hooks/               # Custom React hooks
│   ├── useKeyboard.ts   # Keyboard shortcuts
│   └── useScrollSnap.ts # Scroll-snap navigation
├── types/               # TypeScript interfaces
└── public/              # Static assets
    ├── images/         # Chapter photos
    ├── videos/         # Video files
    └── audio/          # Audio clips
```

## Data Structure

### Chapter (Memory)
```typescript
{
  id: string;
  title: string;
  date: string; // ISO string
  text: string; // Anecdote
  photos: string[]; // URLs
  audioClipUrl?: string;
  interactionType: 'flip' | 'slider' | 'quiz' | 'none';
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
  };
  place?: string;
  layoutHint: 'full-bleed' | 'two-column-left' | 'two-column-right' | 'centered';
}
```

### Message
```typescript
{
  id: string;
  author: string;
  relation: string;
  text: string;
  chapterId?: string;
  avatarUrl?: string;
  date: string; // ISO
  curated: boolean;
}
```

### Video
```typescript
{
  id: string;
  author: string;
  thumbnail: string; // URL
  videoUrl: string; // URL
  durationSec: number;
  date: string; // ISO
  transcript?: string;
}
```

## Customization

### Adding Chapters

Edit `data/chapters.json` to add or modify chapters. Each chapter can have:
- Multiple photos
- A short anecdote
- A micro-interaction (flip card, slider, quiz)
- Layout hints for visual presentation

### Adding Messages

Edit `data/messages.json` to add messages. Messages can be:
- Linked to specific chapters via `chapterId`
- Marked as curated
- Filtered by relation type

### Adding Videos

Edit `data/videos.json` to add video messages. Include:
- Thumbnail image
- Video URL
- Optional transcript

### Customizing Colors

Edit `app/globals.css` to modify the color palette. The theme uses warm scrapbook colors:
- Rose tones (pink/red)
- Amber tones (yellow/gold)
- Warm grays

## Keyboard Shortcuts

- **Left Arrow**: Previous chapter (journey page)
- **Right Arrow**: Next chapter (journey page)
- **Space**: Play/pause media
- **Escape**: Close modals

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Add environment variables in Vercel dashboard if needed
5. Deploy!

The site will be available at `https://your-project.vercel.app`

### Environment Variables

If using password protection, set these in Vercel:
- `NEXT_PUBLIC_SITE_PASSWORD` (optional)
- `NEXT_PUBLIC_COUPLE_NAME` (optional)
- `NEXT_PUBLIC_SITE_NAME` (optional)

### Build Optimization

- Images are automatically optimized via `next/image`
- Static assets are served from CDN
- Code is automatically split and optimized

## Performance

- Images are lazy-loaded and optimized
- High-res images use srcset for responsive loading
- Animations respect `prefers-reduced-motion`
- No autoplay audio or disruptive motion

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states for interactive elements
- Alt text for images

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- Placeholder images are used in the sample data. Replace with actual photos in `public/images/`
- Video uploads are stubbed in the admin panel. Integrate with S3/Supabase for production
- Admin page has no authentication by default (development only)
- Data is stored in JSON files. For production, consider using a database

## License

This project is created for a one-time celebration event.

## Support

For issues or questions, please refer to the Next.js documentation or create an issue in the repository.