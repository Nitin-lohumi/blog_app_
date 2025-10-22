"use client";
import React from "react";
import { trpc } from "../_trpc_client/client";
import use_Store from "@/store/store";
import Markdown from "react-markdown";
import Image from "next/image";
import ThreeDot from "../_component/ThreeDot";
import PostOneSkleton from "@/loading_assets/PostOneSkleton";
export default function Page({
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id: number; date: string }>;
}) {
  const { id, date } = React.use(searchParams);
  const { userId } = use_Store();
  const PostDetail = trpc.post.getPostById.useQuery(
    { postId: Number(id) },
    {
      enabled: !!id,
      staleTime: 50 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
  const { data, isLoading, isSuccess } =
    trpc.categories.getCategoriesByPostId.useQuery(
      {
        postId: Number(PostDetail?.data?.id ?? -1),
      },
      {
        enabled: !!PostDetail?.data?.id,
        staleTime: 50 * 60 * 1000,
      }
    );
  if (PostDetail.isLoading) return <PostOneSkleton />;
  if (!PostDetail.data) return <>not found</>;
  return (
    <div
      className="min-h-[calc(100vh-5rem)] max-h-auto dark:shadow-xs shadow-lg rounded-xl dark:shadow-gray-400
     shadow-black md:max-w-[1000px] md:min-w-[500px] m-auto flex"
    >
      <div className="w-full p-2 ">
        <div className="p-2 mb-5 w-full font-bold text-2xl text-start flex justify-end">
          <div>
            {userId === PostDetail.data.authorId && !isLoading && isSuccess && (
              <ThreeDot
                postId={PostDetail.data.id}
                postData={PostDetail.data}
                category={data}
              />
            )}
          </div>
        </div>
        {PostDetail.data && PostDetail.isEnabled && (
          <div className="">
            <div className="w-full mb-8">
              {PostDetail.data.postPhoto && (
                <Image
                  src={PostDetail?.data?.postPhoto}
                  height={700}
                  width={700}
                  alt="post Image"
                  className="flex m-auto  object-center bg-cover md:w-[700px] h-[200px]"
                />
              )}
            </div>
            <div className="flex justify-between md:pl-5 p-5 pl-3">
              <li className="font-semibold font-serif text-2xl capitalize">
                {PostDetail.data.title}
              </li>
              <div className="flex gap-2">
                <p className=" font-thin">{date}</p>
                {!PostDetail.data.published && (
                  <p className="text-blue-800 dark:text-blue-400 ">
                    Draft Post
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4 flex-wrap md:pl-5 pl-3">
              {!isLoading && data?.length
                ? data.map((val: any, index: number) => {
                    return (
                      <div
                        className="shadow-xs pl-2 pr-2 p-1 rounded-lg w-fit font-semibold text-xs
                   bg-violet-800/20 dark:text-white shadow-gray-500 capitalize"
                        key={index}
                      >
                        {val.name}
                      </div>
                    );
                  })
                : ""}
                
            </div>
            <div className="ms:pl-5 pl-4  p-3 font-thin leading-6 capitalize dark:text-gray-400 text-gray-900">
              <Markdown>{PostDetail.data.content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
