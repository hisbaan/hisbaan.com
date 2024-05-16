import Link from "next/link"

export default function TopNav() {
  return (
    <>
      <div className="flex h-20 w-full items-center justify-between text-neutral-500">
        <Link className="transition-colors hover:text-neutral-400" href="/">
          hisbaan noorani
        </Link>
        <div className="flex gap-5">
          <Link className="transition-colors hover:text-neutral-400" href="/">
            home
          </Link>
          <Link
            className="transition-colors hover:text-neutral-400"
            href="/articles"
          >
            blog
          </Link>
        </div>
      </div>
    </>
  )
}
