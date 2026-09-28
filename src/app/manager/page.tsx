"use client";

import { LayoutGrid } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  CRITERIA,
  evaluationSchema,
  isLenient,
  type EvaluationInput,
} from "@/lib/evaluation-form";
import { api } from "@/lib/api";
import { useRoleSwitcher } from "@/components/app-shell";

const STATUS_LABEL = {
  PENDING: "Pending",
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
} as const;

type TeamMember = {
  userId: string;
  name: string;
  status: "PENDING" | "DRAFT" | "SUBMITTED";
};

export default function ManagerPage() {
  const { actor } = useRoleSwitcher();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const form = useForm<EvaluationInput>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { technical: "", collaboration: "", feedback: "" },
  });
  const scores = form.watch(["technical", "collaboration"]);
  const submitted = members.filter((person) => person.status === "SUBMITTED").length;

  useEffect(() => {
    let ignore = false;
    setMembers([]);
    setMember(null);
    setLoadError("");
    api
      .get<{ members: TeamMember[] }>(
        "http://localhost:4000/api/evaluations/team",
        { params: { managerId: actor.id } },
      )
      .then((response) => {
        if (ignore) return;
        setMembers(response.data.members);
        setMember(response.data.members[0] ?? null);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        const message = axios.isAxiosError(error)
          ? String(error.response?.data?.error ?? error.message)
          : "Could not load the team";
        setLoadError(message);
      });
    return () => {
      ignore = true;
    };
  }, [actor.id]);

  return (
    <main className="flex-1 bg-[#fff7ed]/20 px-8 py-8">
      <div className="mx-auto flex w-full max-w-344 flex-col gap-8">
        <nav className="flex items-center gap-2 text-xs text-[#737373]">
          <LayoutGrid className="size-3.5" />
          <span>Workspace</span>
          <span>/</span>
          <span className="font-medium text-[#0a0a0a]">Manager</span>
        </nav>
        <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-[1.92px] text-[#f54900] uppercase">
              Manager workspace · {actor.department}
            </p>
            <h1 className="text-3xl leading-9 font-semibold tracking-[-0.75px] text-[#0a0a0a]">
              Your team reviews
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[#737373]">
              Complete thoughtful, evidence-based evaluations before the
              calibration deadline on 30 Nov 2026.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-[10px] border border-[#e5e5e5] bg-white px-3 py-2 text-xs">
            <img src="/icons/reports.svg" alt="" width={16} height={16} />
            <span className="font-semibold text-[#0a0a0a]">{members.length}</span>
            <span className="text-[#737373]">direct reports</span>
          </div>
        </div>
        <div className="flex items-start gap-6">
          <aside className="flex w-70 shrink-0 flex-col gap-4 rounded-[18px] bg-white py-4 shadow-[0px_0px_0px_1px_rgba(10,10,10,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-1 px-4">
              <h2 className="text-[15.8px] leading-6 font-medium text-[#0a0a0a]">
                Team members
              </h2>
              <p className="text-[13.9px] leading-5 text-[#737373]">
                {loadError || `${submitted} of ${members.length} submitted`}
              </p>
            </div>
            <div className="flex flex-col gap-2 px-4">
              {members.map((person) => {
                const selected = person.userId === member?.userId;
                return (
                  <button
                    key={person.userId}
                    type="button"
                    onClick={() => setMember(person)}
                    className={`flex h-15.5 w-full cursor-pointer items-center gap-3 rounded-[14px] px-3 text-left ${selected ? "bg-[#fff7ed] shadow-[0px_0px_0px_1px_#ffd6a7]" : ""}`}
                  >
                    <span className="flex size-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-[#f5f5f5] text-xs font-semibold text-[#737373]">
                      {person.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="block text-sm leading-5 font-medium text-[#0a0a0a]">
                        {person.name}
                      </span>
                      <span className="block text-xs leading-4 text-[#737373]">
                        {STATUS_LABEL[person.status]}
                      </span>
                    </span>
                    <img
                      src={
                        person.status === "SUBMITTED"
                          ? "/icons/submitted.svg"
                          : "/icons/chevron.svg"
                      }
                      alt=""
                      width={16}
                      height={16}
                      className={person.status === "SUBMITTED" ? "" : "-rotate-90"}
                    />
                  </button>
                );
              })}
            </div>
          </aside>
          <section className="min-w-0 flex-1 overflow-hidden rounded-[18px] bg-white py-4 shadow-[0px_0px_0px_1px_rgba(10,10,10,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between px-4">
          <div>
            <h2 className="text-base leading-6 font-medium text-[#0a0a0a]">
              Evaluation · {member?.name ?? "—"}
            </h2>
            <p className="text-sm leading-5 text-[#737373]">
              Use specific examples and observable behaviors to support your
              rating.
            </p>
          </div>
          <span className="rounded-full border border-[#fee685] bg-[#fffbeb] px-2 py-0.5 text-xs font-medium text-[#bb4d00]">
            {member ? STATUS_LABEL[member.status] : "—"}
          </span>
        </div>
        <form
          className="mt-4"
          onSubmit={form.handleSubmit(() => setNotice("ผ่านการตรวจแล้ว"))}
        >
          <div className="flex flex-col gap-7 px-4">
            {CRITERIA.map((criterion) => (
              <fieldset key={criterion.name} className="w-full min-w-0 border-0 p-0">
                <div className="mb-2 flex w-full items-center justify-between">
                  <span className="text-sm leading-5 font-semibold text-[#0a0a0a]">
                    {criterion.label}
                  </span>
                  <span className="text-xs leading-4 font-medium text-[#737373]">
                    50%
                  </span>
                </div>
                <Controller
                  name={criterion.name}
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-label={criterion.label}
                      className="grid grid-cols-5 gap-2"
                    >
                      {criterion.anchors.map((anchor, index) => {
                        const score = String(index + 1);
                        return (
                          <label
                            key={anchor}
                            className="flex h-22 cursor-pointer flex-col items-center justify-center gap-1 rounded-[14px] border border-[#e5e5e5] px-3 text-center text-[#0a0a0a] has-data-checked:border-[#ff6900] has-data-checked:bg-[#fff7ed] has-data-checked:text-[#7e2a0c] has-data-checked:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
                          >
                            <RadioGroupItem value={score} className="sr-only" />
                            <span className="text-lg leading-7 font-semibold">
                              {score}
                            </span>
                            <span className="text-xs leading-4 text-[#737373]">
                              {anchor}
                            </span>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  )}
                />
                {form.formState.errors[criterion.name] && (
                  <p className="mt-2 text-xs text-destructive">
                    {form.formState.errors[criterion.name]?.message}
                  </p>
                )}
              </fieldset>
            ))}
            {isLenient({ technical: scores[0], collaboration: scores[1] }) && (
              <div className="grid grid-cols-[16px_1fr] gap-x-2 gap-y-0.5 rounded-[10px] border border-[#fee685] bg-[#fffbeb] px-2.5 py-2">
                <img src="/icons/leniency.svg" alt="" width={16} height={16} />
                <p className="text-sm leading-5 font-medium text-[#7b3306]">
                  High leniency detected
                </p>
                <p className="col-start-2 text-sm leading-5 text-[#973c00]">
                  This rating is above the company benchmark. Add evidence or
                  consider if the behavior is consistently demonstrated.
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label htmlFor="feedback" className="text-sm font-medium text-[#0a0a0a]">
                  Constructive feedback
                </label>
                <span className="text-xs text-[#737373]">
                  Required when both ratings are 5
                </span>
              </div>
              <Textarea
                id="feedback"
                placeholder="Share the impact, context, and a practical next step..."
                className="min-h-28 rounded-[10px] border-[#e5e5e5] text-sm"
                {...form.register("feedback")}
              />
              {form.formState.errors.feedback && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.feedback.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-[#e5e5e5] bg-[#f5f5f5]/20 p-4">
            {notice && <p className="mr-auto text-sm">{notice}</p>}
            <Button
              type="button"
              variant="outline"
              className="h-7.5 cursor-pointer rounded-[10px] border-[#e5e5e5] bg-white px-2.5 text-sm font-medium text-[#0a0a0a]"
              onClick={() => setNotice("Draft saved")}
            >
              Save draft
            </Button>
            <Button
              type="submit"
              className="h-7.5 cursor-pointer gap-1.5 rounded-[10px] bg-[#f54900] px-2.5 text-sm font-medium text-[#fafafa] hover:bg-[#f54900]/90"
            >
              Submit evaluation
              <img src="/icons/submit.svg" alt="" width={16} height={16} />
            </Button>
          </div>
        </form>
          </section>
        </div>
        </div>
      </div>
    </main>
  );
}
