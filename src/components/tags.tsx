export function Tags(props: {
  allTags: string[];
  currentTags: string[];
  toggleTag: (tag: string) => void;
}) {
  return (
    <div className="flex w-full cursor-pointer flex-wrap gap-5">
      {[...props.allTags].map((tag: string) => {
        return (
          <div
            key={tag}
            onClick={() => props.toggleTag(tag)}
            className={`decoration-neutral-500 transition-colors hover:text-neutral-300 hover:decoration-neutral-400 ${props.currentTags.includes(tag) ? "underline" : "text-neutral-400"}`}
          >
            {tag}
          </div>
        );
      })}
    </div>
  );
}
