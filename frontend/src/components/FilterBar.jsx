const filters = ['All', 'Music', 'Gaming', 'News', 'Sports', 'Education', 'Entertainment'];

export default function FilterBar({ selectedFilter, onSelectFilter }) {
  return (
    <div className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto py-3 px-4 scrollbar-hide bg-white border-b border-gray-200">
      {filters.map((filter) => {
        // Check if this filter is currently selected
        const isActive = selectedFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onSelectFilter(filter)} // Call parent handler to change filter
            className={`
              px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base font-medium rounded-full
              whitespace-nowrap transition-all duration-200
              ${
                // Apply different styles based on whether the button is active
                isActive
                  ? 'bg-black text-white shadow' // Active button styles
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200' // Inactive button styles with hover effect
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
