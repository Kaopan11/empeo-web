"use client";

import {
  ClipboardCheck,
  Clock,
  LayoutGrid,
  TriangleAlert,
  Users,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getHrDashboard } from "@/lib/hr-api";
import type {
  BiasLabel,
  EvaluationStatus,
  HrDashboard,
  PerformanceTier,
} from "@/types";

const CARD =
  "rounded-[18px] bg-white shadow-[0px_0px_0px_1px_rgba(10,10,10,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]";

const TIER_LABEL: Record<PerformanceTier, string> = {
  HIGH: "High Performer",
  CORE: "Core Performer",
  LOW: "Needs Support",
};

const TIER_CLASS: Record<PerformanceTier, string> = {
  HIGH: "border-[#a4f4cf] bg-[#ecfdf5] text-[#007a55]",
  CORE: "border-[#ffd6a7] bg-[#fff7ed] text-[#ca3500]",
  LOW: "border-[#fee685] bg-[#fffbeb] text-[#bb4d00]",
};

const STATUS_LABEL: Record<EvaluationStatus, string> = {
  PENDING: "Pending",
  DRAFT: "In progress",
  SUBMITTED: "Submitted",
  OVERDUE: "Overdue",
};

const STATUS_CLASS: Record<EvaluationStatus, string> = {
  PENDING: "border-[#e5e5e5] bg-[#f5f5f5] text-[#737373]",
  DRAFT: "border-[#fee685] bg-[#fffbeb] text-[#bb4d00]",
  SUBMITTED: "border-[#a4f4cf] bg-[#ecfdf5] text-[#007a55]",
  OVERDUE: "border-[#ffccd3] bg-[#fff1f2] text-[#c70036]",
};

function csvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function exportTalentCsv(rows: HrDashboard["talent"]) {
  const header = [
    "Employee",
    "Department",
    "Raw score",
    "Normalized",
    "Tier",
    "Status",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        csvCell(row.name),
        csvCell(row.department),
        row.rawScore == null ? "" : row.rawScore.toFixed(1),
        row.normalizedScore == null ? "" : row.normalizedScore.toFixed(2),
        row.tier ? TIER_LABEL[row.tier] : "",
        STATUS_LABEL[row.status],
      ].join(","),
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "talent-classification.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function formatScore(value: number | null, digits: number) {
  return value == null ? "—" : value.toFixed(digits);
}

function formatBias(value: number | null) {
  if (value == null) {
    return "—";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}σ`;
}

function badge(label: BiasLabel) {
  if (label === "Too lenient") {
    return "border-[#fee685] bg-[#fffbeb] text-[#bb4d00]";
  }
  if (label === "Strict") {
    return "border-[#ffccd3] bg-[#fff1f2] text-[#c70036]";
  }
  return "";
}

function managerRowClass(label: BiasLabel) {
  if (label === "Too lenient") {
    return "border-[#e5e5e5] bg-[#fffbeb]/50";
  }
  if (label === "Strict") {
    return "border-[#e5e5e5] bg-[#fff1f2]/50";
  }
  return "border-[#e5e5e5] bg-white";
}

export default function HrPage() {
  const [data, setData] = useState<HrDashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHrDashboard()
      .then(setData)
      .catch((err: unknown) => {
        setError(
          axios.isAxiosError(err)
            ? String(err.response?.data?.error ?? err.message)
            : "Could not load the dashboard",
        );
      });
  }, []);

  const kpis = data?.kpis;
  const dist = data?.distribution;

  return (
    <main className="flex-1 bg-[#fff7ed]/20 px-8 py-8">
      <div className="mx-auto flex w-full max-w-344 flex-col gap-8">
        <nav className="flex items-center gap-2 text-xs text-[#737373]">
          <LayoutGrid className="size-3.5" />
          <span>Workspace</span>
          <span>/</span>
          <span className="font-medium text-[#0a0a0a]">HR Admin</span>
        </nav>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-[1.92px] text-[#f54900] uppercase">
                People Ops · Annual Review 2026
              </p>
              <h1 className="text-[30px] leading-9 font-semibold tracking-[-0.75px] text-[#0a0a0a]">
                Fairness & analytics
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[#737373]">
                A clear view of calibration, coverage, and performance
                distribution across the organization.
              </p>
            </div>
            <Button
              type="button"
              className="h-7.5 cursor-pointer rounded-[10px] bg-[#f54900] px-2.5 text-sm font-medium text-[#fafafa] hover:bg-[#f54900]/90"
            >
              Publish cycle
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Kpi
              title="Total employees"
              value={kpis?.totalEmployees ?? "—"}
              hint={`Across ${kpis?.departments ?? 0} departments`}
              iconClass="bg-[#fff7ed] text-[#f54900]"
              icon={<Users className="size-5" strokeWidth={1.67} />}
            />
            <Kpi
              title="Submitted"
              value={kpis?.submitted ?? "—"}
              hint={`${kpis?.completionRate ?? 0}% completion rate`}
              iconClass="bg-[#ecfdf5] text-[#009966]"
              icon={<ClipboardCheck className="size-5" strokeWidth={1.67} />}
            />
            <Kpi
              title="In progress"
              value={kpis?.inProgress ?? "—"}
              hint={
                kpis
                  ? `Due in ${Math.max(kpis.daysUntilEnd, 0)} days`
                  : "—"
              }
              iconClass="bg-[#fffbeb] text-[#e17100]"
              icon={<Clock className="size-5" strokeWidth={1.67} />}
            />
            <Kpi
              title="Overdue"
              value={kpis?.overdue ?? "—"}
              hint="Needs your attention"
              iconClass="bg-[#fff1f2] text-[#ec003f]"
              icon={<TriangleAlert className="size-5" strokeWidth={1.67} />}
            />
          </div>
          {kpis && kpis.overdue > 0 && (
            <div className="flex items-center justify-between rounded-[14px] bg-[#fffbeb]/50 px-4 py-4 shadow-[0px_0px_0px_1px_rgba(10,10,10,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
              <div>
                <p className="text-sm font-semibold text-[#461901]">
                  {kpis.overdue} reviews are overdue
                </p>
                <p className="text-xs text-[#973c00]/80">
                  Follow up with the reviewers to keep your calibration window
                  on track.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-7 cursor-pointer rounded-lg border-[#ffd230] bg-transparent text-xs font-medium text-[#7b3306]"
              >
                Resolve overdue
              </Button>
            </div>
          )}
          <div className="grid grid-cols-[1fr_380px] items-start gap-4">
            <section className={`${CARD} flex flex-col gap-4 py-4`}>
              <div className="px-4">
                <h2 className="text-base leading-6 font-medium text-[#0a0a0a]">
                  Fairness & distribution
                </h2>
                <p className="text-sm leading-5 text-[#737373]">
                  Normalized score distribution across all completed reviews.
                </p>
              </div>
              <div className="flex flex-col gap-5 px-4">
                <div className="flex flex-col gap-5 rounded-[14px] border border-[#e5e5e5] bg-[#f5f5f5]/20 p-5">
                  <div className="flex h-42 items-end justify-center gap-3">
                    <Bar
                      label="Low"
                      percent={dist?.low.percent ?? 0}
                      color="bg-[#ffd6a7]"
                    />
                    <Bar
                      label="Core"
                      percent={dist?.core.percent ?? 0}
                      color="bg-[#ff8904]"
                    />
                    <Bar
                      label="High"
                      percent={dist?.high.percent ?? 0}
                      color="bg-[#ffd6a7]"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-4 text-[11px] text-[#737373]">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#ffd6a7]" />
                      Needs support
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#ff8904]" />
                      Core performer
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Stat
                    label="Average normalized"
                    value={formatScore(dist?.averageNormalized ?? null, 2)}
                    suffix="z"
                  />
                  <Stat
                    label="Calibration spread"
                    value={formatScore(dist?.calibrationSpread ?? null, 2)}
                    suffix="σ"
                  />
                  <Stat
                    label="Confidence"
                    value={dist ? `${dist.confidence}%` : "—"}
                  />
                </div>
              </div>
            </section>
            <section className={`${CARD} flex flex-col gap-4 py-4`}>
              <div className="px-4">
                <h2 className="text-base leading-6 font-medium text-[#0a0a0a]">
                  Manager bias index
                </h2>
                <p className="text-sm leading-5 text-[#737373]">
                  Variance from company benchmark.
                </p>
              </div>
              <div className="flex flex-col gap-3 px-4">
                {(data?.managers ?? []).map((manager) => (
                  <div
                    key={manager.managerId}
                    className={`flex items-center justify-between rounded-[14px] border px-4 py-4 ${managerRowClass(manager.label)}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0a0a0a]">
                        {manager.name}
                      </p>
                      <p className="text-xs text-[#737373]">
                        {manager.department} · {manager.reportCount} reports
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <p
                        className={`text-sm font-semibold ${manager.label === "Strict" ? "text-[#c70036]" : "text-[#bb4d00]"}`}
                      >
                        {formatBias(manager.biasIndex)}
                      </p>
                      {manager.label && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badge(manager.label)}`}
                        >
                          {manager.label}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="h-7.5 w-full cursor-pointer rounded-[10px] border-[#e5e5e5] text-sm font-medium text-[#0a0a0a]"
                >
                  Open calibration guide
                </Button>
              </div>
            </section>
          </div>
          <section className={`${CARD} flex flex-col gap-4 py-4`}>
            <div className="flex items-start justify-between px-4">
              <div>
                <h2 className="text-base leading-6 font-medium text-[#0a0a0a]">
                  Talent classification
                </h2>
                <p className="text-sm leading-5 text-[#737373]">
                  Calibrated outcomes for the current review cycle.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={!data}
                className="h-6.5 cursor-pointer rounded-lg border-[#e5e5e5] text-xs font-medium text-[#0a0a0a] disabled:cursor-not-allowed"
                onClick={() => {
                  if (data) {
                    exportTalentCsv(data.talent);
                  }
                }}
              >
                Export report
              </Button>
            </div>
            <div className="overflow-x-auto px-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e5e5] text-[#0a0a0a]">
                    <th className="px-2 py-2.5 font-medium">Employee</th>
                    <th className="px-2 py-2.5 font-medium">Department</th>
                    <th className="px-2 py-2.5 font-medium">Raw score</th>
                    <th className="px-2 py-2.5 font-medium">Normalized</th>
                    <th className="px-2 py-2.5 font-medium">Tier</th>
                    <th className="px-2 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.talent ?? []).map((row) => (
                    <tr
                      key={row.userId}
                      className="border-b border-[#e5e5e5] last:border-0"
                    >
                      <td className="px-2 py-2 font-medium text-[#0a0a0a]">
                        {row.name}
                      </td>
                      <td className="px-2 py-2 text-[#737373]">
                        {row.department}
                      </td>
                      <td className="px-2 py-2">{formatScore(row.rawScore, 1)}</td>
                      <td className="px-2 py-2 font-semibold">
                        {formatScore(row.normalizedScore, 2)}
                      </td>
                      <td className="px-2 py-2">
                        {row.tier ? (
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_CLASS[row.tier]}`}
                          >
                            {TIER_LABEL[row.tier]}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[row.status]}`}
                        >
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Kpi({
  title,
  value,
  hint,
  iconClass,
  icon,
}: {
  title: string;
  value: string | number;
  hint: string;
  iconClass: string;
  icon: ReactNode;
}) {
  return (
    <div className={`${CARD} flex items-start justify-between p-5`}>
      <div>
        <p className="text-sm font-medium text-[#737373]">{title}</p>
        <p className="mt-1 text-[30px] leading-9 font-semibold tracking-[-0.75px] text-[#0a0a0a]">
          {value}
        </p>
        <p className="text-xs text-[#737373]">{hint}</p>
      </div>
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-[14px] p-2.5 ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  );
}

function Bar({
  label,
  percent,
  color,
}: {
  label: string;
  percent: number;
  color: string;
}) {
  const height = Math.max(8, Math.round((percent / 100) * 128));
  return (
    <div className="flex w-48 flex-col items-center">
      <div
        className={`w-full rounded-t-[10px] ${color}`}
        style={{ height }}
      />
      <p className="mt-2 text-xs font-semibold text-[#0a0a0a]">{label}</p>
      <p className="text-xs text-[#737373]">{percent}%</p>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div>
      <p className="text-xs text-[#737373]">{label}</p>
      <p className="text-lg font-semibold text-[#0a0a0a]">
        {value}
        {suffix ? (
          <span className="ml-1 text-xs font-normal text-[#737373]">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}
