import { useState } from "react";

export default function PostContent({ description, maxLength = 300 }) {
  const [showFullContent, setShowFullContent] = useState(false);

  if (!description) return null;

  const isLongContent = description?.length > maxLength;

  return (
    <div className="mb-3">
      <div
        className={`text-gray-800 leading-relaxed text-sm ${
          !showFullContent && isLongContent ? "line-clamp-3" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {isLongContent && (
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="text-secondary text-sm font-semibold hover:underline mt-1"
        >
          {showFullContent ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}