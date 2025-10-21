import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
function DashBoardSkleton() {
  return (
    <>
      <div className="p-5" id="dashboard">
        <div className="flex gap-5 justify-center">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <div className="md:flex p-2 rounded-2xl shadow-gray-600 w-full">
              <Skeleton className="w-full h-70 dark:bg-gray-600/15 bg-gray-400/30 " />
            </div>
            <div className="w-full flex flex-col gap-3 md:h-80  h-40 overflow-auto p-1">
              {[1, 2, 3].map((val, i) => {
                if (i == 0) return;
                return (
                  <div
                    key={i}
                    className="flex p-2 md:col-span-1 rounded-2xl  shadow-gray-600"
                  >
                    <Skeleton className="w-full h-30 dark:bg-gray-600/15 bg-gray-400/30" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoardSkleton;

//  <div className="p-5" id="dashboard">
//       <h2 className="font-bold text-2xl">DashBoard</h2>
//       <br />
//       {!data?.length ? (
//         <CreatePost />
//       ) : (
//         <div className="flex gap-5 justify-center">
//           {data.length && (
//             <div className="flex flex-col md:flex-row items-center gap-2 w-full">
//               <div className="md:flex p-2 rounded-2xl shadow-xs shadow-gray-600 w-full">
//                 <PostCard post={data[0]} fristpostDash={true} dashboad={true} />
//               </div>
//               <div className="w-full flex flex-col gap-3 md:h-80  h-40 overflow-auto p-1">
//                 {data.map((val, i) => {
//                   if (i == 0) return;
//                   return (
//                     <div
//                       key={val.id}
//                       className="flex p-2 md:col-span-1 rounded-2xl shadow-xs shadow-gray-600"
//                     >
//                       <PostCard post={val} dashboad={true} />
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
