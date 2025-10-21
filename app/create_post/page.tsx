import PostInput from "../_component/PostInput";
function page() {
  return (
    <>
      <div className="max-w-[1000px] border rounded-xl shadow-xs mb-5 shadow-gray-600 m-auto p-3 flex flex-col gap-3">
        <PostInput />
      </div>
    </>
  );
}
export default page;
