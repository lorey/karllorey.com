import { Project, ProjectType } from "@/types";

interface ProjectListProps {
  projects: Project[];
  type?: ProjectType;
}

export default function ProjectList({ projects, type }: ProjectListProps) {
  let filteredProjects =
    type !== undefined ? projects.filter((p) => p.type === type) : projects;

  // Sort ventures by founding date (newest first)
  if (type === "venture") {
    filteredProjects = [...filteredProjects].sort((a, b) => {
      if (!a.launchYear || !b.launchYear) return 0;
      return b.launchYear - a.launchYear;
    });
  }

  if (filteredProjects.length === 0) {
    return null;
  }

  return (
    <div>
      {filteredProjects.map((project) => (
        <div key={project.slug} className="mb-5">
          <div>
            {project.url || project.github ? (
              <a
                href={(project.url || project.github) as string}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
            {project.launchYear && ` (${project.launchYear})`}
          </div>
          <div>{project.description}</div>
        </div>
      ))}
    </div>
  );
}
