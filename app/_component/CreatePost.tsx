"use client";
import Link from "next/link";
import React from "react";

function CreatePost() {
  return (
    <div className="md:text-xl md:p-3 md:flex shadow-2xs shadow-gray-400 rounded-xs md:justify-around items-center leading-10">
      <div className="md:w-full text-center">
        <span className="capitalize  font-thin">share Your Idea's</span>
        <h1 className="font-bold uppercase">Let's Start , post Blog's </h1>
        <p className="font-serif">Create your Frist post </p>
      </div>
      <div className="w-full  flex md:justify-center  justify-center md:items-end p-2 ">
        <Link
          href={"/create_post"}
          className="p-2 text-center hover:shadow-blue-600 shadow-2xs border cursor-pointer w-full md:w-[100px] border-blue-800 rounded-2xl "
        >
          Create
        </Link>
      </div>
    </div>
  );
}

export default CreatePost;
