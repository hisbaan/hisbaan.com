import { AlbumnList } from "@/components/albumn-list";
import { getPhotosets } from "@/queries/flickr";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "hisbaan • photos",
};

export default async function Photos() {
  const photosets = await getPhotosets();
  if (!photosets) {
    return <h1>500 - Internal server error. Please try again later</h1>
  }

  return (
    <>
      <main className="flex flex-col items-center gap-10">
        <h1 className="w-full">Photos</h1>
        <AlbumnList photosets={photosets} />
      </main>
    </>
  );
}
