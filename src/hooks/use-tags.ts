import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useTags(props: { allTags: string[]; initialTags: string[] }) {
  const allTags = props.allTags;
  const [currentTags, setCurrentTags] = useState(props.initialTags);
  const pathname = usePathname();
  const router = useRouter();

  const toggleTag = (tag: string) => {
    if (currentTags.includes(tag)) {
      setCurrentTags((prevTags) => prevTags.filter((t) => t !== tag));
    } else {
      setCurrentTags((prevTags) => [...prevTags, tag]);
    }
  };

  const hasAllSelectedTags = (objTags: string[]) => {
    return currentTags.every((tag) => objTags.includes(tag));
  };

  const hasAnySelectedTags = (objTags: string[]) => {
    return currentTags.some((tag) => objTags.includes(tag));
  };

  const getQueryString = useCallback(() => {
    const params = new URLSearchParams();
    currentTags.forEach((tag) => params.append("tag", tag));
    return (currentTags.length > 0 ? "?" : "") + params.toString();
  }, [currentTags]);

  useEffect(() => {
    router.push(pathname + getQueryString());
  }, [getQueryString, router, pathname]);

  return {
    allTags,
    currentTags,
    toggleTag,
    hasAllSelectedTags,
    hasAnySelectedTags,
    getQueryString,
  };
}
