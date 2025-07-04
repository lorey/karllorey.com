import Link from 'next/link'

export default function Header() {
    return (
        <header className="text-center py-16">
            <div className="title py-4">
                <Link href="/">Karl Lorey</Link>
            </div>
            <nav className="my-5">
                <ul className="md:flex justify-center gap-4">
                    <li>
                        <Link href="/human">Human</Link>
                    </li>
                    <li>
                        <Link href="/founder">Founder</Link>
                    </li>
                    <li>
                        <Link href="/portfolio">Maker</Link>
                    </li>
                    <li>
                        <Link href="/techie">Techie</Link>
                    </li>
                    <li>
                        <Link href="/vc">Investor</Link>
                    </li>
                    <li>
                        <Link href="/speaker">Speaker</Link>
                    </li>
                    <li>
                        <Link href="/blog">Lorey Ipsum</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}