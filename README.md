# Modern To-Do List Application

A feature-rich task management application built with React, TypeScript, and Vite, offering a smooth and intuitive user experience with drag-and-drop functionality.

## Live Demo

✨ [Try the application](https://sergeyrogonov.github.io/to-do-list/)

## Features

- ✨ Intuitive drag-and-drop task reordering
- ✅ Task status management (complete/active)
- 🔄 Smart task sorting (finished-first/active-first)
- 📝 Create, edit, and delete tasks
- 🔒 Safe delete operations with confirmation modals
- 🗑️ Bulk delete functionality
- 💾 Persistent storage using localStorage
- 📱 Responsive design

## Tech Stack

- **React** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **@hello-pangea/dnd** - Drag and Drop functionality

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. #### Clone the repository

```bash
git clone <repository-url>
```

2. #### Install dependencies

`npm install`
or
`yarn install`

3. #### Start the development server

`npm run dev`
or
`yarn dev`

4. #### Open your browser and navigate to http://localhost:5173

## Usage

- Add Task : Click the "+ Add task" button to add a new task
- Edit Task : Click the three dots menu on a task
- Complete Task : Click the checkbox to mark a task as complete
- Reorder Tasks : Drag and drop tasks to reorder them
- Sort Tasks : Click three dots on Tasks and use the sorting options to arrange tasks by status
- Bulk Delete : Click three dots on Tasks and use bulk delete options to delete completed or all tasks
- Delete Task : Click the three dots menu on a task and click "Delete"

## Local Storage

The application automatically saves tasks to the browser's localStorage, ensuring your tasks persist between sessions.
