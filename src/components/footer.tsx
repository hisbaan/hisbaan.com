import Link from "next/link"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { MdMail } from "react-icons/md"

export default function Footer() {
  return (
    <div className="flex flex-col gap-2 border-t border-t-neutral-600 py-3">
      <div className="flex items-center justify-between text-neutral-400">
        <Link href="/">hisbaan noorani</Link>
        <div className="flex gap-5">
          <a href="https://github.com/hisbaan">
            <FaGithub />
          </a>
          <a href="https://twitter.com/hisbaannoorani">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/in/hisbaan">
            <FaLinkedin />
          </a>
          <a href="mailto:hisbaan@gmail.com">
            <MdMail />
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <div className="flex flex-col">
          <div>&copy; {new Date().getFullYear()} Hisbaan Noorani</div>
          <div>All Rights Reserved</div>
        </div>
        <Link href="/disclaimer">disclaimer</Link>
      </div>
    </div>
  )
}
