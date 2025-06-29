import { getAllArticles } from "@/lib/articles";
import Articles from "@/components/articles-with-tags";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "hisbaan • articles",
  description: "Personal website of Hisbaan Noorani",
};

export default async function Blog() {
  const articles = await getAllArticles();

  return (
    <>
      <h1 className="w-full">Blog</h1>
      <Articles articles={articles} />
    </>
  );
}
