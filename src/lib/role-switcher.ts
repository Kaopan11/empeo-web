export type Actor = {
  id: string;
  name: string;
  role: "HR" | "Manager" | "Employee";
  initials: string;
  department: string;
};

export const ACTORS: Actor[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "Nicha",
    role: "HR",
    initials: "NI",
    department: "People Ops",
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    name: "Somchai",
    role: "Manager",
    initials: "SO",
    department: "Engineering",
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    name: "Wichai",
    role: "Manager",
    initials: "WI",
    department: "Sales",
  },
  {
    id: "a1000000-0000-4000-8000-000000000011",
    name: "Alice",
    role: "Employee",
    initials: "AL",
    department: "Engineering",
  },
];

const STORAGE_KEY = "empeo-user-id";

export function actorById(id: string | null): Actor {
  return ACTORS.find((actor) => actor.id === id) ?? ACTORS[0];
}

let currentId = actorById(
  typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY),
).id;

export function currentUserId() {
  return currentId;
}

export function selectActor(id: string) {
  const actor = actorById(id);
  currentId = actor.id;
  localStorage.setItem(STORAGE_KEY, actor.id);
  return actor;
}

export function loadActor() {
  return selectActor(localStorage.getItem(STORAGE_KEY) ?? "");
}
