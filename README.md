# ZarooriBazaar - B2B Marketplace Platform

A comprehensive B2B marketplace platform empowering Micro, Small, and Medium Enterprises (MSMEs) through integrated business networking, digital marketing, and resource optimization tools.

## Features

- Business networking and product listing
- Bulk order and wholesale deals section
- Community forums and webinar platform
- Digital marketing and promotion services
- Logistics and delivery support
- Learning and resource center
- Real-time chat system with AI assistant

## Prerequisites

- Node.js (version 20 or higher)
- npm (comes with Node.js)

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repository-url>
cd zarooribazaar
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
SESSION_SECRET=your_secret_key_here
DATABASE_URL=your_database_url (if using a database)
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Environment Variables

- `SESSION_SECRET`: Required for secure session management
- `DATABASE_URL`: Required if using a database
- `NODE_ENV`: Set to 'production' for production deployment

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Real-time: WebSocket
- Build Tool: Vite

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Node.js/Express server
- `/shared` - Shared types and schemas
- `/public` - Static assets

## License

MIT

## Support

For any questions or issues, please open an issue in the repository.
