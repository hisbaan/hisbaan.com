import Link from "next/link"

export default function TopNav() {
  return (
    <>
      <div className="flex h-20 w-full items-center justify-between text-neutral-500">
        <Link href="/">hisbaan noorani</Link>
        <div className="flex gap-5">
          <Link href="/">home</Link>
          <Link href="/articles">blog</Link>
        </div>
      </div>
    </>
  )
}
