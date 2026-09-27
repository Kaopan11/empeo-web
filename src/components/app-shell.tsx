"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "@/lib/api";
import {
  ACTORS,
  type Actor,
  loadActor,
  selectActor,
} from "@/lib/role-switcher";

const RoleSwitcherContext = createContext<{
  actor: Actor;
  select: (id: string) => void;
} | null>(null);

export function useRoleSwitcher() {
  const value = useContext(RoleSwitcherContext);
  if (!value) throw new Error("useRoleSwitcher must be used inside AppShell");
  return value;
}

function RoleSwitcherProvider({ children }: { children: ReactNode }) {
  const [actor, setActor] = useState(ACTORS[0]);

  useEffect(() => {
    setActor(loadActor());
  }, []);

  return (
    <RoleSwitcherContext.Provider
      value={{
        actor,
        select: (id) => setActor(selectActor(id)),
      }}
    >
      {children}
    </RoleSwitcherContext.Provider>
  );
}

function pageFor(role: Actor["role"]) {
  if (role === "HR") return "/hr";
  if (role === "Employee") return "/employee";
  return "/manager";
}

function Header() {
  const router = useRouter();
  const { actor, select } = useRoleSwitcher();
  const sharedRole = ACTORS.filter((person) => person.role === actor.role).length > 1;

  return (
    <header className="border-b border-[#e5e5e5] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-[14px] bg-[#f54900] shadow-sm">
            <img src="/brand/logo-mark.svg" alt="" width={16} height={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold tracking-[-0.35px] text-[#0a0a0a]">
                empeo <span className="text-[#f54900]">Review</span>
              </p>
              <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-normal text-[#171717]">
                Annual Review 2026
              </span>
            </div>
            <p className="text-[11px] font-normal text-[#737373]">
              People performance workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-[10px] border border-[#e5e5e5] bg-[#f5f5f5]/40 px-3 py-1.5 text-xs font-normal text-[#737373]">
            <span className="size-2 rounded-full bg-[#00bc7d]" />
            Cycle active
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-56 cursor-pointer items-center justify-between rounded-[10px] border border-[#e5e5e5]/70 bg-white px-2.5 text-xs font-normal text-[#0a0a0a] shadow-sm outline-none">
              {sharedRole ? `${actor.role} · ${actor.name}` : actor.role}
              <ChevronDownIcon className="size-4 text-[#737373]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {ACTORS.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => {
                    select(option.id);
                    router.push(pageFor(option.role));
                  }}
                >
                  {option.role} · {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            title={actor.name}
            className="flex size-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-[#fff7ed] text-xs font-semibold text-[#ca3500]"
          >
            {actor.initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <RoleSwitcherProvider>
      <Header />
      {children}
    </RoleSwitcherProvider>
  );
}
