import { AlbumnList } from "@/components/albumn-list";
import { getAlbumns } from "@/queries/photos";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "hisbaan • photos",
  description: "Personal website of Hisbaan Noorani",
};

export const revalidate = 86400;

export default async function Photos() {
  const albumns = await getAlbumns();
  if (!albumns) {
    return <h1>500 - Internal server error. Please try again later</h1>
  }

  return (
    <>
      <main className="flex flex-col items-center gap-10">
        <h1 className="w-full">Photos</h1>
        <AlbumnList albumns={albumns} />
      </main>
    </>
  );
}
