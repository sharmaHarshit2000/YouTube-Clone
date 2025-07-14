import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVideos } from '../features/video/videoSlice';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const dispatch = useDispatch();

  const { videos, loading } = useSelector((state) => state.videos);
  const { term } = useSelector((state) => state.search);
  const { isSidebarOpen } = useSelector((state) => state.ui);

  const [selectedFilter, setSelectedFilter] = useState('All');

  // Fetch all videos once on mount
  useEffect(() => {
    dispatch(fetchAllVideos());
  }, [dispatch]);

  // Toggle selected category filter
  const handleSelectFilter = (filter) => {
    setSelectedFilter((prevFilter) => (prevFilter === filter ? 'All' : filter));
  };

  // Filter and search videos efficiently using useMemo to prevent unnecessary recalculations
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    if (selectedFilter !== 'All') {
      filtered = filtered.filter((video) => video.category === selectedFilter);
    }

    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter((video) =>
        video.title?.toLowerCase().includes(lowerTerm)
      );
    }

    return filtered;
  }, [videos, selectedFilter, term]);

  if (loading) return <Loader />;

  const isFetchingCompleted = !loading && videos.length > 0;
  const isNoVideosAfterFilter = isFetchingCompleted && filteredVideos.length === 0;

  return (
    <div className="w-full h-full">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-6">
        <FilterBar selectedFilter={selectedFilter} onSelectFilter={handleSelectFilter} />
      </div>

      {isNoVideosAfterFilter ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25M8.25 9V5.25M4.5 5.25h15M19.5 8.25v10.5A2.25 2.25 0 0117.25 21H6.75A2.25 2.25 0 014.5 18.75V8.25m0 0L9.75 13.5m0 0L15 8.25m-5.25 5.25v5.25"
            />
          </svg>
          <p className="text-lg font-medium">No videos found</p>
          <span className="text-sm text-gray-400">Try a different filter or search term.</span>
        </div>
      ) : (
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
