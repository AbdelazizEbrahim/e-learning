import CourseList from "@/components/admin components/myCourses";
import RightSideBar from "@/components/admin components/rightBar";
import Sidebar from "@/components/admin components/sideBar";

const MyCourses = () => {
  return (
    <div className='relative w-screen h-screen mt-4'>
      {/* <Sidebar /> */}
      <CourseList className='flex-grow' />
      <RightSideBar />
    </div>
  );
};

export default MyCourses;
