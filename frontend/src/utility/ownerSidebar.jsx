import { Link, useLocation ,useNavigate} from "react-router-dom";
import { useRef } from "react";
import { User, Building, Users, FileText, BarChart2, LogOut, LayoutDashboard, House, Bell } from "lucide-react";

const Sidebar = (setPage) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleLogout=()=>{
        localStorage.removeItem('userID');
        navigate("/signin");
    }

    const linkClass = (path) =>
        `flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition ${location.pathname === path ? "bg-blue-600 text-white" : "text-gray-300"
        }`;

    return (
        <div className="h-screen w-[20vw] bg-black text-white flex flex-col justify-between py-6">
            {/* Logo Section */}
            <div className="flex items-center justify-center px-6 mt-[10px]">
                <img src={"logo.svg"} alt="Rentinel Logo" className="w-[180px]" />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col px-4">
                <div className="mb-10">
                    <Link to="/ownerDashboard" className={linkClass("/ownerDashboard")}>
                        <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
                    </Link>
                    <Link to="/ownerMngProperties" className={linkClass("/ownerMngProperties")}>
                        <House className="w-5 h-5 mr-2" /> Properties
                    </Link>
                    <Link to="/ownerNotifications" className={linkClass("/ownerNotifications")}>
                        <Bell className="w-5 h-5 mr-2" /> Notifications
                    </Link>
                    <Link to="/ownerDetails" className={linkClass("/ownerDetails")}>
                        <User className="w-5 h-5 mr-2" /> Account Details
                    </Link>
                </div>

                <div className="mb-12">
                    <div className="border-t border-gray-700 my-4" />
                    <div className="text-gray-400 text-sm px-4">Report</div>
                    <Link to="/ownerMngPayments" className={linkClass("/ownerMngPayments")}>
                        <FileText className="w-5 h-5 mr-2" /> Payment History
                    </Link>
                    <Link to="/ownerStatistics" className={linkClass("/ownerStatistics")}>
                        <BarChart2 className="w-5 h-5 mr-2" /> Statistics
                    </Link>
                </div>
            </nav>

            {/* Logout Button */}
            <div className="px-4 w-full flex items-center justify-center">
                <button className="w-[60%] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer transition"
                 onClick={handleLogout}>
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
