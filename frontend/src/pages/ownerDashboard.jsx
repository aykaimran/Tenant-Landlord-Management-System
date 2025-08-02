import { useState, useEffect } from "react";
import Sidebar from "../utility/ownerSidebar";
import Histogram from "../utility/ownerHistogram";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
    const [tenantCount, setTenantCount] = useState(0);
    const [propertyCount, setPropertyCount] = useState(0);
    const [paymentCount, setPaymentCount] = useState(0);
    const [occupancyRate, setOccupancyRate] = useState(0);
    const [owner, setOwner] = useState(null)
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
        if (userId) {
            axios.get(`http://localhost:8080/owners/id/${userId}`)
                .then(res => setOwner(res.data))
                .catch(err => console.error(err));
            axios.get(`http://localhost:8080/tenants/count/by-owner/${userId}`)
                .then(res => setTenantCount(res.data))
                .catch(err => console.error(err));
            axios.get(`http://localhost:8080/properties/count/by-owner/${userId}`)
                .then(res => setPropertyCount(res.data))
                .catch(err => console.error(err));
            axios.get(`http://localhost:8080/payments/count/by-owner/${userId}`)
                .then(res => setPaymentCount(res.data))
                .catch(err => console.error(err));
            axios.get(`http://localhost:8080/properties/occupancyRate/by-owner/${userId}`)
                .then(res => setOccupancyRate(res.data))
                .catch(err => console.error(err));
        }
    }, [userId]);

    return (
        <div className="flex font-[Lexend]">
            <Sidebar />
            <div className=" w-[80vw] bg-[#E6E6E6]">
                {/* top bar showing dashboard and profile */}
                <div className="flex w-[100%] content-center justify-between pl-[80px] pr-[50px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Dashboard</h1>
                    <Link to="/ownerDetails" className="flex justify-center items-center gap-3 cursor-pointer">
                        <div className="rounded-[50%] w-[50px] h-[50px] text-white text-[28px] bg-amber-950 flex items-center justify-center">
                            {owner?.fullName?.[0]}
                        </div>
                        <div>
                            <h3 className="text-[18px] text-[#292D32] font-medium">{owner?.fullName}</h3>
                            <p className="text-[12px] text-[#292D32]">Owner</p>
                        </div>
                    </Link>
                </div>

                {/* top 3 boxes */}
                <div className="flex w-[100%] justify-between pl-[80px] pr-[50px] mt-[20px]">
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[26vw] justify-between "                    >
                        <div className="flex flex-col gap-[40px]">
                            <h1 className="text-[18px]">Welcome Back {owner?.fullName}</h1>
                            <p className="text-[15px] text-[#949494]">Its good to see you again</p>
                        </div>
                        <img width={59} src="icons/Hi-Icon.svg" alt="" />
                    </div>
                    <div className="flex relative rounded-[15px] justify-between  bg-[url(Images/bluePatternBg.png)] w-[22vw] bg-no-repeat bg-cover pl-[20px] pt-[20px] pr-[20px]">
                        <div className="flex flex-col gap-[15px]">
                            <h1 className="text-[18px] text-white">Manage Properties</h1>
                            <p className="text-[15px] text-[#ffffff] font-extralight">View, edit, or delete <br /> Properties.</p>
                        </div>
                        <Link to="/ownerMngProperties" className="bg-white absolute bottom-4 cursor-pointer right-4 h-[40px] w-[100px] rounded-[8px] text-[#3C21F7] text-[12px] font-bold flex justify-center items-center">View</Link>
                    </div>
                    <div className="flex relative rounded-[15px] justify-between  bg-[url(Images/lightBlueBg.png)] w-[22vw] bg-no-repeat bg-cover pl-[20px] pt-[20px] pr-[20px]">
                        <div className="flex flex-col gap-[15px]">
                            <h1 className="text-[18px] text-white">Manage Notifications</h1>
                            <p className="text-[15px] text-[#ffffff] font-extralight">View Notifications<br /> received.</p>
                        </div>

                        <Link to="/ownerNotifications" className="bg-white cursor-pointer absolute bottom-4 right-4 h-[40px] w-[100px] rounded-[8px] text-[#3C21F7] text-[12px] font-bold flex justify-center items-center">View</Link>
                    </div>
                </div>
                {/* mid 4 boxes */}
                <div className="flex w-[100%] justify-between pl-[80px] pr-[50px] mt-[30px]">
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw] justify-between items-center">
                        <div>
                            <h1 className="text-[#343434] text-[20px]">Total Tenants</h1>
                            <h1 className="text-[#232323] text-[24px] font-bold">{tenantCount ? tenantCount.toLocaleString() : "0"}</h1>
                            <p className="text-[#949494] text-[12px]">Tenants</p>
                        </div>
                        <img src="icons/User.svg" alt="" className="w-[50px] h-[50px]" />
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw] justify-between items-center">
                        <div>
                            <h1 className="text-[#343434] text-[20px]">Total Properties</h1>
                            <h1 className="text-[#232323] text-[24px] font-bold">{propertyCount ? propertyCount.toLocaleString() : "0"}</h1>
                            <p className="text-[#949494] text-[12px]">Properties</p>
                        </div>
                        <img src="icons/Home-Icon.svg" alt="" className="w-[45px] h-[45px]" />
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw] justify-between items-center">
                        <div>
                            <h1 className="text-[#343434] text-[20px]">Total Payments</h1>
                            <h1 className="text-[#232323] text-[24px] font-bold">{paymentCount ? paymentCount.toLocaleString() : "0"}</h1>
                            <p className="text-[#949494] text-[12px]">PKR</p>
                        </div>
                        <img src="icons/Money-Bag.svg" alt="" className="w-[50px] h-[50px]" />
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw] justify-between items-center">
                        <div>
                            <h1 className="text-[#343434] text-[20px]">Occupancy Rate</h1>
                            <h1 className="text-[#232323] text-[24px] font-bold">{occupancyRate ? occupancyRate.toLocaleString() : "0"}</h1>
                            <p className="text-[#949494] text-[12px]">Properties</p>
                        </div>
                        <img src="icons/rate.svg" alt="" className="w-[50px] h-[50px]" />
                    </div>
                </div>

                {/* Histogram */}
                <div className="mt-[30px] w-[80vw] pl-[80px] pr-[50px]">
                    <Histogram />
                </div>

            </div>


        </div>
    );
};

export default OwnerDashboard;
