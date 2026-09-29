import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export default function CalibrationGuidePage() {
  return (
    <main className="flex-1 bg-[#fff7ed]/20 px-8 py-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <nav className="flex items-center gap-2 text-xs text-[#737373]">
          <LayoutGrid className="size-3.5" />
          <span>Workspace</span>
          <span>/</span>
          <Link href="/hr" className="hover:text-[#0a0a0a]">
            HR Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-[#0a0a0a]">Calibration guide</span>
        </nav>
        <h1 className="text-[30px] leading-9 font-semibold tracking-[-0.75px] text-[#0a0a0a]">
          Calibration guide
        </h1>
        <div className="flex flex-col gap-4 text-sm leading-6 text-[#737373]">
          <p>
            Calibration is how HR and managers agree what a score means across
            teams, so a 4 in Engineering is comparable to a 4 in Sales.
          </p>
          <ol className="list-decimal space-y-3 pl-5 text-[#0a0a0a]">
            <li>
              Start from the distribution chart. Most people should sit in Core.
              A tall High or Low bar usually means one team is scoring on a
              different scale.
            </li>
            <li>
              Check the manager bias index. Positive σ is more generous than
              the company mean; negative is stricter. Talk to outliers before
              you publish.
            </li>
            <li>
              Resolve overdue reviews first so unfinished people are not left
              out of the curve. Incomplete drafts stay unlocked; complete
              scores enter fairness like a normal submit.
            </li>
            <li>
              Use confidence and calibration spread as a sanity check, not a
              grade. Low confidence usually means too few submitted reviews.
            </li>
          </ol>
          <p>This page is a mock. There is no PDF or CMS behind it.</p>
        </div>
        <Link href="/hr" className="text-sm font-medium text-[#f54900]">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
