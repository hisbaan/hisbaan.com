import { ArticleWithSlug } from "@/lib/articles";
import "@/styles/highlight-js/github-dark.css";
import { formatDate } from "@/lib/date";
import MainLayout from "./main-layout";

export function ArticleLayout({
  article,
  children,
}: {
  article: ArticleWithSlug;
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <div className="border-l-2 border-l-neutral-400 pl-2">
          {formatDate(new Date(article.date))}
        </div>
        <h1 className="text-3xl">{article.title}</h1>
        {children}
      </div>
    </MainLayout>
  );
}
