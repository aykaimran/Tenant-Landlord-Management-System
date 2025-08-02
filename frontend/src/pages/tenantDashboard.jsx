import React, { useEffect, useState } from 'react';
import tenantDashboardService from '../services/tenantdashboardservice';
import { FaHome, FaCalendar, FaDollarSign, FaUserAlt } from 'react-icons/fa';
import Histogram from "../utility/Histogram";
import Sidebar from '../components/Tenantsidebar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const TenantDashboard = () => {
  const navigate = useNavigate();

  const [totalOwners, setTotalOwners] = useState(0);
  const [totalRentedProperties, setTotalRentedProperties] = useState(0);
  const [totalRentPaid, setTotalRentPaid] = useState(0);
  const [upcomingDueDate, setUpcomingDueDate] = useState('N/A');
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [currentTenant, setCurrentTenant] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('userID');
    if (storedId && storedId !== "null") {
      setUserID(storedId);
    } else {
      console.error('No userID found in localStorage');
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    if (!userID) return;

    const fetchTenantAndDashboard = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/tenants/userName/${userID}`);
        const tenant = res.data;
        setCurrentTenant(tenant);

        const userName = tenant.userName;
        localStorage.setItem("userName", userName); // or whatever key you use
        const owners = await tenantDashboardService.getTotalOwners(userName);
        const rentedProperties = await tenantDashboardService.getRentedProperties(userName);
        const rentPaid = await tenantDashboardService.getTotalRentPaid(userName);
        const dueDate = await tenantDashboardService.getUpcomingDueDate(userName);

        setTotalOwners(owners);
        setTotalRentedProperties(rentedProperties);
        setTotalRentPaid(rentPaid);
        setUpcomingDueDate(dueDate);
      } catch (error) {
        console.error('Error loading tenant dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantAndDashboard();
  }, [userID]);

  const userName = currentTenant?.userName || '...';

  return (
    <div className="flex font-[Lexend]">
      <Sidebar />
      <div className="w-[80vw] bg-[#E6E6E6] h-screen">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-[80px] mt-[10px]">
          <h1 className="text-[#081E4A] text-[54px] font-bold">Dashboard</h1>
          <Link to="/tenantDetails" className="flex justify-center items-center gap-3 cursor-pointer">
            <div className="rounded-[50%] w-[50px] h-[50px] text-white text-[28px] bg-amber-950 flex items-center justify-center">
              {userName[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-[18px] text-[#292D32] font-medium">{userName}</h3>
              <p className="text-[12px] text-[#292D32]">Tenant</p>
            </div>
          </Link>
        </div>

        {/* Top Cards (Welcome, Manage Properties, Manage Notifications) */}
        <div className="flex w-[100%] justify-between pl-[80px] pr-[50px] mt-[10px]">
          {/* Welcome Back Card */}
          <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[26vw] justify-between">
            <div className="flex flex-col gap-[40px]">
              <h1 className="text-[18px]">Welcome Back {userName}!</h1>
              <p className="text-[15px] text-[#949494]">Its good to see you again</p>
            </div>
            <img width={59} src="icons/Hi-Icon.svg" alt="" />
          </div>

          {/* Manage Properties */}
          <div className="flex relative rounded-[15px] justify-between  bg-[url(/Images/bluePatternBg.png)] w-[22vw] bg-no-repeat bg-cover pl-[20px] pt-[20px] pr-[20px]">
            <div className="flex flex-col gap-[15px]">
              <h1 className="text-[18px] text-white">Manage Properties</h1>
              <p className="text-[15px] text-[#ffffff] font-extralight">View and pay for rented  <br /> properties.</p>
            </div>
            <Link to="/tenantMngProperties" className="bg-white absolute bottom-4 cursor-pointer right-4 h-[40px] w-[100px] rounded-[8px] text-[#3C21F7] text-[12px] font-bold flex justify-center items-center">View</Link>
          </div>

          {/* Manage Notifications */}

          <div className="flex relative rounded-[15px] justify-between  bg-[url(/Images/lightBlueBg.png)] w-[22vw] bg-no-repeat bg-cover pl-[20px] pt-[20px] pr-[20px]">
            <div className="flex flex-col gap-[15px]">
              <h1 className="text-[18px] text-white">Manage Notifications</h1>
              <p className="text-[15px] text-[#ffffff] font-extralight">View notifications received</p>
            </div>

            <Link to="/tenantNotifications" className="bg-white cursor-pointer absolute bottom-4 right-4 h-[40px] w-[100px] rounded-[8px] text-[#3C21F7] text-[12px] font-bold flex justify-center items-center">View</Link>
          </div>
        </div>

        {/* Dashboard Info Cards */}
        <div className="flex w-[100%] justify-between pl-[80px] pr-[50px] mt-[10px]">
          {/* Total Owners */}
          <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw]">
            <div className="w-full">
              <h1 className="text-[#343434] text-[20px]">Total Owners</h1>
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[#232323] text-[24px] font-bold">
                    {loading ? 'Loading...' : totalOwners.toLocaleString()}
                  </h1>
                  <p className="text-[#949494] text-[12px]">Owners</p>
                </div>
                <img src="icons/User.svg" alt="" className="w-[50px] h-[50px]" />
              </div>
            </div>
          </div>

          {/* Rented Properties */}
          <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw]">
            <div className="w-full">
              <h1 className="text-[#343434] text-[20px]">Rented Properties</h1>
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[#232323] text-[24px] font-bold">
                    {loading ? 'Loading...' : totalRentedProperties}
                  </h1>
                  <p className="text-[#949494] text-[12px]">Properties</p>
                </div>
                <img src="icons/Home-Icon.svg" alt="" className="w-[50px] h-[50px]" />
              </div>
            </div>
          </div>


          {/* Total Rent Paid */}
          <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw]">
            <div className="w-full">
              <h1 className="text-[#343434] text-[20px]">Total Rent Paid</h1>
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[#232323] text-[24px] font-bold">
                    {loading ? 'Loading...' : totalRentPaid}
                  </h1>
                  <p className="text-[#949494] text-[12px]">PKR</p>
                </div>
                <img src="icons/Money-Bag.svg" alt="" className="w-[50px] h-[50px]" />
              </div>
            </div>
          </div>


          {/* Upcoming Due Date */}


          <div className="flex bg-white px-[20px] py-[20px] gap-[30px] rounded-[15px] w-[17vw]">
            <div className="w-full">
              <h1 className="text-[#343434] text-[20px]">Upcoming Due Date</h1>
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[#232323] text-[24px] font-bold">
                    {loading ? 'Loading...' : upcomingDueDate}
                  </h1>
                  <p className="text-[#949494] text-[12px]">Date</p>
                </div>
                <img src="icons/calender.svg" alt="" className="w-[50px] h-[50px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Payments Histogram */}
        <div className="mt-[10px] w-[80vw] pl-[80px] pr-[50px]">
          <Histogram />
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
