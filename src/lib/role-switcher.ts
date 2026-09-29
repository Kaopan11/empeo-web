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
  {
    id: "a1000000-0000-4000-8000-000000000021",
    name: "Ivy",
    role: "Employee",
    initials: "IV",
    department: "Sales",
  },
  {
    id: "a1000000-0000-4000-8000-000000000018",
    name: "Hiro",
    role: "Employee",
    initials: "HI",
    department: "Engineering",
  },
];

export const ACTOR_GROUPS: { label: string; roles: Actor["role"][] }[] = [
  { label: "HR Views", roles: ["HR"] },
  { label: "Manager Views", roles: ["Manager"] },
  { label: "Employee Views", roles: ["Employee"] },
];

export function actorById(id: string | null): Actor {
  return ACTORS.find((actor) => actor.id === id) ?? ACTORS[0];
}

let currentId = ACTORS[0].id;

export function currentUserId() {
  return currentId;
}

export function selectActor(id: string) {
  const actor = actorById(id);
  currentId = actor.id;
  return actor;
}
