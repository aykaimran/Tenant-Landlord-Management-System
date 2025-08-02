import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Tenantsidebar';
import { fetchAllNotifications } from '../services/tenantnotificationservice';
import { Eye, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TenantNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedNotification, setViewedNotification] = useState(null);

  const navigate = useNavigate(); // initialize navigation

  const userName = localStorage.getItem("userName");

  useEffect(() => {
      if (!userName) {
          navigate("/signin");
      }
  }, [userName, navigate]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchAllNotifications(userName);
        setNotifications(data);
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleView = (notificationID) => {
    navigate(`/viewtenantnotifications/${notificationID}`);
  };


  return (
    <div className="flex font-[Lexend]">
      <Sidebar />
      <div className="flex-1 bg-[#E6E6E6] overflow-x-hidden">
        <div className="pl-[80px] pr-[50px] mt-[10px]">
          <h1 className="text-[#081E4A] text-[54px] font-bold">Notifications</h1>
          <p className="text-[15px] text-[#4D4D4D] font-light">View your notifications.</p>
        </div>

        {/* Notification Table Container */}
        <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md relative w-[70vw] h-[50vh]">
          {/* Sticky Header */}
          <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium text-gray-700 sticky top-0 z-10">
            <div className="col-span-3 text-[12px]">Subject</div>
            <div className="col-span-3 text-[12px]">From Owner</div>
            <div className="col-span-3 text-[12px]">Property</div>
            <div className="col-span-2 text-[12px]">Date</div>
            <div className="col-span-1 text-[12px] justify-start pl-2">View</div>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto max-h-[40vh]">
            {loading ? (
              <div className="text-center p-3 text-gray-700">Loading notifications...</div>
            ) : error ? (
              <div className="text-red-500 p-3 text-center">{error}</div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-600 text-center py-6">No notifications found</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationID}
                  className="grid grid-cols-12 p-3 border-b border-gray-200 items-center"
                >
                  <div className="col-span-3 text-[14px] font-medium">{notification.subject}</div>
                  <div className="col-span-3 text-[14px] text-gray-600">{notification.fromOwner}</div>
                  <div className="col-span-3 text-[14px] text-gray-600">{notification.propertyName || 'N/A'}</div>
                  <div className="col-span-2 text-[14px] text-gray-600">
                    {notification.sentDate ? new Date(notification.sentDate).toLocaleDateString() : 'No date'}
                  </div>
                  <div className="col-span-1 flex justify-end pr-3">
                    <button
                      className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-2 rounded w-[80px] cursor-pointer"
                      onClick={() => handleView(notification.notificationID)}  // Navigate to detailed view
                    >
                      <span className="text-[14px]">View</span>

                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notification Count */}

        <div className="w-[24vw] flex flex-col items-center rounded-[16px] p-[10px] bg-white text-[#081E4A] font-medium ml-[80px] mt-[15px]">
          <h1 className="text-[36px]">Total Notifications</h1>
          <h1 className="text-[32px]">{notifications.length}</h1>
        </div>
      </div>
    </div>
  );
};

export default TenantNotifications;
