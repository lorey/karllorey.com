import Link from "next/link";
import { Project } from "@/types";

interface LatestProjectsProps {
  projects: Project[];
  limit?: number;
}

export default function LatestProjects({
  projects,
  limit = 4,
}: LatestProjectsProps) {
  const displayProjects = projects.slice(0, limit);

  if (displayProjects.length === 0) {
    return null;
  }

  return (
    <>
      <h2>Latest Projects</h2>
      <p>
        What I&apos;m working on currently, more at{" "}
        <Link href="/portfolio" className="whitespace-nowrap">
          /portfolio
        </Link>
        .
      </p>
      <div className="space-y-3 mb-5">
        {displayProjects.map((project) => (
          <div
            key={project.slug}
            className="border border-gray-200 rounded p-3"
          >
            <div className="font-medium text-gray-700">
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
            </div>
            <div className="text-sm">{project.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}
