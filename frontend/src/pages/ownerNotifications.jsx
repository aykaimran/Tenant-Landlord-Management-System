import { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/ownerSidebar";
import axios from "axios";
import { Pencil, Trash2, Eye, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OwnerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [viewedNotification, setViewedNotification] = useState(null);
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const storedId = localStorage.getItem('userID');
        if (storedId !== null && storedId !== "null") {
            setUserId(storedId);
        } else {
            console.error('No userId found in localStorage');
            navigate("/signin")
        }
    }, []);

    useEffect(() => {
        const storedId = localStorage.getItem('userID');
        if (storedId !== null && storedId !== "null") {
            setUserId(storedId);
        } else {
            console.error('No userId found in localStorage');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8080/ownerNotifcations/${userId}`)
                .then(response => {
                    console.log(response.data);
                    setNotifications(response.data);
                })
                .catch(error => {
                    console.error("Error fetching notifications:", error);
                });
        }
    }, [userId]);

    const handleView = (notification) => {
        setViewedNotification(notification);
    };

    const handleBack = () => {
        setViewedNotification(null);
    };


    return (
        <div className="flex font-[Lexend]">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] relative">
                <div className="pl-[80px] pr-[50px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Notifications</h1>
                    <p className="text-[15px] text-[#4D4D4D] font-light">View your notifications.</p>
                </div>

                <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md overflow-hidden relative w-[70vw] h-[50vh]">
                    {viewedNotification && (
                        <div className="absolute top-0 bg-white bg-opacity-90 z-50 flex rounded-lg px-8 w-[70vw] h-[50vh]">
                            <div className="p-6 w-full relative">
                                <div className="flex flex-col gap-9">
                                    <div className="w-full pr-[40px]">
                                        <div
                                            onClick={handleBack}
                                            className="w-[43px] h-[43px] cursor-pointer rounded-full bg-[#D9D9D9] flex items-center justify-center"
                                        >
                                            <ChevronLeft className="text-black" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex">
                                            <span className="w-[200px] font-medium">SUBJECT:</span>
                                            <span className="font-normal text-sm text-gray-700">{viewedNotification.subject}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-[200px] font-medium">TO:</span>
                                            <span className="font-normal text-sm text-gray-700">{viewedNotification.tenantUserName}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-[200px] font-medium">PROPERTY NAME:</span>
                                            <span className="font-normal text-sm text-gray-700">{viewedNotification.propertyName}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="w-[200px] font-medium">DATE:</span>
                                            <span className="font-normal text-base text-gray-700">{new Date(viewedNotification.sentDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-300 my-3" />
                                <div className="flex flex-col gap-4">
                                    CONTENT:
                                    <span className="font-normal text-sm text-[#081E4A]">{viewedNotification.content}</span>
                                </div>
                            </div>

                        </div>
                    )}


                    {notifications.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-[#081E4A] text-[28px] font-medium">
                            No Notification records
                        </div>
                    ) : (
                        <>

                            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 sticky top-0 z-10">
                                <div className="col-span-2">SUBJECT </div>
                                <div className="col-span-2">TO</div>
                                <div className="col-span-2">PROPERTY NAME</div>
                                <div className="col-span-2">DATE</div>
                                <div className="col-span-4 flex justify-end gap-17 pr-14">
                                    <span>VIEW</span>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[322px]">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                                        <div className="col-span-2 font-medium">{notification.subject}</div>
                                        <div className="col-span-2">{notification.tenantUserName}</div>
                                        <div className="col-span-2">{notification.propertyName}</div>
                                        <div className="col-span-2">
                                            {new Date(notification.sentDate).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-4 flex justify-end gap-2 pr-4">
                                            <button
                                                className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-3 rounded w-[112px] cursor-pointer"
                                                onClick={() => handleView(notification)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="w-[24vw] flex flex-col items-center rounded-[16px] p-[10px] bg-white text-[#081E4A] font-medium ml-[80px] mt-[15px]">
                    <h1 className="text-[34px]">Total Notifcations</h1>
                    <h1 className="text-[32px]">{notifications.length}</h1>
                </div>

            </div>
        </div>
    );
};

export default OwnerNotifications;