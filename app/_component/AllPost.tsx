"use client";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import { trpc } from "../_trpc_client/client";
import PostCard from "./PostCard";
import Pagination from "./PaginationRoute";
import PostSkeleton from "@/loading_assets/PostSkeleton";

function AllPost() {
  const [page, setpage] = useState(1);
  const [filter, setFilter] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data, isLoading, isError, refetch } = trpc.post.getAllpost.useQuery(
    { page, filter },
    {
      enabled: !!page,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    console.log(value);
    setFilter(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setFilter(value);
    }, 1000);
  };
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  return (
    <>
      <div className="p-2" id="post">
        <div className="p-2 flex  justify-between">
          <h1 className="font-serif">ALL posts</h1>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              onChange={(e) => handleChange(e)}
              value={filter}
              className="pl-2 pt-1 pb-1 pr-1 border  outline-none rounded-xl "
              placeholder="Search by tag"
            />
          </div>
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
                  <PostCard post={filter==""?val:val.posts} />
                </div>
              );
            })}
          </div>
        ) : isLoading ? (
          <>
            <PostSkeleton />
          </>
        ) : (
          "NO Post Avaiable"
        )}
      </div>
      {data?.totalPage && (
        <>
          <Pagination
            page={page}
            setPageAction={setpage}
            totalPages={data.totalPage}
          />
        </>
      )}
    </>
  );
}

export default AllPost;
