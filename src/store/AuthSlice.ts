import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/config/axios";
import { jwtDecode } from "jwt-decode"; 
import { z } from "zod";
import { toast } from "sonner";

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
  municipalityCode: z.string().min(1, "Municipality code is required"),
});

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  error: {
    message?: string;
    fieldErrors?: { email?: string; password?: string; municipalityCode?: string };
  } | null;
  email: string;
  password: string;
  municipalityCode: string;
}

const AUTH_STATE_KEY = "authState";

// Helper function for error messages
const handleError = (error: any) => {
  if (error instanceof z.ZodError) {
    const fieldErrors = error.flatten().fieldErrors;
    return {
      message: "Validation failed",
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        municipalityCode: fieldErrors.municipalityCode?.[0],
      },
    };
  }
  return {
    message: error.response?.data?.message || "An error occurred during login",
  };
};

const getInitialAuthState = (): AuthState => {
  const savedAuthState = localStorage.getItem(AUTH_STATE_KEY);
  if (savedAuthState) {
    return JSON.parse(savedAuthState);
  }
  return {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
    error: null,
    email: "",
    password: "",
    municipalityCode: "",
  };
};

const initialState: AuthState = getInitialAuthState();

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password, municipalityCode }: { email: string; password: string; municipalityCode: string },
    { rejectWithValue }
  ) => {
    try {
      loginSchema.parse({ email, password, municipalityCode });
      const response = await apiClient.post("/auth/login", { email, password, municipality_code: municipalityCode });
      const { accessToken, refreshToken } = response.data.data;
      const decodedToken: User = jwtDecode(accessToken);
      return { accessToken, refreshToken, user: decodedToken };
    } catch (error: any) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/users", {
        name,
        email,
        password,
      });
      const user: User = response.data.data;
      return user;
    } catch (error: any) {
      return rejectWithValue(
        JSON.stringify(error.response?.data?.data) || "Signup failed"
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (
    { otp, userId }: { otp: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(`users/${userId}/otp/verify`, {
        otp,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Verification failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/sendresetlink", {
        email,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Forgot password failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/resetpassword", {
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Reset password failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem(AUTH_STATE_KEY);
      localStorage.removeItem("accessToken");
      toast.success("Logout Successful");
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.user = user;
        state.error = null;
        state.email = "";
        state.password = "";
        localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
        localStorage.setItem("accessToken", accessToken);
        toast.success("Login successful" + state.user.name);
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as AuthState["error"];
        toast.error(`Login Failed ${action.payload}`);
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        toast.success(`Signup Successful ${JSON.stringify(action.payload)}`);
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = { message: action.payload as string };
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.error = null;
        toast.success("Verification Successful");
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.error = { message: action.payload as string };
        toast.error("Verification Failed" + state.error);
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.error = null;
        state.password = "";
        toast.success("Password Reset Successful");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.password = "";
        state.error = { message: action.payload as string };
        toast.error("Password Reset Failed" + state.error);
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.email = "";
        state.error = null;
        toast.success("Password Reset Link Sent");
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = { message: action.payload as string };
        toast.error("Password Reset Failed" + state.error);
      });
  },
});

export const { logout, setEmail, setPassword, clearErrors } = authSlice.actions;
export default authSlice.reducer;
