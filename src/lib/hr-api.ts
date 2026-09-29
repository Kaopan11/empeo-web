import { api } from "./api";
import { apiBaseUrl } from "./evaluations-api";
import type { HrDashboard } from "@/types";

export const ACTIVE_CYCLE_ID =
  process.env.NEXT_PUBLIC_CYCLE_ID ?? "b1000000-0000-4000-8000-000000000001";

export async function getHrDashboard(cycleId = ACTIVE_CYCLE_ID) {
  const { data } = await api.get<HrDashboard>(
    `${apiBaseUrl()}/api/cycles/${cycleId}/dashboard`,
  );
  return data;
}

export async function resolveOverdue(cycleId = ACTIVE_CYCLE_ID) {
  const { data } = await api.post<{ unlocked: number; submitted: number }>(
    `${apiBaseUrl()}/api/cycles/${cycleId}/resolve-overdue`,
  );
  return data;
}
