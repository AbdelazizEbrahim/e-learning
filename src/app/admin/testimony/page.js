import TestimonyList from "@/components/admin components/testimony";
import RightSideBar from "@/components/admin components/rightBar";

const MyCourses = () => {
  return (
    <div className='relative w-screen h-screen mt-4'>
      <TestimonyList className='flex-grow' />
      {/* <RightSideBar /> */}
    </div>
  );
};

export default MyCourses;
