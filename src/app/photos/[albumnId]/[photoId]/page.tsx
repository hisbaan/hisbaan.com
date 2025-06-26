import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/photo-gallery";

import { Metadata } from "next";
import { getPhotosByAlbumn } from "@/queries/photos";

export const metadata: Metadata = {
  title: "hisbaan • photos",
  description: "Personal website of Hisbaan Noorani",
};

export default async function Page(props: {
  params: Promise<{ albumnId: string; photoId: string }>;
}) {
  const params = await props.params;
  const photos = await getPhotosByAlbumn(params.albumnId);
  if (photos.length === 0) {
    return notFound();
  }

  return (
    <>
      <main className="flex grow flex-col items-center gap-10">
        <PhotoGallery
          albumnId={params.albumnId}
          photos={photos}
          selectedPhotoId={params.photoId}
        />
      </main>
    </>
  );
}
