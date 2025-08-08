"use client";

import { useWindowSize } from "@uidotdev/usehooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tags } from "@/components/tags";
import { useTags } from "@/hooks/use-tags";
import { breakpoints } from "../../tailwind.config";
import { UploadThingImage } from "./uploadthing-image";
import { AlbumnWithPhotos, Photo } from "@/queries/photos";

export function Albumn(props: { albumn: AlbumnWithPhotos }) {
  const {
    allTags,
    currentTags,
    toggleTag,
    hasAllSelectedTags,
    getQueryString,
  } = useTags({
    allTags: [
      ...new Set(props.albumn.photos.flatMap((photo) => photo.tags)),
    ].toSorted(),
    initialTags: useSearchParams().getAll("tag"),
  });

  const photos = props.albumn.photos.filter((photo) =>
    hasAllSelectedTags(photo.tags)
  );

  const getPhotoLink = (photoId: string) => {
    return `/photos/${props.albumn.id}/${photoId}${getQueryString()}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <Tags allTags={allTags} currentTags={currentTags} toggleTag={toggleTag} />
      <MasonryGrid photos={photos} getPhotoLink={getPhotoLink} />
    </div>
  );
}

function MasonryGrid(props: {
  photos: Photo[];
  getPhotoLink: (photoId: string) => string;
}) {
  let columns = 3;
  const windowSize = useWindowSize();
  if (windowSize.width && windowSize.width <= breakpoints.xs) {
    columns = 1;
  } else if (windowSize.width && windowSize.width <= breakpoints.sm) {
    columns = 2;
  }

  const columnsContent: Photo[][] = Array.from({ length: columns }, () => []);
  const columnHeights = Array(columns).fill(0);

  props.photos.forEach((photo) => {
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    );
    columnsContent[shortestColumnIndex].push(photo);
    // Since the width of the column is fixed, the image's rendered height
    // is proportional to its height / width ratio.
    columnHeights[shortestColumnIndex] += photo.height / photo.width;
  });

  return (
    <div className="flex flex-row gap-4">
      {columnsContent.map((columnList, index) => (
        <div key={index} className="flex flex-1 flex-col gap-4">
          {columnList.map((photo) => (
            <Link key={photo.id} href={props.getPhotoLink(photo.id)}>
              <UploadThingImage
                className="h-auto w-full rounded-lg"
                photo={photo}
                thumbnail
              />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
