import VerifyOtp from "@/components/sign components/enterOtp";
import RightSideBar from "@/components/admin components/rightBar";

const EnterOtp = () => {
  return (
    <div className='relative w-screen h-screen flex'>
      {/* <RightSideBar /> */}
      <main className='flex-grow '>
        <VerifyOtp />
      </main>
    </div>
  );
};

export default EnterOtp;
