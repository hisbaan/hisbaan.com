import nextMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      {
        hostname: "live.staticflickr.com",
      },
      {
        hostname: `${process.env.UPLOADTHING_APP_ID!}.ufs.sh`,
        pathname: "/f/*",
      }
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

export default withMDX(nextConfig);
