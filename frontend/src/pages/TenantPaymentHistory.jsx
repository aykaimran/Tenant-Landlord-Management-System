import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Tenantsidebar';
import { fetchTenantPaymentHistory } from '../services/tenantpaymenthistoryservice';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

const TenantPaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
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
    const loadPaymentHistory = async () => {
      try {
        const data = await fetchTenantPaymentHistory(userName);
        setPaymentHistory(data);
      } catch (err) {
        setError('Failed to load payment history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentHistory();
  }, [userName]); // Add userName to dependency array

  const handleViewClick = (paymentID) => {
    console.log('View clicked for Payment ID:', paymentID);
  };

  return (
    <div className="flex font-[Lexend] min-h-screen">
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 bg-[#E6E6E6] pr-[1rem] overflow-y-auto">
        {/* Header */}
        <div className="pl-[80px] pr-[50px] mt-[10px]">
          <h1 className="text-[#081E4A] text-[54px] font-bold">Payment History</h1>
          <p className="text-[15px] text-[#4D4D4D] font-light">View your payment history.</p>
        </div>
        {/* Payment History Container */}
        <div className="mx-[80px] mt-8 bg-white rounded-lg shadow-md relative w-[70vw] h-[50vh]">
          {/* Sticky Header */}
          <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium text-gray-700 sticky top-0 z-10">
            <div className="col-span-2 text-[12px]">Payment ID</div>
            <div className="col-span-2 text-[12px]">Amount</div>
            <div className="col-span-3 text-[12px]">Property</div>
            <div className="col-span-2 text-[12px]">Date</div>
            <div className="col-span-2 text-[12px]">Owner</div>
            <div className="col-span-1 text-[12px] justify-start pl-2">View</div>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto max-h-[300px]">
            {loading ? (
              <div className="text-center p-3 text-gray-700">Loading payment history...</div>
            ) : error ? (
              <div className="text-red-500 p-3 text-center">{error}</div>
            ) : paymentHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-6">No payment history found</p>
            ) : (
              paymentHistory.map((payment) => (
                <div
                  key={payment.paymentID}
                  className="grid grid-cols-12 p-3 border-b border-gray-200 items-center"
                >
                  <div className="col-span-2 text-[14px] font-medium">{payment.paymentID}</div>
                  <div className="col-span-2 text-[14px] text-gray-600">Rs. {payment.amount}</div>
                  <div className="col-span-3 text-[14px] text-gray-600">{payment.property?.propertyName || 'N/A'}</div>
                  <div className="col-span-2 text-[14px] text-gray-600">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="col-span-2 text-[14px] text-gray-600">{payment.owner?.fullName || 'N/A'}</div>
                  <div className="col-span-1 flex justify-end pr-3">
                    <Link to={`/viewtenantpaymenthistory/${payment.paymentID}`}>
                      <button
                        onClick={() => handleViewClick(payment.paymentID)}
                        className="text-white flex items-center justify-center gap-2 bg-[#1245A8] py-1 px-2 rounded w-[80px] cursor-pointer"
                      >
                        <span className="text-[14px]">View</span>
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Count */}
        <div className="w-[24vw] flex flex-col items-center rounded-[16px] p-[10px] bg-white text-[#081E4A] font-medium ml-[80px] mt-[15px]">
          <h1 className="text-[36px]">Total Payments</h1>
          <h1 className="text-[32px]">{paymentHistory.length}</h1>
        </div>
      </div>
    </div>
  );
};

export default TenantPaymentHistory;
