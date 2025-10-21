"use client";
import React, { useState } from "react";
import { trpc } from "../_trpc_client/client";
import PostCard from "./PostCard";
import Pagination from "./PaginationRoute";
function AllPost() {
  const [page, setpage] = useState(1);
  const { data, isLoading, isError } = trpc.post.getAllpost.useQuery(
    { page },
    { staleTime: 60 * 60 * 1000 }
  );
  return (
    <>
      <div className="p-2" id="post">
        <div className="p-2">
          <h1 className="font-serif">ALL posts</h1>
        </div>
        {data?.data.length ? (
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 w-full p-2">
            {data.data.map((val: any, i: number) => {
              return (
                <div
                  key={i}
                  className="shadow-xs rounded-2xl shadow-gray-600 flex flex-col p-3 w-full 
                  min-h-[150px] max-h-auto"
                >
                  <PostCard post={val} />
                </div>
              );
            })}
          </div>
        ) : (
          <>no post avaiable</>
        )}
      </div>
      {data?.totalPage && (
        <>
          <Pagination
            page={page}
            setPage={setpage}
            totalPages={data.totalPage}
          />
        </>
      )}
    </>
  );
}

export default AllPost;
