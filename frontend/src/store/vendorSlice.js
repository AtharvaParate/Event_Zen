import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchVendors,
  fetchVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../api/vendorApi";
import { setAlert } from "./uiSlice";

// Async thunks for vendor operations
export const fetchVendorsAsync = createAsyncThunk(
  "vendors/fetchVendors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchVendors();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVendorByIdAsync = createAsyncThunk(
  "vendors/fetchVendorById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchVendorById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createVendorAsync = createAsyncThunk(
  "vendors/createVendor",
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await createVendor(vendorData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVendorAsync = createAsyncThunk(
  "vendors/updateVendor",
  async ({ id, vendorData }, { rejectWithValue }) => {
    try {
      const response = await updateVendor(id, vendorData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteVendorAsync = createAsyncThunk(
  "vendors/deleteVendor",
  async (id, { rejectWithValue }) => {
    try {
      await deleteVendor(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const initialState = {
  vendors: [],
  vendor: null,
  loading: false,
  error: null,
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
  },
};

const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    clearVendorErrors: (state) => {
      state.error = null;
    },
    clearVendor: (state) => {
      state.vendor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vendors
      .addCase(fetchVendorsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.content;
        state.pagination = {
          totalItems: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
        };
      })
      .addCase(fetchVendorsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Vendor
      .addCase(fetchVendorByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
      })
      .addCase(fetchVendorByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Vendor
      .addCase(createVendorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendorAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.unshift(action.payload);
      })
      .addCase(createVendorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Vendor
      .addCase(updateVendorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.vendors = state.vendors.map((vendor) =>
          vendor.id === action.payload.id ? action.payload : vendor
        );
      })
      .addCase(updateVendorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Vendor
      .addCase(deleteVendorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendorAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = state.vendors.filter(
          (vendor) => vendor.id !== action.payload
        );
        if (state.vendor && state.vendor.id === action.payload) {
          state.vendor = null;
        }
      })
      .addCase(deleteVendorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorErrors, clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
