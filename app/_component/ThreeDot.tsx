"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostInput from "./PostInput";
import { trpc } from "../_trpc_client/client";
import use_Store from "@/store/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
function ThreeDot({
  postId,
  postData,
  category,
}: {
  postId: number;
  postData: any;
  category: any;
}) {
  const { userId } = use_Store();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [updateDilogOpen, setUpdateDilogOpen] = useState<boolean>(false);
  const utils = trpc.useUtils();
  const router = useRouter();
  const deletePost = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.getAllpost.refetch();
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });
  const handleDelete = () => {
    if (!postId && !userId && postData.authorId != userId) {
      return toast.info("Some Thing went wrong");
    }
    deletePost.mutate({ id: Number(postId), userId: userId! });
  };
  useEffect(() => {
    if (deletePost.isSuccess) {
      router.push("/");
    }
  }, [deletePost.isSuccess]);
  console.log(deletePost.error?.message);
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer">:</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:!bg-gray-900">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setUpdateDilogOpen(true)}>
              updatePost
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              Delete post
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={updateDilogOpen} onOpenChange={setUpdateDilogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>update post</DialogTitle>
            <div>
              <PostInput
                data={postData}
                update={true}
                PostCat={category}
                postId={postId}
                isDone={setUpdateDilogOpen}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post</DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <button className="bg-green-700 p-2 rounded-xl cursor-pointer text-white">
                  Cancel
                </button>
              </DialogClose>
              <button
                className="bg-red-700 p-2 text-white rounded-xl cursor-pointer"
                onClick={() => handleDelete()}
              >
                Delete
              </button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ThreeDot;
