import { ArticleWithSlug } from "@/lib/articles"
import { formatDate } from "@/lib/date"
import Link from "next/link"

export function ArticleList({
  articles,
  showDescription,
}: {
  articles: ArticleWithSlug[]
  showDescription: boolean
}) {
  return articles.map((article) => {
    return (
      <div key={article.title} className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <Link
            className="font-semibold underline decoration-neutral-500 transition-colors hover:decoration-neutral-400"
            href={article.slug}
          >
            {article.title}
          </Link>
          {formatDate(new Date(article.date))}
        </div>
        {showDescription ? article.description : null}
      </div>
    )
  })
}
