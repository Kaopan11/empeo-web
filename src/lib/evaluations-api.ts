import { api } from "./api";
import type { EvaluationWriteBody, EvaluationWriteResponse } from "@/types";

export function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export async function saveEvaluation(id: string, body: EvaluationWriteBody) {
  const { data } = await api.post<EvaluationWriteResponse>(
    `${apiBaseUrl()}/api/evaluations/${id}/save`,
    body,
  );
  return data;
}

export async function submitEvaluation(id: string, body: EvaluationWriteBody) {
  const { data } = await api.post<EvaluationWriteResponse>(
    `${apiBaseUrl()}/api/evaluations/${id}/submit`,
    body,
  );
  return data;
}
