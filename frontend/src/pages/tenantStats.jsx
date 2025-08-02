import { useState, useEffect } from "react";
//import Sidebar from "../utility/tenantSidebar"; // Adjust path as necessary
import Histogram from "../utility/Histogram"; // Adjust path as necessary
import { FaHome, FaCalendar, FaCreditCard, FaDollarSign, FaUserAlt } from "react-icons/fa";
import tenantStatsService from '../services/tenantstatsservice';  // Adjust path as necessary
import Sidebar from "../components/Tenantsidebar";
import { useNavigate } from "react-router-dom";

const TenantStats = () => {
    const [rentedProperties, setRentedProperties] = useState(0);
    const [lastPaymentDate, setLastPaymentDate] = useState('N/A');
    const [upcomingDueDate, setUpcomingDueDate] = useState('N/A');
    const [totalPaymentsMade, setTotalPaymentsMade] = useState(0);
    const [totalRentPaid, setTotalRentPaid] = useState(0);
    const [yearlyRentPaid, setYearlyRentPaid] = useState(0);
    const [averageRentPaid, setAverageRentPaid] = useState(0);
    const [totalOwners, setTotalOwners] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // initialize navigation

    const userName = localStorage.getItem("userName");

    useEffect(() => {
        if (!userName) {
            navigate("/signin");
        }
    }, [userName, navigate]);
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);  // Start loading

            try {
                const rented = await tenantStatsService.getRentedProperties(userName);
                setRentedProperties(rented || 0);

                const lastDate = await tenantStatsService.getLastPaymentDate(userName);
                setLastPaymentDate(lastDate || 'N/A');

                const dueDate = await tenantStatsService.getUpcomingDueDate(userName);
                setUpcomingDueDate(dueDate || 'N/A');

                const totalPayments = await tenantStatsService.getTotalPaymentsMade(userName);
                setTotalPaymentsMade(totalPayments || 0);

                const totalRent = await tenantStatsService.getTotalRentPaid(userName);
                setTotalRentPaid(totalRent || 0);

                const yearlyRent = await tenantStatsService.getYearlyRentPaid(userName);
                setYearlyRentPaid(yearlyRent || 0);

                const avgRent = await tenantStatsService.getAverageRentPaid(userName);
                setAverageRentPaid(avgRent || 0);

                const owners = await tenantStatsService.getTotalOwners(userName);
                setTotalOwners(owners || 0);

            } catch (error) {
                console.error("Error fetching tenant stats:", error);
            } finally {
                setLoading(false);  // Stop loading
            }
        };

        fetchStats();
    }, [userName]);

    return (
        <div className="flex font-[Lexend]">
            <Sidebar />
            <div className="w-[80vw] bg-[#E6E6E6] min-h-screen">

                {/* Header */}
                <div className="flex justify-between items-center px-[80px] mt-[10px]">
                    <h1 className="text-[#081E4A] text-[54px] font-bold">Statistics</h1>
                </div>

                {/* Stats Grid */}
                <div className="flex w-[100%] justify-between h-fit gap-[10px] pl-[80px] pr-[50px] mt-[10px]">
                    <StatBox
                        icon="/icons/Home-Icon.svg"
                        title="Rented Properties"
                        value={rentedProperties}
                        subtitle="Properties"
                        loading={loading}
                    />
                    <StatBox
                        icon="/icons/calender.svg"
                        title="Last Payment Date"
                        value={lastPaymentDate}
                        subtitle="Date"
                        loading={loading}
                    />
                    <StatBox
                        icon="/icons/calender.svg"
                        title="Upcoming Due Date"
                        value={upcomingDueDate}
                        subtitle="Date"
                        loading={loading}
                    />
                    <StatBox
                        icon="/icons/heartrate.svg"
                        title="Total Payments Made"
                        value={totalPaymentsMade}
                        subtitle="Payments"
                        loading={loading}
                    />
                </div>
                <div className="flex w-[100%] justify-between h-fit gap-[10px] pl-[80px] pr-[50px] mt-[10px]">

                    <StatBox
                        icon="/icons/Money-Bag.svg"
                        title="Total Rent Paid"
                        value={totalRentPaid}
                        subtitle="PKR"
                        loading={loading}
                    />
                    <StatBox
                        icon="/icons/Money-Bag.svg"
                        title="Yearly Rent Paid"
                        value={yearlyRentPaid}
                        subtitle="PKR"
                        loading={loading}
                    />
                    <StatBox
                        icon="/icons/Money-Bag.svg"
                        title="Average Rent Paid"
                        value={averageRentPaid.toFixed(2)}
                        subtitle="PKR"
                        loading={loading}
                    />
                    <StatBox
                        icon="/icons/User.svg"
                        title="Total Owners"
                        value={totalOwners}
                        subtitle="Owners"
                        loading={loading}
                    />
                </div>

                {/* Histogram */}
                <div className="mt-[10px] w-[80vw] pl-[80px] pr-[50px]">
                    <Histogram />
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ icon, title, value, subtitle, loading }) => (

    <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[33vw]">
        <div className="w-full">
            <h1 className="text-[#343434] text-[20px]  mb-[5px]">{title}</h1>
            <div className="flex justify-between  mb-[5px]">
                <div>
                    <h1 className="text-[#232323] text-[24px] font-bold">
                        {loading ? 'Loading...' :
                            (typeof value === 'number' ? value.toLocaleString() : value)}

                    </h1>
                    <p className="text-[#949494] text-[12px]">{subtitle}</p>
                </div>
                <img className="w-[45px] h-[45px]" src={icon} alt="" />
            </div>
        </div>
    </div>
);

export default TenantStats;
