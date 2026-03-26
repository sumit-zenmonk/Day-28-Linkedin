import { z } from "zod";

export const postSchema = z.object({
    content: z.string().min(1, "Content is required").max(300),
    images: z.array(
        z.object({
            image_url: z.string().url()
        })
    ).max(5).optional()
});

export type PostFormValues = z.infer<typeof postSchema>;