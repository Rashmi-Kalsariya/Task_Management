import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Redux slice for task management
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Timeout';
  duration: Date;
  createdAt: Date;
}

interface TaskState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean; // Added property for loader tracking
}

const initialState: TaskState = {
  items: [],
  status: 'idle',
  error: null,
  loading: false, // Initial state for loading
};

export const fetchTasks = createAsyncThunk<Task[]>('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
  }
});

export const addTask = createAsyncThunk<Task, Partial<Task>>('tasks/addTask', async (task, { rejectWithValue }) => {
  try {
    const response = await api.post('/tasks', task);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to add task');
  }
});

export const updateTask = createAsyncThunk<Task, { id: string; updatedTask: Partial<Task> }>(
  'tasks/updateTask',
  async ({ id, updatedTask }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${id}`, updatedTask);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk<string, string>('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to delete task');
  }
});

export const moveTaskToTimeout = createAsyncThunk<Task, string>('tasks/moveTaskToTimeout', async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tasks/${id}/timeout`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to move task to timeout');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.loading = true; // Set loading to true when fetching starts
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.loading = false; // Set loading to false when fetching succeeds
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.loading = false; // Set loading to false when fetching fails
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true; // Set loading for add task
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.push(action.payload);
        state.loading = false; // Reset loading state
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false; // Reset loading state
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true; // Set loading for update task
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.items.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        state.loading = false; // Reset loading state
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false; // Reset loading state
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true; // Set loading for delete task
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
        state.loading = false; // Reset loading state
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false; // Reset loading state
      })
      .addCase(moveTaskToTimeout.pending, (state) => {
        state.loading = true; // Set loading for move to timeout
      })
      .addCase(moveTaskToTimeout.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.items.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        state.loading = false; // Reset loading state
      })
      .addCase(moveTaskToTimeout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false; // Reset loading state
      });
  },
});

export default taskSlice.reducer;
