"use client";

import { constructPhotoUrl } from "@/lib/flickr";
import { FlickrPhotosets } from "@/queries/flickr";
import Image from "next/image";
import Link from "next/link";

export async function AlbumnList(props: { photosets: FlickrPhotosets }) {
  return (
    <div className="w-full flex flex-row flex-wrap">
      {props.photosets.photoset.map((photoset) => (
        <Link key={photoset.id} href={`photos/${photoset.id}`} className="flex flex-col items-center">
          <Image
            className="rounded-lg pb-1"
            alt={photoset.title._content}
            src={constructPhotoUrl({
              server: photoset.server,
              id: photoset.primary,
              secret: photoset.secret,
              size: "q", // TODO maybe get a slightly larger size, this feels small. Keep it square though
            })}
            width={150}
            height={150}
          />
          <h3>{photoset.title._content}</h3>
        </Link>
      ))}
    </div>
  );
}
