import { z } from "zod";

export const CRITERIA = [
  {
    name: "technical",
    label: "Technical execution",
    anchors: [
      "Needs significant guidance",
      "Building consistency",
      "Meets role expectations",
      "Raises the quality bar",
      "Sets a new standard",
    ],
  },
  {
    name: "collaboration",
    label: "Collaboration & ownership",
    anchors: [
      "Works in isolation",
      "Participates when asked",
      "Reliable and inclusive partner",
      "Proactively unblocks others",
      "Multiplies the team",
    ],
  },
] as const;

const rating = z.string().min(1, "Select a rating");
const ratingOneToFive = z.string().regex(/^[1-5]$/, "Select a rating");

export const draftEvaluationSchema = z.object({
  technical: ratingOneToFive,
  collaboration: ratingOneToFive,
  feedback: z.string(),
});

export const evaluationSchema = z
  .object({
    technical: rating,
    collaboration: rating,
    feedback: z.string(),
  })
  .superRefine((value, ctx) => {
    if (!isLenient(value) || value.feedback.trim() !== "") return;
    ctx.addIssue({
      code: "custom",
      path: ["feedback"],
      message: "Required when both ratings are 5",
    });
  });

export type EvaluationInput = z.infer<typeof evaluationSchema>;

export function isLenient(value: {
  technical?: string;
  collaboration?: string;
}) {
  return value.technical === "5" && value.collaboration === "5";
}
