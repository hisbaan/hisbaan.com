import { getImageUrl } from "@/lib/uploadthing";
import { AlbumnWithPhotos } from "@/queries/photos";
import Image from "next/image";
import Link from "next/link";

export async function AlbumnList(props: { albumns: AlbumnWithPhotos[] }) {
  return (
    <div className="flex w-full flex-row flex-wrap gap-6">
      {props.albumns.map((albumn) => (
        <Link
          key={albumn.id}
          href={`photos/${albumn.id}`}
          className="flex flex-col items-center"
        >
          <Image
            className="h-[250px] w-[250px] rounded-lg object-cover pb-1"
            alt={albumn.name}
            src={getImageUrl(albumn.photos[0].key)}
            width={250}
            height={250}
          />
          <h3>{albumn.name}</h3>
        </Link>
      ))}
    </div>
  );
}
