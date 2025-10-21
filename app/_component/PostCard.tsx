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
  console.log(post.authorId);
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
          <div className="flex flex-row  items-center gap-2 p-1 font-thin text-xs text-blue-800 w-full">
            <span>{post.authorId == userId ? "Your Post" : post.author}</span>
            <li>{formattedDate}</li>
          </div>
          <div className="flex items-center justify-between w-full">
            <h2 className="capitalize font-bold pt-2 pb-2 w-full">
              {post.title}
            </h2>
            <Link href={`/${post.slug}?id=${post.id}`}>
              <MdArrowOutward />
            </Link>
          </div>
          <div className="flex flex-row  font-thin text-xs text-wrap  w-full">
            <ReactMarkdown>
              {post.content.length > 80
                ? post.content.slice(0.8)
                : post.content}
            </ReactMarkdown>
            <Link href={""}>{post.content.length < 80 ? "" : "  ..more"}</Link>
          </div>
          <div className="flex flex-wrap gap-2 items-center mt-5">
            {data?.length &&
              data.map((val) => {
                return (
                  <div
                    className="shadow-xs pl-2 pr-2 p-1 rounded-lg w-fit font-semibold text-xs
                   bg-violet-800/20 text-black shadow-gray-500"
                    key={val?.id}
                  >
                    {val?.name}
                  </div>
                );
              })}
            {data?.length && data.length > 3 && (
              <span className="font-thin text-xs">more Category</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
