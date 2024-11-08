import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/photo-gallery";
import { getPhotos } from "@/queries/flickr";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "hisbaan • photos",
  description: "Personal website of Hisbaan Noorani",
};

export default async function Page(
  props: {
    params: Promise<{ photosetId: string; photoId: string }>;
  }
) {
  const params = await props.params;
  const photoset = await getPhotos(params.photosetId);
  if (!photoset) {
    return notFound();
  }

  return (
    <>
      <main className="flex flex-grow flex-col items-center gap-10">
        <PhotoGallery
          photosetId={params.photosetId}
          photos={photoset.photo}
          selectedPhotoId={params.photoId}
        />
      </main>
    </>
  );
}
