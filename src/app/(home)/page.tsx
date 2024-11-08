import { ArticleList } from "@/components/article-list"
import { getAllArticles } from "@/lib/articles"
import { Metadata } from "next"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa"

const projects: Array<{ title: string; description: string; url: string }> = [
  {
    title: "didyoumean",
    description: "A CLI spelling corrector written in Rust",
    url: "https://github.com/hisbaan/didyoumean",
  },
  {
    title: "binocularss",
    description: "An Android RSS reader built in Kotlin and Jetpack Compose",
    url: "https://github.com/tminions/binocularss",
  },
  {
    title: "dotfiles",
    description: "My custom linux configuration",
    url: "https://github.com/hisbaan/dotfiles",
  },
  {
    title: "sticky",
    description: "An Android app for scanning and organizing sticky notes",
    url: "https://github.com/hisbaan/sticky",
  },
  {
    title: "wikigraph",
    description:
      "A python library for processing and extrapolating data from wikipedia",
    url: "https://github.com/eamonma/wikigraph",
  },
  {
    title: "hisbaan.com",
    description: "This website written in React with NextJS",
    url: "https://github.com/hisbaan/hisbaan.com",
  },
]

export const metadata: Metadata = {
  title: "hisbaan • home",
  description: "Personal website of Hisbaan Noorani",
};

export default async function Home() {
  const articles = (await getAllArticles()).splice(0, 4)

  return (
    <>
      <main className="flex flex-col items-center gap-10">
        <div className="flex flex-col gap-3">
          <div className="w-full text-sm text-neutral-500">
            Hisbaan — IPA /hɪzbɑːn/
          </div>
          <div className="w-full">
            Hi there! I&apos;m <strong>Hisbaan</strong>. I&apos;m currently
            working as a Full Stack Developer at{" "}
            <a
              className="underline decoration-neutral-500 transition-colors hover:decoration-neutral-400"
              href="https://cocoflo.com"
            >
              Cocoflo
            </a>
            . I graduated from the University of Toronto with an HBSc in
            Computer Science. I enjoy <strong>programming</strong>,{" "}
            <strong>building</strong> things, and <strong>optimizing</strong> my
            environment.
          </div>
        </div>
        <div className="mx-auto self-center">
          <h2 className="mb-5">Projects</h2>
          <div className="grid grid-cols-2 justify-center gap-x-10 gap-y-5 sm:grid-cols-3">
            {projects.map((project) => {
              return (
                <div key={project.title}>
                  <a
                    className="font-semibold underline decoration-neutral-500 transition-colors hover:decoration-neutral-400"
                    href={project.url}
                  >
                    {project.title}
                  </a>
                  <div>{project.description}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="w-full">
          <h2 className="mb-5">Blog</h2>
          <div className="flex flex-col gap-3">
            <ArticleList articles={articles} showDescription={false} />
            <div className="flex cursor-pointer items-center gap-1">
              <Link
                className="underline decoration-neutral-500 transition-colors hover:decoration-neutral-400"
                href="articles"
              >
                See More
              </Link>
              <FaChevronRight />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
