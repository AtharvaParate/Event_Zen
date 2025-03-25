import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorApi from "../api/vendorApi";
import { setAlert } from "./uiSlice";

// Async thunks
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      return await vendorApi.getVendors(params);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch vendors";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const fetchVendor = createAsyncThunk(
  "vendors/fetchVendor",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      return await vendorApi.getVendorById(id);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch vendor details";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const createVendor = createAsyncThunk(
  "vendors/createVendor",
  async (vendorData, { dispatch, rejectWithValue }) => {
    try {
      const response = await vendorApi.createVendor(vendorData);
      dispatch(
        setAlert({ type: "success", message: "Vendor created successfully" })
      );
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create vendor";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async ({ id, vendorData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await vendorApi.updateVendor(id, vendorData);
      dispatch(
        setAlert({ type: "success", message: "Vendor updated successfully" })
      );
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update vendor";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const deleteVendor = createAsyncThunk(
  "vendors/deleteVendor",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await vendorApi.deleteVendor(id);
      dispatch(
        setAlert({ type: "success", message: "Vendor deleted successfully" })
      );
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete vendor";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
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
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.content;
        state.pagination = {
          totalItems: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
        };
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Vendor
      .addCase(fetchVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
      })
      .addCase(fetchVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.unshift(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.vendors = state.vendors.map((vendor) =>
          vendor.id === action.payload.id ? action.payload : vendor
        );
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Vendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = state.vendors.filter(
          (vendor) => vendor.id !== action.payload
        );
        if (state.vendor && state.vendor.id === action.payload) {
          state.vendor = null;
        }
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorErrors, clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
