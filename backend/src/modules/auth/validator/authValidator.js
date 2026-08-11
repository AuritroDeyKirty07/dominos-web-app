import {z} from "zod";

export const registerSchema=z.object({
    name:z.string().trim().min(2,"name must be atleat 2 characters"),

    email: z.string().trim().email("Invalid email format").toLowerCase(),
    phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
     password: z.string().min(6, "Minimum 6 characters").regex(/[a-z]/, "Must contain 1 lowercase character")
      .regex(/[A-Z]/, "Must contain 1 uppercase character")
      .regex(/[0-9]/, "Must contain 1 numeric character")
      .regex(/[@$!.()%^*'";:]/, "Must contain 1 special character"),
      role: z.enum(["customer", "cook", "delivery", "admin"]),
    address:z.array(
        z.object({
        label: z.string().min(1, "Address label is required"),
        street: z.string().min(1, "Street is required"),
       city: z.string().min(1, "City is required"),
        pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
        })
    )
    .optional()
})

export const loginSchema=z.object({
       email: z.string().trim().email("Invalid email format").toLowerCase(),
       password: z.string().min(6, "Minimum 6 characters").regex(/[a-z]/, "Must contain 1 lowercase character")
})