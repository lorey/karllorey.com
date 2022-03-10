import React from 'react'
import {Link} from 'gatsby'
import {FaAngellist, FaCube, FaGithub, FaGitlab, FaGoodreads, FaInstagram, FaLinkedin, FaMedium, FaMeetup, FaProductHunt, FaResearchgate, FaTwitter} from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="text-center text-sm py-10">
            <p className="">I'm Karl Lorey–Techie, Founder, and Investor living in Karlsruhe, Germany.<br/>Let's get in touch.</p>
            <p className="flex justify-center gap-5 flex-wrap text-xl">
                <a href="https://angel.co/karllorey" target="_blank"><FaAngellist className="inline" /></a>
                <a href="https://www.crunchbase.com/person/karl-lorey" target="_blank"><FaCube className="inline" /></a>
                <a href="https://github.com/lorey" target="_blank"><FaGithub className="inline" /></a>
                <a href="https://gitlab.com/lorey" target="_blank"><FaGitlab className="inline" /></a>
                <a href="https://www.goodreads.com/karllorey" target="_blank"><FaGoodreads className="inline" /></a>
                <a href="https://www.instagram.com/karllorey" target="_blank"><FaInstagram className="inline" /></a>
                <a href="https://www.linkedin.com/in/karllorey" target="_blank"><FaLinkedin className="inline" /></a>
                <a href="https://medium.com/@karllorey" target="_blank"><FaMedium className="inline" /></a>
                <a href="https://www.meetup.com/members/196097665/" target="_blank"><FaMeetup className="inline" /></a>
                <a href="https://www.producthunt.com/@karllorey" target="_blank"><FaProductHunt className="inline" /></a>
                <a href="https://www.researchgate.net/profile/Karl_Lorey" target="_blank"><FaResearchgate className="inline" /></a>
                <a href="https://twitter.com/karllorey" target="_blank"><FaTwitter className="inline" /></a>
            </p>
            <p className="mt-5">
                This site does not use cookies or other services to improve your experience.<br/>
                No data is stored.
            </p>
            <p className="mt-5">
                © Copyright 2022 Karl Lorey.<br />
                <Link to="/legal">Legal/Imprint</Link>. <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </footer>
)
}