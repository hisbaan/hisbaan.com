import { getImageUrl } from "@/lib/uploadthing";
import { Photo } from "@/queries/photos";
import Image from "next/image";
import { MouseEventHandler } from "react";

export function UploadThingImage(props: {
  className?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  photo: Photo;
  thumbnail?: boolean;
}) {
  return (
    <Image
      className={props.className}
      onClick={props.onClick}
      src={getImageUrl(
        props.thumbnail ? props.photo.thumbnailKey : props.photo.key
      )}
      width={props.thumbnail ? 500 : 5000}
      height={props.thumbnail ? 500 : 5000}
      alt={props.photo.fileName}
      unoptimized
    />
  );
}
