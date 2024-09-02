import Dashboard from "@/components/common components/courseList";
import Sidebar from "@/components/user components/sideBar";

export default function courseList(){
    
    return (
        <div className="relative w-screen h-screen mt-5">
            <Dashboard />
            {/* <Sidebar /> */}
        </div>
    )
}