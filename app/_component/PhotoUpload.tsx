"use client";
import { useState } from "react";
import { trpc } from "@/app/_trpc_client/client";
import use_Store from "@/store/store";
export default function Photo() {
  const [file, setFile] = useState<File | null>(null);
  const { data, mutate } = trpc.post.fileHandler.useMutation({
    onSuccess: () => alert("file uploaded!"),
    onError: (err) => alert(err.message),
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };
  const handleSubmit = async () => {
    if (!file) return alert("Select a file first");
    const reader = new FileReader();
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      return alert("file type error!");
    }
    reader.onloadend = () => {
      mutate({
        fileName: "nitin_" + file.name,
        fileBase64: reader.result as string,
        fileType: file.type as "image/jpeg" | "image/jpg" | "image/png",
        author: "Nitin",
        authorId: "123",
      });
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
      />
      <button onClick={handleSubmit}>Create Post</button>
    </div>
  );
}
