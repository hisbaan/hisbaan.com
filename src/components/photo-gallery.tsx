"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useTags } from "@/hooks/use-tags";
import { UploadThingImage } from "./uploadthing-image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useKeyPress } from "@/hooks/use-key-press";
import { Photo } from "@/queries/photos";

export function PhotoGallery(props: {
  albumnId: string;
  photos: Photo[];
  selectedPhotoId: string;
}) {
  const tags = useSearchParams().getAll("tag");

  const tagsQueryString = useMemo(() => {
    const params = new URLSearchParams();
    tags.forEach((tag) => params.append("tag", tag));
    return (tags.length > 0 ? "?" : "") + params.toString();
  }, [tags]);

  const { hasAllSelectedTags } = useTags({
    allTags: [
      ...new Set(props.photos.flatMap((photo) => photo.tags)),
    ].toSorted(),
    initialTags: tags,
  });

  const photos = props.photos.filter((photo) => hasAllSelectedTags(photo.tags));

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
        `/photos/${props.albumnId}/${photos[targetIndex].id}` + tagsQueryString
      );
      setIndex(newIndex);
    },
    [index, photos, props.albumnId, tagsQueryString]
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

  const setPhoto = (photo: Photo) =>
    setIndexAndUrl(photos.findIndex((curr) => curr.id === photo.id));

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const selectedThumbnail = thumbnailContainerRef.current.querySelector(
        `img[data-index="${index}"]`
      );
      if (selectedThumbnail) {
        selectedThumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [index]);

  return (
    <div className="flex w-full grow flex-col justify-between gap-4">
      <div className="my-auto flex w-full flex-row items-center justify-between gap-2">
        <div
          className={`absolute left-2 z-10 p-2 md:relative md:left-auto ${index === 0 ? "invisible" : "cursor-pointer"}`}
          onClick={() => {
            if (index !== 0) setIndexAndUrl((index) => index - 1);
          }}
        >
          <FaChevronLeft />
        </div>
        <UploadThingImage
          className={`mx-auto h-[65vh] w-auto max-w-full justify-self-center overflow-hidden rounded-lg object-contain`}
          photo={photos[index]}
          showSpinner
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
      <div
        ref={thumbnailContainerRef}
        className="flex h-25 flex-row gap-3 overflow-x-auto pb-3"
      >
        {photos.map((photo, i) => (
          <UploadThingImage
            key={photo.id}
            data-index={i}
            className={
              "h-full w-auto rounded-md " +
              (photo.id === photos[index].id
                ? "outline-1 -outline-offset-2 outline-white outline-solid"
                : "")
            }
            onClick={() => setPhoto(photo)}
            photo={photo}
            thumbnail
          />
        ))}
      </div>
    </div>
  );
}
