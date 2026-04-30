# AI Sales Page Generator - Frontend

A modern, high-converting frontend for the AI Sales Page Generator, built with Next.js and Tailwind CSS.

## Features

- **Dashboard**: Overview of all your generated sales pages.
- **AI Generator**: Easy-to-use form to generate sales copy by providing product details.
- **Template System**: Multiple professional templates (Modern, Elegant, Dark Mode).
- **Live Preview**: Real-time preview of the generated sales page.
- **Responsive Design**: Fully mobile-responsive interface.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **API Client**: Axios

## Getting Started

1. **Navigate to the `fe` directory**.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Setup environment**: Create a `.env.local` file and add the backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open the browser**: Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `src/app`: Page components and routing.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and API configuration.
- `src/hooks`: Custom React hooks for data fetching and state.
