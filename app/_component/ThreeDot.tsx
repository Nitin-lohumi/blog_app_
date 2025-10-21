"use client";
import React, { useState } from "react";
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

function ThreeDot() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer">open</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:!bg-blue-700">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              updatePost
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Add tag</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>change Tag</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete post</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>update post</DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <button>close</button>
              </DialogClose>
              <button>create</button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ThreeDot;
