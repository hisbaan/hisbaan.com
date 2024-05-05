import { getAllArticles } from "@/lib/articles"
import Head from "next/head"
import Articles from "@/components/articles-with-tags"

export default async function Blog() {
  const articles = await getAllArticles()

  return (
    <>
      <Head>
        <title>hisbaan noorani</title>
        <meta name="title" content="hisbaan • home"></meta>
        <meta
          name="description"
          content="Personal website of Hisbaan Noorani"
        ></meta>
        <link rel="icon" href="/img/favicon.webp" />
      </Head>
      <main className="flex flex-col items-center gap-10">
        <h1 className="w-full">Blog</h1>
        <Articles articles={articles} />
      </main>
    </>
  )
}
