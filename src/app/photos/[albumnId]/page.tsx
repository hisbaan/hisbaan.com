import { notFound } from "next/navigation";
import { Albumn } from "@/components/albumn";

import { Metadata } from "next";
import { getAlbumn } from "@/queries/photos";

export const metadata: Metadata = {
  title: "hisbaan • photos",
  description: "Personal website of Hisbaan Noorani",
};

export default async function Page(props: {
  params: Promise<{ albumnId: string }>;
}) {
  const params = await props.params;
  const albumn = await getAlbumn(params.albumnId);
  if (!albumn) {
    return notFound();
  }

  return (
    <>
      <h1 className="w-full">{albumn.name}</h1>
      <Albumn albumn={albumn} />
    </>
  );
}
