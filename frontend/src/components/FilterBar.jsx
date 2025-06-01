const filters = ['All', 'Music', 'Gaming', 'News', 'Sports', 'Education', 'Entertainment'];

export default function FilterBar({ selectedFilter, onSelectFilter }) {
  return (
    <div className="flex gap-6 overflow-x-auto py-3 px-4 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = selectedFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onSelectFilter(filter)}
            className={`
              px-6 py-2 text-base font-semibold rounded-full whitespace-nowrap
              transition-colors duration-300 shadow-sm
              ${isActive
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-black'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}