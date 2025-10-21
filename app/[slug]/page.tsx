"use client";

import React from "react";
import { trpc } from "../_trpc_client/client";
import use_Store from "@/store/store";

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id: number }>;
}) {
  const { slug } = React.use(params);
  const { id } = React.use(searchParams);
  const { userId } = use_Store();
  const PostDetail = trpc.post.getPostById.useQuery(
    { postId: Number(id) },
    {
      enabled: !!id,
      staleTime: 60 * 60 * 1000,
    }
  );

  if (PostDetail.isLoading) return <p>Loading...</p>;
  if (PostDetail.error) return <p>Error: {PostDetail.error.message}</p>;
  if (!PostDetail?.data) {
    return <>Wrong inpput page </>;
  }
  return (
    <div className="min-h-[calc(100vh-5rem)] max-h-auto border-2 border-black md:max-w-[1000px] md:min-w-[500px] m-auto flex">
      <div className="w-full p-2 ">
        <h1 className="p-2 w-full font-bold text-2xl text-start">
          post : {slug}
        </h1>
        {PostDetail.data && (
          <div className="border">
            <h2 className="text-xl font-semibold">{PostDetail.data.title}</h2>
            <p>{PostDetail.data.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// author
// :
// "saca"
// authorId
// :
// "5563c060-d273-4dad-9c47-a732e19a81ea"
// content
// :
// "acab"
// createdAt
// :
// "2025-10-21 04:39:15.035862"
// id
// :
// 28
// postPhoto
// :
// "https://jeukjvlizxvtdbuqagvv.supabase.co/storage/v1/object/public/post_photo/image1.png"
// published
// :
// false
// slug
// :
// "titile"
// title
// :
// "titile"
// updatedAt
// :
// "2025-10-21 04:39:15.035862"
