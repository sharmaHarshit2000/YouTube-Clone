import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVideoById, likeVideo, dislikeVideo, fetchAllVideos } from "../features/video/videoSlice";
import { clearChannelState, getChannel, setCurrentChannel, subscribeToChannel, unsubscribeFromChannel } from "../features/channel/channelSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import VideoPlayer from "../components/VideoPlayer";
import ChannelInfo from "../components/ChannelInfo";
import LikeDislikeButtons from "../components/LikeDislikeButtons";
import DescriptionToggle from "../components/DescriptionToggle";
import CommentsToggle from "../components/CommentsToggle";
import SuggestedVideos from "../components/SuggestedVideos";

const VideoWatchPage = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const { videoId } = useParams();
  const dispatch = useDispatch();

  // Redux state selectors
  const { selectedVideo: video, videos, loading, error } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth);
  const { currentChannel } = useSelector((state) => state.channel);

  // Derived values
  const isMyChannel = user?.channels?.[0]?._id === video?.channel?._id;
  const normalizedChannel = currentChannel?.channel || currentChannel;

  const isSubscribed = useMemo(() => (
    !isMyChannel && normalizedChannel?.subscribersList?.some(subId => subId.toString() === user?._id)
  ), [user, normalizedChannel, isMyChannel]);

  // Load video and channel data
  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById(videoId));
    }
    return () => dispatch(clearChannelState());
  }, [dispatch, videoId]);

  useEffect(() => {
    if (video?.channel?._id) {
      const loadChannel = async () => {
        setIsChannelLoading(true);
        try {
          const freshChannel = await dispatch(getChannel(video.channel._id)).unwrap();
          dispatch(setCurrentChannel({
            ...freshChannel,
            isMyChannel: user?.channels?.[0]?._id === video.channel._id,
            videos: freshChannel.videos || []
          }));
          dispatch(fetchAllVideos());

        } catch (err) {
          console.error("Failed to fetch channel:", err);
        } finally {
          setIsChannelLoading(false);
        }
      };
      loadChannel();
    }
  }, [dispatch, video?.channel?._id, user?.channels]);

  const handleSubscription = async () => {
    if (!normalizedChannel?._id) return toast.error("Channel information missing");
    setIsSubscribing(true);
    try {
      const action = isSubscribed ? unsubscribeFromChannel : subscribeToChannel;
      await dispatch(action(normalizedChannel._id)).unwrap();
      toast.success(isSubscribed ? "Unsubscribed!" : "Subscribed!");
    } catch (error) {
      toast.error(error.payload || "Subscription failed");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleLikeDislike = (action) => {
    if (!user) return toast.info("Please log in to continue");
    dispatch(action(videoId));
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorDisplay error={error} />;
  if (!video) return <VideoNotFound />;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-screen-2xl mx-auto">
      <section className="w-full lg:w-[68%] flex flex-col space-y-6">
        <VideoPlayer video={video} />
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{video.title}</h1>

        <LikeDislikeButtons
          video={video}
          onLike={() => handleLikeDislike(likeVideo)}
          onDislike={() => handleLikeDislike(dislikeVideo)}
          user={user}
        />

        <ChannelInfo
          channelData={isMyChannel ? user?.channels?.[0] : normalizedChannel}
          uploader={video.uploader}
          user={user}
          isSubscribed={isSubscribed}
          onSubscribe={handleSubscription}
          isLoading={isChannelLoading}
          isSubscribing={isSubscribing}
        />

        <DescriptionToggle
          description={video.description}
          views={video.views}
          uploadDate={video.createdAt}
        />

        <CommentsToggle videoId={video._id} />
      </section>

      <aside className="w-full lg:w-[32%] sticky top-0 self-start h-[calc(100vh-5rem)] overflow-y-auto pr-1">
        <SuggestedVideos videos={videos.filter(v => v._id !== video._id)} currentVideoId={video._id} />
      </aside>
    </div>
  );
};

const ErrorDisplay = ({ error }) => (
  <div className="text-red-600 text-center p-6 bg-red-50 border border-red-200 rounded max-w-xl mx-auto mt-10">
    <h2 className="text-xl font-semibold">Error loading video</h2>
    <p>{error}</p>
  </div>
);

const VideoNotFound = () => (
  <div className="text-center text-gray-600 p-6 mt-10">
    <h2 className="text-xl font-semibold">Video Not Found</h2>
    <p>This video may have been removed or the URL is incorrect.</p>
  </div>
);

export default VideoWatchPage;
