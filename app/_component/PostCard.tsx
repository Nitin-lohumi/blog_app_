"use client";
import { trpc } from "../_trpc_client/client";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import use_Store from "@/store/store";
function PostCard({
  post,
  dashboad = false,
  fristpostDash = false,
}: {
  post: any;
  dashboad?: boolean;
  fristpostDash?: boolean;
}) {
  if (!post.id) {
    return;
  }
  const { userId } = use_Store();
  const { data, isLoading } = trpc.categories.getCategoriesByPostId.useQuery(
    {
      postId: post?.id,
    },
    { staleTime: 24 * 24 * 60 }
  );
  const date = new Date(post?.createdAt);
  const formattedDate = format(date, "dd MMM yyyy");
  return (
    <>
      <div
        className={`${
          dashboad && !fristpostDash
            ? "flex flex-row items-center w-full gap-2"
            : fristpostDash
            ? "border-black w-full"
            : "h-auto"
        }`}
      >
        {post?.postPhoto && (
          <div>
            <Image
              src={post.postPhoto}
              alt="Post pic"
              height={800}
              width={800}
              className={`rounded-2xl ${
                dashboad && !fristpostDash
                  ? "h-30 w-68"
                  : fristpostDash && dashboad
                  ? "h-40 w-full flex-wrap"
                  : "h-[150px]"
              }`}
            />
          </div>
        )}
        <div
          className={`${
            dashboad && !fristpostDash ? "flex flex-col w-full" : ""
          }`}
        >
          <div
            className="flex flex-row  items-center md:gap-2 gap-4 p-1 font-thin text-xs 
           w-full"
          >
            <span className="dark:text-blue-300 text-blue-700">
              {post.authorId == userId ? "Your Post" : post.author}
            </span>
            <li>{formattedDate}</li>
          </div>
          <div className="flex items-center justify-between w-full">
            <h2 className="capitalize font-bold pt-2 pb-2 w-full">
              {post.title}
            </h2>
            <Link href={`/${post.slug}?id=${post.id}&&date=${formattedDate}`}>
              <MdArrowOutward />
            </Link>
          </div>
          <div className="flex flex-col   font-thin text-xs text-wrap  w-full">
            <ReactMarkdown>
              {post.content.length > 50
                ? post.content.slice(0, 50)
                : post.content}
            </ReactMarkdown>
            {post.content.length > 50 && (
              <Link
                href={`/${post.slug}?id=${post.id}&&date=${formattedDate}`}
                className="inline"
              >
                ...more
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center mt-5">
            {data?.length! > 0
              ? data?.map((val, i) => {
                  if (i > 2) return;
                  return (
                    <div
                      className="shadow-xs pl-2 pr-2 p-1 rounded-lg w-fit font-semibold text-xs
                   bg-violet-800/20 dark:text-white shadow-gray-500"
                      key={i}
                    >
                      {val?.name + "asca"}
                    </div>
                  );
                })
              : ""}
            {data?.length
              ? data.length > 3 && (
                  <div className="font-thin text-xs">
                    <Link
                      href={`/${post.slug}?id=${post.id}&&date=${formattedDate}`}
                    >
                      ...more
                    </Link>
                  </div>
                )
              : ""}
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
