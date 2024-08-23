import AccountSettings from "@/components/instructor components/instructorAccountSetting";

const instructorAccountSetting = ()=>{
return (
    <div className='relative w-screen h-screen flex'>
        {/* <Sidebar /> */}
        <main className='flex-grow mt-4 ml-32 mr-48'>
        <AccountSettings />
        </main>
    </div>
    );
};

export default instructorAccountSetting;