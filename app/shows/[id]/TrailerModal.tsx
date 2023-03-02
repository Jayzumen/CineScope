"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import ReactPlayer from "react-player";
import { Video } from "../showTypes";

const TrailerModal = ({
  isOpen,
  setIsOpen,
  trailer,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trailer: Video | undefined;
}) => {
  const [muted, setMuted] = useState(true);

  return (
    <div className="">
      {isOpen && (
        <div className="absolute top-0 left-0 h-screen w-full overflow-hidden bg-black/40">
          <div className="fixed top-10 left-0 right-0 z-50 mx-auto overflow-hidden rounded-md p-10">
            <button
              title="Close"
              className="absolute right-14 top-12 !z-40 flex h-14
       w-14 items-center justify-center rounded-full border-2 border-slate-600 bg-black transition hover:border-white "
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineClose className="h-8 w-8" />
            </button>

            <div className=" relative min-h-[90vh] min-w-full">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailer?.key}`}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: "0", left: "0" }}
                playing
                muted={muted}
              />
              <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
                <button
                  title="Mute"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2
           border-[gray] bg-black transition hover:border-white"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? (
                    <FaVolumeMute className="h-6 w-6" />
                  ) : (
                    <FaVolumeUp className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailerModal;
