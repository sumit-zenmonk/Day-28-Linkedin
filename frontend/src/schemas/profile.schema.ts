import { z } from "zod";

export const profileSchema = z.object({
    bio: z.string().min(3, "Bio must be at least 3 characters").max(200, "Bio must be under 200 characters"),
    mobile_number: z.string().regex(/^[0-9]{10}$/, "Mobile must be 10 digits"),
});

export const educationSchema = z.object({
    school_name: z.string().min(2, "School name is required").max(100, "Too long"),
    school_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().or(z.literal("")),
    specialization: z.string().max(100, "Too long").optional().or(z.literal("")),
    description: z.string().max(300, "Max 300 characters").optional().or(z.literal("")),
}).refine(
    (data) => {
        if (!data.start_date || !data.end_date) return true;
        return new Date(data.end_date) >= new Date(data.start_date);
    },
    {
        message: "End date cannot be before start date",
        path: ["end_date"],
    }
);

export const employmentSchema = z.object({
    company_name: z.string().min(2, "Company name is required"),

    company_url: z.string().url("Invalid URL").optional().or(z.literal("")),

    start_date: z.string().min(1, "Start date is required"),

    end_date: z.string().optional().or(z.literal("")),

    description: z.string().max(300).optional().or(z.literal("")),
}).refine(
    (data) => {
        if (!data.start_date || !data.end_date) return true;
        return new Date(data.end_date) >= new Date(data.start_date);
    },
    {
        message: "End date cannot be before start date",
        path: ["end_date"],
    }
);

export type EmploymentFormValues = z.infer<typeof employmentSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type EducationFormValues = z.infer<typeof educationSchema>;