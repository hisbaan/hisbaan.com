"use client"

import { ArticleList } from "@/components/article-list"
import { ArticleWithSlug } from "@/lib/articles"
import { useMemo, useState } from "react"

export default function Articles(props: { articles: ArticleWithSlug[] }) {
  // TODO maybe make this a set?
  const [currentTags, setCurrentTags] = useState<string[]>([])

  function toggleTag(tag: string) {
    if (currentTags.includes(tag)) {
      setCurrentTags(currentTags.filter((t) => t !== tag))
    } else {
      setCurrentTags([...currentTags, tag])
    }
  }

  const allTags: Set<string> = new Set()
  props.articles.forEach((article) => {
    article.tags.forEach((tag) => allTags.add(tag))
  })

  const filteredArticles: ArticleWithSlug[] = useMemo(() => {
    if (currentTags.length === 0) {
      return props.articles
    }
    return props.articles.filter((article) => {
      return currentTags.every((tag) => article.tags.includes(tag))
    })
  }, [currentTags, props.articles])

  return (
    <>
      <div className="flex w-full cursor-pointer flex-wrap gap-5">
        {[...allTags].map((tag: string) => {
          return (
            <div
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`decoration-neutral-500 transition-colors hover:text-neutral-300 hover:decoration-neutral-400 ${currentTags.includes(tag) ? "underline" : "text-neutral-400"}`}
            >
              {tag}
            </div>
          )
        })}
      </div>
      <div className="flex w-full flex-col gap-10">
        {filteredArticles.length ? (
          <ArticleList articles={filteredArticles} showDescription={true} />
        ) : (
          <div className="w-full text-center">
            <div className="text-xl font-semibold">Nothing to see here!</div>
            <div className="text-sm text-neutral-400">
              Try removing some filters
            </div>
          </div>
        )}
      </div>
    </>
  )
}
