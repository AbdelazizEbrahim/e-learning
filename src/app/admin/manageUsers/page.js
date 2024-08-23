import ManageUser from "@/components/admin components/manageUsers";
import RightSideBar from "@/components/admin components/rightBar";
import Sidebar from "@/components/admin components/sideBar";

const MyCourses = () => {
  return (
    <div className='relative w-screen h-screen'>
      {/* <Sidebar /> */}
      <ManageUser className='flex-grow' />
      <RightSideBar />
    </div>
  );
};

export default MyCourses;
