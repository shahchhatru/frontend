import { createSlice,createAsyncThunk,PayloadAction } from "@reduxjs/toolkit";
import {apiClient} from '@/config';
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
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
  });



