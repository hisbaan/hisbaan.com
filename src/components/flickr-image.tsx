import Image from "next/image";
import { MouseEventHandler } from "react";
import { constructPhotoUrl } from "@/lib/flickr";
import { FlickrPhoto, FlickrPhotoSize } from "@/queries/flickr";

export function FlickrImage(props: {
  className?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  photo: FlickrPhoto;
  url?: string;
  size?: FlickrPhotoSize
}) {
  // TODO image resolution
  return (
    <Image
      className={props.className}
      onClick={props.onClick}
      key={props.photo.id}
      src={props.url ?? constructPhotoUrl({ ...props.photo, size: props.size })}
      width={5000}
      height={5000}
      alt={props.photo.title}
    />
  );
}
