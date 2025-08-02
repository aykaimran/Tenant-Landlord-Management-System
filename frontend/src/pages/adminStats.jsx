import { useEffect, useState } from "react";
import Sidebar from "../utility/adminSidebar";
import Histogram from "../utility/AdminHistogram";
import axios from "axios";
import AdminPieChart from "../utility/AdminPieChart";

import { useNavigate } from "react-router-dom";

const AdminStats = () => {
    const [tenantCount, setTenantCount] = useState(0);
    const [ownerCount, setOwnerCount] = useState(0);
    const [propertyCount, setPropertyCount] = useState(0);
    const [paymentCount, setPaymentCount] = useState(0);
    const [totalPaymentAmount, setTotalPaymetAmount] = useState(0);
    const [avgRent, setavgRent] = useState(0);
    const [occupancyRate, setOccupancyRate] = useState(0);
    const [yearlyRent, setYearlyRent] = useState(0);
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
        axios.get("http://localhost:8080/payments/count")
            .then(res => setPaymentCount(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:8080/properties/count")
            .then(res => setPropertyCount(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:8080/owners/count")
            .then(res => setOwnerCount(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:8080/tenants/count")
            .then(res => setTenantCount(res.data))
            .catch(err => console.error(err));
        axios.get("http://localhost:8080/properties/averageRent")
            .then(res => setavgRent(res.data))
            .catch(err => console.error(err));
        axios.get("http://localhost:8080/payments/totalPaymentAmount")
            .then(res => setTotalPaymetAmount(res.data))
            .catch(err => console.error(err));
        axios.get("http://localhost:8080/properties/occupancyRate")
            .then(res => setOccupancyRate(res.data))
            .catch(err => console.error(err));
        axios.get("http://localhost:8080/payments/yearlyRent")
            .then(res => setYearlyRent(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="flex font-[Lexend]">
            <Sidebar />
            <div className=" w-[80vw] bg-[#E6E6E6]">
                {/* top bar showing dashboard and profile */}
                <div className="flex w-[100%] content-center justify-between pl-[80px] pr-[50px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Statistics</h1>

                </div>


                {/* Top 4 boxes */}
                <div className="flex w-[100%] justify-between h-fit gap-[10px] pl-[80px] pr-[50px] mt-[10px]">
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]">Total Properties</h1>
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">{propertyCount ? propertyCount.toLocaleString() : "0"}                                    </h1>
                                    <p className="text-[#949494] text-[12px]">Properties</p>
                                </div>
                                <img className="w-[45px] h-[45px]" src="icons/Home-Icon.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]">Total Tenants</h1>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">{tenantCount ? tenantCount.toLocaleString() : "0"}</h1>
                                    <p className="text-[#949494] text-[12px]">Tenants</p>
                                </div>
                                <img className="w-[50px] h-[50px]" src="icons/User.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]">Total Owners</h1>
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">{ownerCount ? ownerCount.toLocaleString() : "0"}</h1>
                                    <p className="text-[#949494] text-[12px]">Owners</p>
                                </div>
                                <img className="w-[50px] h-[50px]" src="icons/User.svg" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]  mb-[5px]">Occupancy Rate</h1>
                            <div className="flex justify-between  mb-[5px]">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">{occupancyRate ? occupancyRate.toFixed(2) : "0.00"}%</h1>
                                    <p className="text-[#949494] text-[12px]">Properties</p>
                                </div>
                                <img className="w-[45px] h-[45px]" src="icons/heartrate.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Last 4 boxes */}
                <div className="flex w-[100%] justify-between h-fit gap-[10px] pl-[80px] pr-[50px] mt-[10px]">
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]  mb-[5px]">Total Payments Made</h1>
                            <div className="flex justify-between  mb-[5px]">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">{paymentCount ? paymentCount.toLocaleString() : "0"}</h1>
                                    <p className="text-[#949494] text-[12px]">Payments</p>
                                </div>
                                <img className="w-[45px] h-[45px]" src="icons/heartrate.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]">Yearly Rent</h1>
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">{yearlyRent ? yearlyRent.toLocaleString() : "0"}</h1>
                                    <p className="text-[#949494] text-[12px]">PKR</p>
                                </div>
                                <img className="w-[45px] h-[45px]" src="icons/Money-Bag.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]">Average Rent Amount</h1>
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">
                                        {avgRent ? Number(avgRent).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                                    </h1>
                                    <p className="text-[#949494] text-[12px]">PKR</p>
                                </div>
                                <img className="w-[45px] h-[45px]" src="icons/Money-Bag.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
                        <div className="w-full">
                            <h1 className="text-[#343434] text-[20px]  mb-[5px]">Total Payments</h1>
                            <div className="flex justify-between  mb-[5px]">
                                <div>
                                    <h1 className="text-[#232323] text-[24px] font-bold">{totalPaymentAmount ? totalPaymentAmount.toLocaleString() : "0"}</h1>
                                    <p className="text-[#949494] text-[12px]">PKR</p>
                                </div>
                                <img className="w-[45px] h-[45px]" src="icons/Money-Bag.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-[80vw] pl-[80px] pr-[50px] gap-[10px] mt-5 items-center justify-start content-center">
                    <div className="flex flex-col rounded-[15px] w-[75%] h-[40vh] items-center justify-center">
                        <Histogram />
                    </div>

                    {/* Pie Chart */}
                    <div className="flex flex-col bg-white rounded-[15px] w-[24%] h-[40vh] items-center justify-center">
                        <p className="text-[20px] font-bold">Property Areas</p>
                        <AdminPieChart />
                    </div>
                </div>

            </div>


        </div>
    );
};

export default AdminStats;
