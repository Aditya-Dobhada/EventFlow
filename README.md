# EventFlow - Dynamic Event Calendar Application

A modern, feature-rich calendar application built with React, TypeScript, and shadcn/ui.

## Features

- **Calendar View**
  - Monthly calendar grid with proper day alignment
  - Navigate between months
  - Current day highlighting
  - Weekend/weekday visual distinction

- **Event Management**
  - Add, edit, and delete events
  - Event details include:
    - Title
    - Start and end time
    - Optional description
    - Color coding (work, personal, other)
  - Time overlap prevention
  - Drag and drop events between days

- **Event Organization**
  - List view of all events
  - Search/filter events by keyword
  - Color coding for different event types
  - Export events as JSON

- **Data Persistence**
  - Local storage implementation
  - No data loss between page refreshes

## Technical Implementation

- Built with React.js and TypeScript
- Custom calendar logic implementation
- Modern UI components from shadcn/ui
- Responsive design for all screen sizes
- Clean, modular code structure

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

- `/src/components` - React components
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and helpers
- `/src/types` - TypeScript type definitions

## Code Quality

- TypeScript for type safety
- ESLint for code quality
- Modular component architecture
- Clean and maintainable code structure