import PartnerList from "@/components/admin components/partner";
import RightSideBar from "@/components/admin components/rightBar";

const MyCourses = () => {
  return (
    <div className='relative w-screen h-screen mt-4'>
      <PartnerList className='flex-grow' />
      {/* <RightSideBar /> */}
    </div>
  );
};

export default MyCourses;
