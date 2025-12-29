export type ProjectType = "venture" | "product" | "library" | "experiment";

export interface Post {
  title: string;
  slug: string;
  date: string;
  description?: string;
}

export interface Project {
  title: string;
  slug: string;
  description: string;
  url: string | null;
  github: string | null;
  type: ProjectType;
  launchYear: number | null;
}
