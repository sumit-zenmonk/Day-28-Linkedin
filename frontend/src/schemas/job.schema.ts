import { z } from "zod";

export const jobSchema = z.object({
    position: z.string().min(1, "Position is required"),
    location: z.string().min(1, "Location is required"),
    role: z.string().min(1, "Role is required"),
    min_salary: z.number("Min salary must be number").min(0),
    max_salary: z.number("Max salary must be number").min(0),
    tags: z.array(z.string()).optional(),
});

export type JobFormValues = z.infer<typeof jobSchema>;