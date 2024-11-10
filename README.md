# Task Management System Frontend

This project is the frontend part of a Task Management System built using React, TypeScript, and Material-UI. It provides an interactive user interface for managing tasks, supporting CRUD (Create, Read, Update, Delete) operations and drag-and-drop functionality.

## Tech Stack

- *React*: JavaScript library for building user interfaces.
- *TypeScript*: Typed superset of JavaScript for better code quality and maintainability.
- *Material-UI (MUI)*: React component library for building modern and responsive UIs.
- *Redux Toolkit*: State management solution for efficient and scalable code.
- *React Beautiful DnD*: Library for drag-and-drop functionality.
- *Axios*: HTTP client for making API requests.
- *React-Toastify*: Notifications and alerts for better user experience.
- *Date-fns*: Utility library for date manipulation.
- *Framer Motion*: Library for animations and transitions.

## Installation

1. *Clone the repository:*
   bash
   git clone https://github.com/Rashmi-Kalsariya/Task_Management
   

2. *Install dependencies:*
   bash
   npm install
   

3. *Run the development server:*
   bash
   npm run dev
   

## Features

- *Task Board*: Display and organize tasks under different categories (To Do, In Progress, Done, Timeout).
- *Drag-and-Drop*: Rearrange tasks easily using drag-and-drop functionality.
- *Add/Edit/Delete Tasks*: Create new tasks, modify existing tasks, or delete tasks.
- *Task Priority Indication*: Visual indicators for task priorities based on deadlines.
- *Responsive Design*: Fully responsive UI built with Material-UI.
- *Error Handling*: Robust error handling for API requests.

## Project Structure

plaintext
src/
├── components/
│   ├── TaskBoard.tsx
│   ├── Sidebar.tsx
│   ├── TaskColumns.tsx
│   ├── ModalComponent.tsx
│   ├── Navbar.tsx
│   └── EditTaskModal.tsx
├── redux/
│   ├── task/
│   │   ├── taskSlice.ts
│   │   └── taskActions.ts
│   └── store.ts
├── utils/
│   └── api.ts
└── App.tsx


## Key Components

### 1. *TaskBoard.tsx*
The main component that displays tasks and organizes them into columns for each status category. Handles drag-and-drop events to update task status.

### 2. *Sidebar.tsx*
Displays task statistics and provides an option to add new tasks.

### 3. *TaskColumns.tsx*
Renders a list of tasks for a specific status and supports task actions such as moving and editing.

### 4. *ModalComponent.tsx*
A modal for adding new tasks with input validation.

### 5. *EditTaskModal.tsx*
A modal for editing existing tasks.

## State Management
The project uses *Redux Toolkit* for managing the application state, with taskSlice.ts handling asynchronous actions such as fetching, adding, updating, and deleting tasks.

### Example Slice Structure
typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await api.get('/tasks');
  return response.data;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = 'failed';
      });
  },
});

export default taskSlice.reducer;


## Running the App
To run the app in development mode, use:
bash
npm run dev


To build the app for production:
bash
npm run build
