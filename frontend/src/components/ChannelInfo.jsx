import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

const ChannelInfo = ({
  channelData,
  uploader,
  user,
  isSubscribed,
  onSubscribe,
  isLoading,
  isSubscribing,
}) => {
  // Derived values
  const isOwnChannel = channelData?._id === user?.channels?.[0]?._id;
  const channelName = channelData?.channelName || "Unnamed Channel";
  const channelBanner = channelData?.channelBanner || "/images/channel-banner.jpeg";
  const uploaderName = uploader?.username || "Unknown uploader";
  const subscriberCount = (channelData?.subscribers || 0).toLocaleString();

  const handleSubscribeClick = () => {
    if (!user) return toast.info("Please log in to subscribe");
    onSubscribe();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 mb-4 px-1">
        <div className="flex items-center gap-4">
          <Skeleton circle width={64} height={64} />
          <div className="flex flex-col gap-2">
            <Skeleton width={140} height={20} />
            <Skeleton width={100} height={16} />
            <Skeleton width={80} height={14} />
          </div>
        </div>
        {!isOwnChannel && <Skeleton width={100} height={36} className="rounded-full" />}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 mb-4 px-1">
      <div className="flex items-center gap-4">
        <img
          src={channelBanner}
          alt={`${channelName} Banner`}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-gray-300"
          loading="lazy"
        />
        <div className="flex flex-col">
          <p className="text-lg sm:text-xl font-bold text-gray-900">{channelName}</p>
          <p className="text-sm sm:text-base font-medium text-gray-700">{uploaderName}</p>
          <p className="text-sm text-gray-500">{subscriberCount} subscribers</p>
        </div>
      </div>

      {!isOwnChannel && (
        <div className="sm:ml-auto w-full sm:w-auto">
          <button
            onClick={handleSubscribeClick}
            disabled={isSubscribing || !user}
            className={`w-full sm:w-auto px-5 py-2 rounded-full font-semibold text-sm transition duration-200 ${
              !user ? "bg-gray-400 text-white cursor-not-allowed" :
              isSubscribing ? "opacity-70 cursor-not-allowed bg-red-600 text-white" :
              isSubscribed ? "bg-gray-200 text-gray-800 hover:bg-gray-300" :
              "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {!user ? "Login to Subscribe" :
             isSubscribing ? (
              <span className="flex justify-center items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Processing...
              </span>
             ) : isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChannelInfo, (prevProps, nextProps) => (
  prevProps.channelData?._id === nextProps.channelData?._id &&
  prevProps.channelData?.subscribers === nextProps.channelData?.subscribers &&
  prevProps.isSubscribed === nextProps.isSubscribed &&
  prevProps.isLoading === nextProps.isLoading &&
  prevProps.isSubscribing === nextProps.isSubscribing &&
  prevProps.user?._id === nextProps.user?._id
));