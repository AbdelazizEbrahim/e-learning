import AdminAccountSettings from "@/components/admin components/adminAccountSetting";
import Sidebar from "@/components/admin components/sideBar";
import RightSideBar from "@/components/admin components/rightBar";

const AdminAccountSettingsPage = () => {
  return (
    <div className='relative w-screen h-screen flex'>
      <Sidebar />
      <main className='flex-grow mt-4 ml-32 mr-48'>
        <AdminAccountSettings />
      </main>
      <RightSideBar />
    </div>
  );
};

export default AdminAccountSettingsPage;
