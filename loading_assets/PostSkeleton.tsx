import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
function PostSkeleton() {
  return (
    <>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 w-full p-2">
        {[1, 2, 3, 4, 5, 6].map((val: any, i: number) => {
          return (
            <div
              key={i}
              className=" rounded-2xl flex flex-col p-3 w-full 
                  min-h-[150px] max-h-auto"
            >
              <Skeleton className="h-40 w-full dark:bg-gray-600/15 bg-gray-400/30" />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PostSkeleton;
