import { useState, useEffect } from "react";
import Sidebar from "../utility/adminSidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDetails = () => {
    const [admin, setAdmin] = useState(null);
    const [userID, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedId = localStorage.getItem('userID');
        if (storedId !== null && storedId !== "null") {
            setUserId(storedId);
        } else {
            navigate("/signin");
        }
    }, [navigate]);

    useEffect(() => {
        if (userID) {
            axios.get(`http://localhost:8080/admin/id/${userID}`)
                .then(response => {
                    setAdmin(response.data); // assuming single admin
                })
                .catch(error => {
                    console.error("Error fetching admin:", error);
                });
        }
    }, [userID]);


    return (
        <div className="flex font-[Lexend] min-h-screen">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] px-[80px] pt-[40px]">
                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Account Details</h1>
                    <p className="text-[15px] text-[#4D4D4D] font-light ">View admin account details.</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-md p-8 w-[70vw] h-[50vh] text-[#202224]">
                    {/* Row 1 */}
                    <div className="flex mb-6 mt-[30px]">
                        <div className="mr-20 w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1 ">FULL NAME</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {admin?.fullName}
                            </div>
                        </div>
                        <div className="w-[260px] mr-20">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">USERNAME</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {admin?.userName}
                            </div>
                        </div>
                        <div className="w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">ACCOUNT CREATION DATE</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {admin?.accountCreationDate}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-300 my-6 mt-[50px]" />

                    {/* Row 2 */}
                    <div className="flex mt-[50px]">
                        <div className="mr-20 w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">EMAIL</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {admin?.email}
                            </div>
                        </div>
                        <div className="w-[260px]">
                            <h2 className="text-[18px] font-semibold text-gray-600 mb-1">CNIC</h2>
                            <div className="bg-[#E9E9E9] px-4 py-3 rounded w-full opacity-90">
                                {admin?.cnic}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetails;
