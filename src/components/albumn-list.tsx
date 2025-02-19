import { constructPhotoUrl } from "@/lib/flickr";
import { FlickrPhotosets } from "@/queries/flickr";
import Image from "next/image";
import Link from "next/link";

export async function AlbumnList(props: { photosets: FlickrPhotosets }) {
  return (
    <div className="flex w-full flex-row flex-wrap gap-6">
      {props.photosets.photoset.map((photoset) => (
        <Link
          key={photoset.id}
          href={`photos/${photoset.id}`}
          className="flex flex-col items-center"
        >
          <Image
            className="h-[250px] w-[250px] rounded-lg object-cover pb-1"
            alt={photoset.title._content}
            src={constructPhotoUrl({
              server: photoset.server,
              id: photoset.primary,
              secret: photoset.secret,
            })}
            width={250}
            height={250}
          />
          <h3>{photoset.title._content}</h3>
        </Link>
      ))}
    </div>
  );
}
