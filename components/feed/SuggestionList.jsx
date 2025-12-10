import SuggestionBox from "./SuggestionBox";

export default function SuggestionList() {
  return (
    <aside className="">
      <h3 className="text-gray-700 font-semibold mb-4">People you may know</h3>
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <SuggestionBox key={i} />
        ))}
      </div>
    </aside>
  );
}
