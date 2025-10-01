"use client";
import { useEffect, useRef, useState } from "react";

export const RealVideoSection: React.FC = () => {
  const realsData: string[] = [
    "/reels/keysaria_reel_1.mp4",
    "/reels/navrani-reel.mp4",
    "/reels/rajwada-reel.mp4",
    "/reels/bindani_reel.mp4",
    "/reels/utsav-reel.mp4",
    "/reels/bandhani_reel.mp4",
  ];

  // Fix: Define the correct type for videoRefs
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>(
    new Array(realsData.length).fill(false)
  );

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, realsData.length);
  }, [realsData.length]);

  const handlePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    // Pause all other videos
    videoRefs.current.forEach((videoRef, i) => {
      if (i !== index && videoRef) {
        videoRef.pause();
        setIsPlaying((prev) => {
          const newState = [...prev];
          newState[i] = false;
          return newState;
        });
      }
    });

    // Toggle play/pause
    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        })
        .catch((error) => console.error("Error playing video:", error));
    } else {
      video.pause();
      setIsPlaying((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  const handleVideoEnd = (index: number) => {
    setIsPlaying((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
    if (videoRefs.current[index]) {
      videoRefs.current[index].currentTime = 0;
    }
  };

  return (
    <div className="sm:p-0 md:p-12 lg:p-5 space-y-2 md:space-y-4 lg:space-y-6">
      <div className="flex bg-white px-2 lg:px-10">
        <h3 className="lg:text-3xl text-lg text-center font-oswald flex gap-x-2 tracking-widest font-semibold text-black items-center">
          Reels
        </h3>
      </div>
      <div className="w-full lg:px-10 px-2">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {realsData.map((videoSrc, index) => (
            <div key={index} className="">
              <div className="flex flex-col shadow-lg rounded-md relative">
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  className="w-full rounded-md"
                  src={videoSrc}
                  playsInline
                  onEnded={() => handleVideoEnd(index)}
                  controls={false}
                ></video>
                <div className="absolute inset-0 flex justify-center items-center">
                  <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    onClick={() => handlePlayPause(index)}
                  >
                    {isPlaying[index] ? (
                      <svg
                        className="md:w-20 md:h-20 w-10 h-10 text-black bg-white p-2 md:p-4 rounded-full shadow-lg opacity-80 hover:opacity-100 focus:outline-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="6"
                          y="4"
                          width="4"
                          height="16"
                          fill="currentColor"
                        />
                        <rect
                          x="14"
                          y="4"
                          width="4"
                          height="16"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="md:w-20 md:h-20 w-10 h-10 text-black bg-white p-2 md:p-4 rounded-full shadow-lg opacity-80 hover:opacity-100 focus:outline-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4l14 8-14 8V4" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
