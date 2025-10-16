# Gym Progress Tracker - Quick Start Guide

## Overview

Your gym tracker app has been successfully set up! This app allows you to track workouts, exercises, and analyze your fitness progress.

## Features

### 1. **Exercise Library** (`/product/exercises`)

- Browse 35+ pre-loaded exercises across 6 categories:
  - Chest, Back, Legs, Shoulders, Arms, Core
- Search and filter exercises
- Add custom exercises

### 2. **Workout Logging** (`/product/workout/new`)

- Select a date for your workout
- Add exercises from the library
- Log individual sets with:
  - Reps
  - Weight (kg)
  - Rest time (optional)
- Quick increment/decrement buttons for easy data entry
- Add workout notes

### 3. **Workout History** (`/product/history`)

- View all past workouts grouped by date
- Expandable workout cards showing detailed set information
- Delete workouts
- See exercise breakdown for each workout

### 4. **Analytics Dashboard** (`/product/analytics`)

- **Stats Cards**: Total workouts, total sets, favorite exercises
- **Progress Charts**: Track weight and volume progression for specific exercises over time
- **Workout Heatmap**: Visual calendar showing workout frequency (last 30 days)

## Getting Started

### First Time Setup

1. **Seed Exercise Database**

   - The app comes with 35 pre-loaded exercises
   - To seed them, you can create a simple utility or manually trigger the seed function
   - Alternatively, start by adding custom exercises in the Exercise Library

2. **Log Your First Workout**

   - Navigate to "Start New Workout" from the dashboard
   - Select today's date (or any date)
   - Click "Add Exercise" and choose from the library
   - Add sets with reps and weight
   - Click "Save Workout"

3. **Track Your Progress**
   - After logging a few workouts, visit the Analytics page
   - Select an exercise to see your progress over time
   - View the workout frequency heatmap

## Database Schema

### Tables

- **exercises**: Stores all exercises (pre-loaded + custom)
- **workouts**: Stores workout sessions with date and notes
- **sets**: Stores individual sets (linked to workouts and exercises)

### Key Features

- Individual set tracking (not just summaries)
- Exercise categorization
- Custom exercise support
- Date-based workout organization

## Tips

1. **Consistent Logging**: Log workouts regularly to get meaningful analytics
2. **Custom Exercises**: Add any exercise not in the default library
3. **Notes**: Use the notes field to track how you felt, nutrition, sleep, etc.
4. **Progress Tracking**: Pick key exercises to track in Analytics (e.g., Bench Press, Squat, Deadlift)

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Shadcn UI
- **Backend**: Convex (real-time database)
- **Auth**: Better Auth (@convex-dev/auth)
- **Charts**: Recharts

## Next Steps

- Start the dev server: `npm run dev`
- Sign in with your account
- Begin logging workouts!
- Track your progress over time

Happy training! 💪
