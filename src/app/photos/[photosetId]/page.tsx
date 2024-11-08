import { notFound } from "next/navigation";
import { Albumn } from "@/components/albumn";
import { getPhotos } from "@/queries/flickr";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "hisbaan • photos",
};

export default async function Page(
  props: {
    params: Promise<{ photosetId: string }>;
  }
) {
  const params = await props.params;
  const photoset = await getPhotos(params.photosetId);
  if (!photoset) {
    return notFound();
  }

  return (
    <>
      <main className="flex flex-col items-center gap-10">
        <h1 className="w-full">{photoset.title}</h1>
        <Albumn photoset={photoset} />
      </main>
    </>
  );
}
