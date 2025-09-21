# Capta Schedule API

A Node.js Express API for schedule management and working days calculation.

## Tech Stack

- **Node.js** with **Express 5**
- **TypeScript** for type safety
- **Moment.js** for date/time handling
- **Jest** for testing

## Installation

```bash
git clone <repository-url>
cd capta-schedule-api
npm install
```

## Environment Setup

Create a `.env` file:

```env
PORT=3000
API_CAPTA_HOLYDATES="https://content.capta.co/Recruitment/WorkingDays.json"
API_VERSION="/v1"
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm start           # Start production server
npm test            # Run tests
npm run test:debug  # Run tests in watch mode
npm run debug       # Start with debugger
```

## Author

**RickBm400**
