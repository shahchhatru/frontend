import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/config/axios";
import { toast } from "sonner";
import { StoreState, User } from "../types/StoreTypes";

export const addUser = createAsyncThunk<User, { username: string; password: string; email: string; role: string; municipalityCode: string }, { state: StoreState }>(
  'users/addUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token; // Get the token from the state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      };

      const response = await apiClient.post('/users/add', userData, config); // Adjust the URL as needed
      const { data } = response;

      if (data.success) {
        toast.success(data.message); // Show success message
        return data.data.user; // Return the added user data
      } else {
        return rejectWithValue(data.message || 'Failed to add user');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'An error occurred';
      toast.error(message); // Show error message
      return rejectWithValue({
        message: message,
        fieldErrors: error.response?.data?.fieldErrors || {}, // Ensure your API returns these
      });
    }
  }
);



const initialState = {
  users: [] as User[], 
  loading: false, 
  error: null as { message: string } | null,
};

// User slice definition
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Additional reducers can be defined here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Clear any previous errors
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false; // Reset loading state
        state.users.push(action.payload); // Add the new user to the users array
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = { message: action.payload as string }; // Set error message
        toast.error("Failed to add user: " + state.error.message); // Show error toast
      });
  },
});

// Export the reducer
export default userSlice.reducer;
