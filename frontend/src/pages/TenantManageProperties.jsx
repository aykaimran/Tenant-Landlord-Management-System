import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Tenantsidebar';
import { fetchAllTenantManageProperties } from '../services/tenantmanagepropertiesservice';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

const TenantManageProperties = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // initialize navigation

  const userName = localStorage.getItem("userName");

  useEffect(() => {
      if (!userName) {
          navigate("/signin");
      }
  }, [userName, navigate]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchAllTenantManageProperties(userName);
        setAssignments(data);
      } catch (err) {
        setError('Failed to load properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [userName]);

  return (
    <div className="flex font-[Lexend]">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 bg-[#E6E6E6] overflow-x-hidden">
        <div className="pl-[80px] pr-[50px] mt-[10px]">
          <h1 className="text-[#081E4A] text-[54px] font-bold">Manage Properties</h1>
          <p className="text-[15px] text-[#4D4D4D] font-light">View and manage your properties.</p>
        </div>

        {/* Properties Table Container */}
        <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md relative w-[70vw] h-[50vh]">
          {/* Sticky Header */}
          <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium text-gray-700 sticky top-0 z-10">
            <div className="col-span-3 text-[12px]">Property ID</div>
            <div className="col-span-3 text-[12px]">Property Name</div>
            <div className="col-span-3 text-[12px]">Location</div>
            <div className="col-span-2 text-[12px]">Owner</div>
            <div className="col-span-1 text-[12px] text-center">View</div>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto max-h-[40vh]">
            {loading ? (
              <div className="text-center p-3 text-gray-700">Loading properties...</div>
            ) : error ? (
              <div className="text-red-500 p-3 text-center">{error}</div>
            ) : assignments.length === 0 ? (
              <p className="text-gray-600 text-center py-6">No properties found</p>
            ) : (
              assignments.map((assignment) => {
                const property = assignment.property;
                return (
                  <div
                    key={property.propertyID}
                    className="grid grid-cols-12 p-3 border-b border-gray-200 items-center"
                  >
                    <div className="col-span-3 text-[14px] font-medium">{property.propertyID}</div>
                    <div className="col-span-3 text-[14px] text-gray-600">{property.propertyName}</div>
                    <div className="col-span-3 text-[14px] text-gray-600">{property.location}</div>
                    <div className="col-span-2 text-[14px] text-gray-600">{property.owner?.fullName || 'N/A'}</div>
                    <div className="col-span-1 flex justify-center pr-3">
                      <Link to={`/viewtenantproperty/${property.propertyID}`}>
                        <button className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-2 rounded w-[80px] cursor-pointer">
                          <span className="text-[14px]">View</span>
                          <Eye className="w-4 h-4" />

                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Property Count */}
        <div className="w-[24vw] flex flex-col items-center rounded-[16px] p-[10px] bg-white text-[#081E4A] font-medium ml-[80px] mt-[15px]">
          <h1 className="text-[36px]">Total Properties</h1>
          <h1 className="text-[32px]">{assignments.length}</h1>
        </div>
      </div>
    </div>
  );
};

export default TenantManageProperties;
