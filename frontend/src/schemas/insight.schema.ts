import { z } from "zod";

export const insightSchema = z.object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Enter a valid email address (e.g., name@example.com)"),
    mobile_number: z.string()
        .regex(/^[0-9]+$/, "Mobile number must contain only digits")
        .min(10, "Mobile number must be at least 10 digits"),
    industry: z.string().min(1, "Please enter an industry"),
    description: z.string().min(5, "Please provide a bit more detail (at least 5 characters)"),
    location: z.string().min(2, "Please enter a city or region"),
});

export type InsightFormValues = z.infer<typeof insightSchema>;
