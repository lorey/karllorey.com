import Link from "next/link";

export default function Header() {
  return (
    <header className="text-left md:text-center py-8 md:py-16">
      <div className="title py-2 md:py-4 ml-[-0.05em] md:ml-0">
        <Link href="/">Karl Lorey</Link>
      </div>
      <nav className="my-2 md:my-5">
        <ul className="flex flex-wrap justify-start md:justify-center gap-4">
          <li>
            <Link href="/human">Human</Link>
          </li>
          <li>
            <Link href="/founder">Founder</Link>
          </li>
          <li>
            <Link href="/portfolio">Builder</Link>
          </li>
          <li>
            <Link href="/techie">Techie</Link>
          </li>
          <li>
            <Link href="/vc">Investor</Link>
          </li>
          <li>
            <Link href="/blog">Lorey Ipsum</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
