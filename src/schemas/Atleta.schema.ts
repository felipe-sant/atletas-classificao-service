import { z } from "zod";

export const atletaSchema = z.object({
    Group: z.string().optional(),
    Workload: z.number(),
    "Sprint Distance": z.number(),
    "High Intensity Running": z.number(),
    "Top Speed": z.number(),
    Accelerations: z.number(),
    Decelerations: z.number(),
    "No. of Sprints": z.number(),
    "Metres per Minute": z.number(),
    "No. of High Intensity Events": z.number(),
    "Minutes Played": z.number(),
});

export type Atleta = z.infer<typeof atletaSchema>;