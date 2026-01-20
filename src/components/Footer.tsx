import Link from "next/link";
import { IconType } from "react-icons";
import { formatDate } from "@/lib/date";
import {
  FaAngellist,
  FaBluesky,
  FaCube,
  FaGithub,
  FaGitlab,
  FaGoodreads,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaMeetup,
  FaProductHunt,
  FaResearchgate,
  FaXTwitter,
} from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";

interface SocialLink {
  name: string;
  url: string;
  icon: IconType;
}

const socialLinks: SocialLink[] = [
  { name: "GitHub", url: "https://github.com/lorey", icon: FaGithub },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/karllorey",
    icon: FaLinkedin,
  },
  { name: "X", url: "https://x.com/karllorey", icon: FaXTwitter },
  {
    name: "Bluesky",
    url: "https://bsky.app/profile/karllorey.bsky.social",
    icon: FaBluesky,
  },
  {
    name: "Crunchbase",
    url: "https://www.crunchbase.com/person/karl-lorey",
    icon: FaCube,
  },
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com/@karllorey",
    icon: FaProductHunt,
  },
  { name: "AngelList", url: "https://angel.co/karllorey", icon: FaAngellist },
  { name: "GitLab", url: "https://gitlab.com/lorey", icon: FaGitlab },
  {
    name: "Goodreads",
    url: "https://www.goodreads.com/karllorey",
    icon: FaGoodreads,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/karllorey",
    icon: FaInstagram,
  },
  { name: "Medium", url: "https://medium.com/@karllorey", icon: FaMedium },
  {
    name: "Substack",
    url: "https://substack.com/@karllorey",
    icon: SiSubstack,
  },
  {
    name: "Meetup",
    url: "https://www.meetup.com/members/196097665/",
    icon: FaMeetup,
  },
  {
    name: "ResearchGate",
    url: "https://www.researchgate.net/profile/Karl_Lorey",
    icon: FaResearchgate,
  },
];

export default function Footer() {
  return (
    <footer className="text-center text-sm py-10">
      {/* Contact section */}
      <p>
        Karl Lorey: founder, builder, investor living in Germany.
        <br />
        Reach me at mail (at) karllorey (dot) com or find me here:
      </p>

      {/* Social links */}
      <p className="flex justify-center gap-4 flex-wrap text-lg mt-4">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.name}
          >
            <link.icon className="inline" />
          </a>
        ))}
      </p>

      {/* Meta section */}
      <div className="mt-10 space-y-2">
        <p className="pb-0">
          <Link href="/legal">Legal</Link>
          {" · "}
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <Link href="https://github.com/lorey/karllorey.com">Source</Link>
        </p>
        <p className="pb-0">
          © 2025 Karl Lorey.
          {process.env.NEXT_PUBLIC_COMMIT_SHA && (
            <>
              {" "}
              Updated{" "}
              {process.env.NEXT_PUBLIC_COMMIT_DATE
                ? formatDate(process.env.NEXT_PUBLIC_COMMIT_DATE)
                : "Unknown"}{" "}
              ({process.env.NEXT_PUBLIC_COMMIT_SHA.slice(0, 7)})
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
