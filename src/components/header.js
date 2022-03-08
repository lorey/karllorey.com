import React from 'react'
import {Link} from "gatsby"

export default function Header() {
    return (
        <header className="text-center py-16">
            <a className="title" href="/">Karl Lorey</a>
            <nav className="my-5">
                <ul className="md:flex justify-center gap-4">
                    <li>
                        <a href="/human/">Human</a>
                    </li>
                    <li>
                        <a href="/founder/">Founder</a>
                    </li>
                    <li>
                        <a href="/portfolio/">Maker</a>
                    </li>
                    <li>
                        <a href="/techie/">Techie</a>
                    </li>
                    <li>
                        <a href="/vc/">Investor</a>
                    </li>
                    <li>
                        <a href="/speaker/">Speaker</a>
                    </li>
                    <li>
                        <a href="/blog/">Lorey Ipsum</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
