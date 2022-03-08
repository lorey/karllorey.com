import React from 'react'
import {Link} from "gatsby"

export default function Footer() {
    return (
        <footer className="text-center text-sm py-10">
            <p className="">I'm Karl Lorey–Techie, Founder, and Investor living in Karlsruhe, Germany. Let's get in touch.</p>
            <p className="lead socials">
                <a href="https://angel.co/karllorey" target="_blank"><i className="fab fa-angellist"></i></a>
                <a href="https://www.crunchbase.com/person/karl-lorey" target="_blank"><i className="fas fa-cube"></i></a>
                <a href="https://github.com/lorey" target="_blank"><i className="fab fa-github"></i></a>
                <a href="https://gitlab.com/lorey" target="_blank"><i className="fab fa-gitlab"></i></a>
                <a href="https://www.goodreads.com/karllorey" target="_blank"><i className="fab fa-goodreads"></i></a>
                <a href="https://www.instagram.com/karllorey" target="_blank"><i className="fab fa-instagram"></i></a>
                <a href="https://www.linkedin.com/in/karllorey" target="_blank"><i className="fab fa-linkedin"></i></a>
                <a href="https://medium.com/@karllorey" target="_blank"><i className="fab fa-medium"></i></a>
                <a href="https://www.meetup.com/members/196097665/" target="_blank"><i className="fab fa-meetup"></i></a>
                <a href="https://www.producthunt.com/@karllorey" target="_blank"><i className="fab fa-product-hunt"></i></a>
                <a href="https://www.researchgate.net/profile/Karl_Lorey" target="_blank"><i className="fab fa-researchgate"></i></a>
                <a href="https://twitter.com/karllorey" target="_blank"><i className="fab fa-twitter"></i></a>
            </p>
            <p className="mt-5">
                This site uses cookies and external services to improve your experience.<br/>
                At least if you don't refuse by sending <a href="http://randomwalker.info/donottrack-archive/" target="_blank">Do Not Track</a>.
            </p>
            <p className="mt-5">
                © Copyright 2022 Karl Lorey. <a href="http://karllorey.de/impressum" target="_blank">Legal/Imprint</a>.
            </p>
        </footer>
)
}