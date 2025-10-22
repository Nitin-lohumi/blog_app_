import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function PostOneSkleton() {
  return (
    <div
      className="min-h-[calc(100vh-10rem)] max-h-auto  rounded-xl dark:shadow-gray-400
        shadow-black md:max-w-[1000px] md:min-w-[500px] m-auto flex"
    >
      <div className="w-full p-2 ">
        <div className="p-2 mb-5 w-full font-bold text-2xl text-start flex justify-end"></div>
        <div className="">
          <div className="w-full mb-8">
            <Skeleton className="w-full h-66 dark:bg-gray-600/15 bg-gray-400/30" />
          </div>
          <div className="mt-1 mb-1 p-1  font-thin leading-6 capitalize dark:text-gray-400 text-gray-900">
            <Skeleton className="w-10 h-5 dark:bg-gray-600/15 bg-gray-400/30" />
          </div>
          <div className="flex gap-4 flex-wrap">
            {[1, 2, 3].map((val: any, index: number) => {
              return (
                <div
                  className="rounded-lg font-semibold text-xs
                      bg-violet-800/20 dark:text-white shadow-gray-500 capitalize w-full m-auto"
                  key={index}
                >
                  <Skeleton className="w-full h-10 dark:bg-gray-600/15 bg-gray-400/30" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostOneSkleton;
