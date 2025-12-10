export default function SuggestionBox() {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow hover:shadow-md transition-all">
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div>
          <div className="h-3 w-18 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Follow Button */}
      <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-secondary hover:opacity-90 transition-all">
        Follow
      </button>
    </div>
  );
}
