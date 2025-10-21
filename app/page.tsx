import React from "react";
import ToggleBtnMode from "./_component/ToggleBtnMode";
import ThreeDot from "./_component/ThreeDot";
import DashBoard from "./_component/DashBoard";
import AllPost from "./_component/AllPost";

function page() {
  return (
    <>
      <div className="md:max-w-[1000px] md:m-auto md:p-4 flex flex-col item-center">
        <div>
          <DashBoard />
        </div>
        <div>
          <AllPost />
        </div>
      </div>
    </>
  );
}

export default page;
