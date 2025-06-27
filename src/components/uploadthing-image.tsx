import { getImageUrl } from "@/lib/uploadthing";
import { Photo } from "@/queries/photos";
import Image from "next/image";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { cn } from "@/utils/cn";

export const UploadThingImage: React.FC<{
  className?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  width?: number;
  height?: number;
  thumbnail?: boolean;
  showSpinner?: boolean;
  photo: Photo,
  "data-index"?: number;
}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const src = getImageUrl(props.thumbnail ? props.photo.thumbnailKey : props.photo.key)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      setIsLoading(true);
      timeoutRef.current = null;
    }, 100);
    timeoutRef.current = timeout;

    return () => clearTimeout(timeout);
  }, [src]);

  return (
    <>
      {isLoading && props.showSpinner && (
        <div className={cn(props.className, "grid place-items-center")}>
          <Ring2
            size={50}
            speed={1.5}
            bgOpacity={0.25}
            stroke={5}
            strokeLength={0.25}
            color="white"
          />
        </div>
      )}
      <Image
        data-index={props["data-index"]}
        className={cn(props.className, isLoading && props.showSpinner && "hidden")}
        onClick={props.onClick}
        src={src}
        width={props.width ?? props.thumbnail ? 500 : 5000}
        height={props.height ?? props.thumbnail ? 500 : 5000}
        alt={props.photo.fileName}
        onLoad={() => {
          setIsLoading(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        unoptimized
      />
    </>
  );
};
