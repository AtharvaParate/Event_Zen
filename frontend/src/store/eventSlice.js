import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventApi from "../api/eventApi";
import { setAlert } from "./uiSlice";

// Async thunks
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      return await eventApi.getEvents(params);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch events";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const fetchEvent = createAsyncThunk(
  "events/fetchEvent",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      return await eventApi.getEventById(id);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch event details";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { dispatch, rejectWithValue }) => {
    try {
      const response = await eventApi.createEvent(eventData);
      dispatch(
        setAlert({ type: "success", message: "Event created successfully" })
      );
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create event";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await eventApi.updateEvent(id, eventData);
      dispatch(
        setAlert({ type: "success", message: "Event updated successfully" })
      );
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update event";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await eventApi.deleteEvent(id);
      dispatch(
        setAlert({ type: "success", message: "Event deleted successfully" })
      );
      return id;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete event";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

// Slice
const initialState = {
  events: [],
  event: null,
  loading: false,
  error: null,
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
  },
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventErrors: (state) => {
      state.error = null;
    },
    clearEvent: (state) => {
      state.event = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.content;
        state.pagination = {
          totalItems: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
        };
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Event
      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
        if (state.event && state.event.id === action.payload) {
          state.event = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEventErrors, clearEvent } = eventSlice.actions;
export default eventSlice.reducer;
