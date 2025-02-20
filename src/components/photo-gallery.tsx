"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useTags } from "@/hooks/use-tags";
import { FlickrPhoto } from "@/queries/flickr";
import { FlickrImage } from "./flickr-image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useKeyPress } from "@/hooks/use-key-press";

export function PhotoGallery(props: {
  photosetId: string;
  photos: FlickrPhoto[];
  selectedPhotoId: string;
}) {
  const { hasAllSelectedTags } = useTags({
    allTags: [
      ...new Set(props.photos.flatMap((photo) => photo.tags.split(" "))),
    ].toSorted(),
    initialTags: useSearchParams().getAll("tag"),
  });

  const photos = props.photos.filter((photo) =>
    hasAllSelectedTags(photo.tags.split(" "))
  );

  const selectedPhotoIndex = photos.findIndex(
    (photo) => photo.id === props.selectedPhotoId
  );
  const [index, setIndex] = useState(
    selectedPhotoIndex === -1 ? 0 : selectedPhotoIndex
  );

  const setIndexAndUrl = useCallback(
    (newIndex: number | ((x: number) => number)) => {
      const targetIndex =
        typeof newIndex === "number" ? newIndex : newIndex(index);
      window.history.pushState(
        window.history.state,
        "",
        `/photos/${props.photosetId}/${photos[targetIndex].id}`
      );
      setIndex(newIndex);
    },
    [index, photos, props.photosetId]
  );

  useKeyPress({
    targetKey: "ArrowLeft",
    onKeyUp: () => {
      if (index !== 0) setIndexAndUrl((index) => index - 1);
    },
  });
  useKeyPress({
    targetKey: "ArrowRight",
    onKeyUp: () => {
      if (index !== photos.length - 1) setIndexAndUrl((index) => index + 1);
    },
  });

  const setPhoto = (photo: FlickrPhoto) =>
    setIndexAndUrl(photos.findIndex((curr) => curr.id === photo.id));

  return (
    <div className="flex w-full flex-grow flex-col justify-between gap-4">
      <div className="my-auto flex w-full flex-row items-center justify-between gap-2">
        <div
          className={`absolute left-2 z-10 p-2 md:relative md:left-auto ${index === 0 ? "invisible" : "cursor-pointer"}`}
          onClick={() => {
            if (index !== 0) setIndexAndUrl((index) => index - 1);
          }}
        >
          <FaChevronLeft />
        </div>
        <FlickrImage
          className={`mx-auto h-auto max-h-[70vh] w-auto max-w-full justify-self-center overflow-hidden rounded-lg object-contain`}
          photo={photos[index]}
          url={photos[index].url_k}
        />
        <div
          className={`absolute right-2 z-10 p-2 md:relative md:right-auto ${index === photos.length - 1 ? "invisible" : "cursor-pointer"}`}
          onClick={() => {
            if (index !== photos.length - 1)
              setIndexAndUrl((index) => index + 1);
          }}
        >
          <FaChevronRight />
        </div>
      </div>
      <div className="flex h-20 flex-row gap-3 overflow-x-scroll">
        {photos.map((photo) => (
          <FlickrImage
            className={
              "h-full w-auto rounded-md " +
              (photo.id === photos[index].id
                ? "outline outline-1 outline-offset-[-2px] outline-white"
                : "")
            }
            onClick={() => setPhoto(photo)}
            key={photo.id}
            photo={photo}
          />
        ))}
      </div>
    </div>
  );
}
