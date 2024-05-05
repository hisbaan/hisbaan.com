import { getAllArticles } from "@/lib/articles"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = (await getAllArticles()).map((article) => {
    return {
      url: "https://hisbaan.com" + article.slug,
      lastModified: new Date(article.date),
      priority: 0.8,
    }
  })

  return [
    {
      url: "https://hisbaan.com",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://hisbaan.com/articles",
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: "https://hisbaan.com/disclaimer",
      lastModified: new Date(),
      priority: 0.7,
    },
    ...articles,
  ]
}
