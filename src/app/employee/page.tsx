"use client";

import { LayoutGrid, Lock, MessageSquareText, Target } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getMyReview } from "@/lib/hr-api";
import { useRoleSwitcher } from "@/components/app-shell";
import type { MeReview, PerformanceTier } from "@/types";

const CARD =
  "rounded-[18px] bg-white shadow-[0px_0px_0px_1px_rgba(10,10,10,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]";

const TIER_LABEL: Record<PerformanceTier, string> = {
  HIGH: "High Performer",
  CORE: "Core Performer",
  LOW: "Needs Support",
};

const CRITERIA_LABEL: Record<string, string> = {
  "Technical Execution": "Technical execution",
  Collaboration: "Collaboration & ownership",
};

function formatPublished(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EmployeePage() {
  const { actor } = useRoleSwitcher();
  const [data, setData] = useState<MeReview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getMyReview()
      .then(setData)
      .catch((err: unknown) => {
        setError(
          axios.isAxiosError(err)
            ? String(err.response?.data?.error ?? err.message)
            : "Could not load your review",
        );
      });
  }, [actor.id]);

  const visible = data?.gate === "visible";
  const waitingPublish = data?.gate === "waiting_publish";

  return (
    <main className="flex-1 bg-[#fff7ed]/20 px-8 py-8">
      <div className="mx-auto flex w-full max-w-344 flex-col gap-8">
        <nav className="flex items-center gap-2 text-xs text-[#737373]">
          <LayoutGrid className="size-3.5" />
          <span>Workspace</span>
          <span>/</span>
          <span className="font-medium text-[#0a0a0a]">Employee</span>
        </nav>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-[1.92px] text-[#f54900] uppercase">
                Employee portal · {data?.employeeName ?? actor.name}
              </p>
              <h1 className="text-[30px] leading-9 font-semibold tracking-[-0.75px] text-[#0a0a0a]">
                Your performance review
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[#737373]">
                Review your progress, feedback, and next steps from the{" "}
                {data?.cycleName ?? "current"} cycle.
              </p>
            </div>
            {visible && data?.publishedAt && (
              <span className="rounded-full border border-[#a4f4cf] bg-[#ecfdf5] px-2 py-0.5 text-xs font-medium text-[#007a55]">
                Published {formatPublished(data.publishedAt)}
              </span>
            )}
          </div>
          <div className="rounded-[10px] border border-[#ffd6a7] bg-[#fff7ed] px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-medium text-[#441306]">
              <Lock className="size-4" />
              {waitingPublish ? "Results not published yet" : visible ? "Results published" : "No submitted review"}
            </p>
            <p className="mt-1 pl-6 text-sm text-[#7e2a0c]/80">
              {waitingPublish
                ? "People Ops has not published this cycle. Scores and feedback stay hidden until then."
                : visible
                  ? "Your manager and People Ops have completed the calibration process. Your results are now visible to you."
                  : "This cycle is published, but you do not have a submitted review yet."}
            </p>
          </div>
          {visible && data.evaluation && (
            <>
              <div className="grid grid-cols-[1fr_1.35fr] items-stretch gap-4">
                <section className="flex flex-col justify-between rounded-[14px] bg-gradient-to-br from-[#f54900] to-[#9f2d00] p-6 text-white shadow-[0px_0px_0px_1px_rgba(10,10,10,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#ffedd4]">Overall performance tier</p>
                      <h2 className="mt-1 text-2xl font-semibold">
                        {data.evaluation.tier
                          ? TIER_LABEL[data.evaluation.tier]
                          : "—"}
                      </h2>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-[14px] bg-white/15">
                      <Target className="size-6" strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <p className="text-5xl leading-12 font-semibold tracking-[-1.2px]">
                      {data.evaluation.totalRawScore.toFixed(1)}
                      <span className="ml-1 text-xl font-normal text-[#ffd6a7]">
                        / 5.0
                      </span>
                    </p>
                    <p className="mt-4 flex items-center gap-2 text-xs text-[#ffedd4]">
                      <span className="size-2 rounded-full bg-[#5ee9b5]" />
                      Calibrated against company benchmark
                    </p>
                  </div>
                </section>
                <section className={`${CARD} flex flex-col gap-4 py-4`}>
                  <div className="px-4">
                    <h2 className="text-base font-medium text-[#0a0a0a]">
                      Score breakdown
                    </h2>
                    <p className="text-sm text-[#737373]">
                      How your performance showed up this cycle.
                    </p>
                  </div>
                  <div className="flex flex-col gap-6 px-4">
                    {(data.scores ?? []).map((row) => (
                      <div key={row.criteriaName} className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-[#0a0a0a]">
                            {CRITERIA_LABEL[row.criteriaName] ?? row.criteriaName}
                          </span>
                          <span className="font-semibold text-[#ca3500]">
                            {row.score.toFixed(1)} / 5.0
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-[#f5f5f5]">
                          <div
                            className="h-full bg-[#f03f02]"
                            style={{ width: `${(row.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="h-px bg-[#e5e5e5]" />
                    <div className="flex justify-between text-sm">
                      <span className="text-[#737373]">Company average</span>
                      <span className="font-semibold text-[#0a0a0a]">
                        {data.companyAverage == null
                          ? "—"
                          : `${data.companyAverage.toFixed(1)} / 5.0`}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
              {data.feedback && (
                <section className={`${CARD} flex flex-col gap-4 py-4`}>
                  <div className="px-4">
                    <h2 className="flex items-center gap-2 text-base font-medium text-[#0a0a0a]">
                      <MessageSquareText className="size-4 text-[#f54900]" />
                      Feedback from {data.reviewer?.name ?? "your manager"}
                    </h2>
                    <p className="text-sm text-[#737373]">
                      {data.reviewer?.department ?? "Manager"}
                      {data.publishedAt
                        ? ` · Shared with you on ${formatPublished(data.publishedAt)}`
                        : ""}
                    </p>
                  </div>
                  <blockquote className="border-l-2 border-[#e5e5e5] px-4 text-sm leading-7 text-[#0a0a0a]">
                    “{data.feedback}”
                  </blockquote>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
