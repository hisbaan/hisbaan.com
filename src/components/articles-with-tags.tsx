"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ArticleList } from "@/components/article-list";
import { useTags } from "@/hooks/use-tags";
import { ArticleWithSlug } from "@/lib/articles";
import { Tags } from "./tags";

export default function Articles(props: { articles: ArticleWithSlug[] }) {
  return <Suspense>
    <ArticlesContent articles={props.articles} />
  </Suspense>
}

function ArticlesContent(props: { articles: ArticleWithSlug[]}) {
  const { currentTags, allTags, toggleTag, hasAllSelectedTags } = useTags({
    allTags: [...new Set(props.articles.flatMap((article) => article.tags))],
    initialTags: useSearchParams().getAll("tag"),
  });

  const filteredArticles: ArticleWithSlug[] = useMemo(() => {
    return props.articles.filter((article) => hasAllSelectedTags(article.tags));
  }, [props.articles, hasAllSelectedTags]);

  return (
    <>
      <Tags allTags={allTags} currentTags={currentTags} toggleTag={toggleTag} />
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
  );
}
