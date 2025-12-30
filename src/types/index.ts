export type ProjectType = "venture" | "product" | "library" | "experiment";

export type PostStatus = "draft" | "archived" | "published" | "highlighted";

export interface Post {
  title: string;
  slug: string;
  date: string;
  description?: string;
  status?: PostStatus;
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
