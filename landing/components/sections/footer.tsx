"use client"

import Link from "next/link"
import { Mail, Globe } from "lucide-react"

export default function Footer() {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "About", href: "#about" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Benefits", href: "#benefits" },
        { name: "Roadmap", href: "#roadmap" },
      ],
    },
    {
      title: "Contact",
      links: [
        {
          name: "mintellectproject@gmail.com",
          href: "mailto:mintellectproject@gmail.com",
          icon: <Mail className="h-4 w-4 mr-2" />,
        },
        {
          name: "mintellect.xyz",
          href: "https://www.mintellect.xyz",
          icon: <Globe className="h-4 w-4 mr-2" />,
        },
      ],
    },
  ]

  return (
    <footer className="bg-primary-dark border-t border-ui-border pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent mb-6">
              Mintellect
            </h3>
            <p className="text-white/70 mb-6">
              Empowering researchers and preserving knowledge on-chain with blockchain technology.
            </p>
            <div>
              <a
                href="https://x.com/_Mintellect_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary-light transition-colors duration-300 inline-block"
                aria-label="X (formerly Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white/70 hover:text-primary-light transition-colors duration-300"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-primary-light transition-colors duration-300 flex items-center"
                    >
                      {link.icon && link.icon}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ui-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">&copy; {new Date().getFullYear()} Mintellect. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="https://x.com/_Mintellect_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-primary-light text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="https://x.com/_Mintellect_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-primary-light text-sm transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

