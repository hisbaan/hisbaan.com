"use client";

import { useWindowSize } from "@uidotdev/usehooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tags } from "@/components/tags";
import { useTags } from "@/hooks/use-tags";
import { FlickrPhoto, FlickrPhotoset } from "@/queries/flickr";
import { breakpoints } from "../../tailwind.config";
import { FlickrImage } from "./flickr-image";

export function Albumn(props: { photoset: FlickrPhotoset }) {
  const { allTags, currentTags, toggleTag, hasAllSelectedTags, getQueryString } =
    useTags({
      allTags: [
        ...new Set(
          props.photoset.photo.flatMap((photo) => photo.tags.split(" "))
        ),
      ].toSorted(),
      initialTags: useSearchParams().getAll("tag"),
    });

  const photos = props.photoset.photo.filter((photo) =>
    hasAllSelectedTags(photo.tags.split(" "))
  );

  const getPhotoLink = (photoId: string) => {
    return `/photos/${props.photoset.id}/${photoId}${getQueryString()}`;
  };

  return (
    <>
      <Tags allTags={allTags} currentTags={currentTags} toggleTag={toggleTag} />
      <MasonryGrid photos={photos} getPhotoLink={getPhotoLink} />
    </>
  );
}

function MasonryGrid(props: {
  photos: FlickrPhoto[];
  getPhotoLink: (photoId: string) => string;
}) {
  let columns = 3;
  const windowSize = useWindowSize();
  if (windowSize.width && windowSize.width <= breakpoints.xs) {
    columns = 1;
  } else if (windowSize.width && windowSize.width <= breakpoints.sm) {
    columns = 2;
  }

  const list: FlickrPhoto[][] = [];
  for (let i = 0; i < columns; i++) list.push([]);
  props.photos.forEach((photo, index) => list[index % columns].push(photo));

  return (
    <div className="flex flex-row gap-4">
      {list.map((columnList, index) => (
        <div key={index} className="flex flex-col gap-4 flex-1">
          {columnList.map((photo) => (
            <Link key={photo.id} href={props.getPhotoLink(photo.id)}>
              <FlickrImage className="h-auto w-full rounded-lg" photo={photo} />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
