"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { trpc } from "../_trpc_client/client";
import Image from "next/image";
import { toast } from "react-toastify";
import use_Store from "@/store/store";
function PostInput() {
  const navigate = useRouter();
  const { userId } = use_Store();
  const [cat, setCat] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const file = useRef(null);
  const [inputData, setInputdata] = useState({
    title: "",
    content: "",
    postPhoto: "",
    slug: "",
    published: false,
    author: "",
    description: "",
  });
  const mutations = trpc.post.fileHandler.useMutation();
  const SaveMutation = trpc.post.createPost.useMutation();
  const utils = trpc.useUtils();
  const handleFilechange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !inputData.author || !inputData.title) {
      return toast.error("Author name & title Could not be empty !");
    }
    const f = e.target.files?.[0];
    if (f) {
      setSelectFile(f);
      setPreview(URL.createObjectURL(f));
      const base64 = await toBase64(f);
      console.log("data");
      mutations.mutate({
        fileName: f.name,
        fileType: f.type as "image/jpeg" | "image/jpg" | "image/png",
        fileBase64: base64,
        author: inputData.author,
        authorId: userId!,
      });
    }
  };
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  useEffect(() => {
    if (mutations.data?.length) {
      setPublicUrl(mutations.data);
    }
  }, [mutations.data]);

  const handleSavePost = (publish: boolean) => {
    if (
      !inputData.author ||
      !inputData.content ||
      !inputData.title ||
      !userId
    ) {
      return toast.error("Author name & title ,content Could not be empty !");
    }
    const sg = inputData.title.split(" ").join("_");
    SaveMutation.mutate({
      postPhoto: publicUrl,
      author: inputData.author,
      content: inputData.content,
      title: inputData.title,
      authorId: userId,
      categories: cat,
      description: inputData?.description,
      published: publish,
      slug: sg,
    });
  };
  useEffect(() => {
    if (SaveMutation.isSuccess) {
      utils.post.invalidate();
      setInputdata({
        title: "",
        content: "",
        postPhoto: "",
        slug: "",
        published: false,
        author: "",
        description: "",
      });
      setCat([]);
      setSelectFile(null);
      setPreview(null);
      if (SaveMutation.data[0].published) {
        toast.success("Post is Created sucessfully");
        navigate.push("/#post");
      } else {
        toast.info("Post is Saved in Draft");
        navigate.push("/#dashboard");
      }
    }
  }, [SaveMutation.isSuccess]);
  return (
    <>
      <label htmlFor="title">
        <input
          type="text"
          name="title"
          className="w-full outline-none  border dark:border-white rounded-xl p-2 capitalize"
          id="title"
          value={inputData.title}
          placeholder="Enter your Title "
          onChange={(e) =>
            setInputdata((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </label>
      <label htmlFor="content">
        <textarea
          name="content"
          id="content"
          value={inputData.content}
          rows={2}
          onChange={(e) =>
            setInputdata((p) => ({ ...p, content: e.target.value }))
          }
          className="w-full border p-2 dark:border-gray-400 resize-none outline-none"
          placeholder="Enter your Content "
        ></textarea>
      </label>
      <label htmlFor="name">
        <input
          type="text"
          name="name"
          id="name"
          className="w-full outline-none  border dark:border-gray-400 rounded-xl  p-2 capitalize"
          value={inputData.author}
          onChange={(e) =>
            setInputdata((prev) => ({ ...prev, author: e.target.value }))
          }
          placeholder="Enter your name "
        />
      </label>
      <div>
        <div className="flex gap-3 w-full p-2 flex-wrap">
          {cat.length > 0 &&
            cat.map((v, i) => {
              return (
                <div
                  key={i}
                  className="relative shadow-xs dark:border-gray-400
                         dark:shadow-gray-200 shadow-gray-600 pl-2 rounded-xs pr-2 "
                >
                  <span className="pr-1">{v}</span>
                  <span
                    className="absolute -top-1 cursor-pointer text-gray-700 text-shadow-xs text-shadow-gray-300"
                    onClick={() =>
                      setCat((prev) => prev.filter((val, index) => index != i))
                    }
                  >
                    x
                  </span>
                </div>
              );
            })}
        </div>
      </div>
      <label htmlFor="cat">
        <input
          type="text"
          name="cat"
          id="cat"
          autoComplete="off"
          className="w-full outline-none border dark:border-gray-400 p-2 capitalize"
          placeholder="Enter your category"
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              setCat((prev) => [...prev, category]);
              setCategory("");
            }
          }}
          value={category}
        />
      </label>
      <label htmlFor="discription_cat">
        <input
          type="text"
          name="discription_cat"
          autoComplete="off"
          className="w-full outline-none dark:border-gray-400 border p-2 capitalize"
          id="discription_cat"
          value={inputData.description}
          onChange={(e) =>
            setInputdata((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Enter Category Discription"
        />
      </label>
      {preview && mutations.isSuccess && (
        <div className="flex justify-center w-full">
          <Image
            src={preview}
            alt="Image preview"
            width={300}
            height={300}
            className=""
          />
        </div>
      )}
      <input
        type="file"
        name="file"
        id="file"
        ref={file}
        onChange={handleFilechange}
        accept="image/jpeg|image/png|image/jpg"
        hidden
      />
      <div className="flex justify-center">
        <label
          htmlFor="file"
          className="flex rounded-xl border cursor-pointer w-full p-2 justify-center"
        >
          {selectFile ? (
            selectFile.name
          ) : (
            <RiImageAddFill size={100} color="gray" />
          )}
        </label>
      </div>
      <div className="flex justify-between p-2">
        <button
          className="border p-2 rounded-xl text-blue-700  cursor-pointer"
          onClick={() => handleSavePost(false)}
        >
          Save as Draft
        </button>
        <button
          className="border p-2 rounded-xl text-green-600 cursor-pointer"
          onClick={() => handleSavePost(true)}
        >
          Share
        </button>
      </div>
    </>
  );
}

export default PostInput;
