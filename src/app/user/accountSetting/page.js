import UserAccountSettings from "@/components/user components/userAccountSetting";
import Sidebar from "@/components/user components/sideBar";
// import RightSideBar from "@/components/admin components/rightBar";

const UserAccountSettingsPage = () => {
  return (
    <div className='relative w-screen h-screen flex'>
      {/* <Sidebar /> */}
      <main className='flex-grow mt-4 ml-32 mr-48'>
        <UserAccountSettings />
      </main>
    </div>
  );
};

export default UserAccountSettingsPage;
