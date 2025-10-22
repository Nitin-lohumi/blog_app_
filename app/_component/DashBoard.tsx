"use client";
import React from "react";
import { trpc } from "../_trpc_client/client";
import use_Store from "@/store/store";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import DashBoardSkleton from "@/loading_assets/DashBoardSkleton";

function DashBoard() {
  const { userId } = use_Store();
  const { data, isLoading } = trpc.post.getDraftPost.useQuery(
    { userId: userId ?? "" },
    {
      enabled: !!userId,
      staleTime: 20 * 60 * 60 * 1000,
    }
  );
  const posts = trpc.post.getTop3POst.useQuery();
  if (!userId) {
    return <></>;
  }
  if (isLoading) {
    return (
      <>
        <DashBoardSkleton />
      </>
    );
  }

  return (
    <div className="p-5" id="dashboard">
      <h2 className="font-bold text-2xl">Recent Post & Draft post</h2>
      <br />
      {!data?.length && !posts?.data?.length ? (
        <CreatePost />
      ) : (
        <div className="flex gap-5 justify-center">
          {data?.length ? (
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
              <div className="md:flex p-2 rounded-2xl shadow-xs shadow-gray-600 w-full">
                <PostCard post={data[0]} fristpostDash={true} dashboad={true} />
              </div>
              <div className="w-full flex flex-col gap-3 md:h-80  h-48  border-2 overflow-auto p-1">
                {data.map((val, i) => {
                  if (i == 0) return;
                  return (
                    <div
                      key={val.id}
                      className="flex p-2 md:col-span-1 rounded-2xl shadow-xs shadow-gray-600"
                    >
                      <PostCard post={val} dashboad={true} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            posts.data?.length && (
              <>
                <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                  <div className="md:flex p-2 rounded-2xl shadow-xs shadow-gray-600 w-full">
                    <PostCard
                      post={posts?.data[0]}
                      fristpostDash={true}
                      dashboad={true}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-3 md:h-80  h-40 overflow-auto p-1">
                    {posts.data.map((val, i) => {
                      if (i == 0) return;
                      return (
                        <div
                          key={val.id}
                          className="flex p-2 md:col-span-1 rounded-2xl shadow-xs shadow-gray-600"
                        >
                          <PostCard post={val} dashboad={true} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default DashBoard;
