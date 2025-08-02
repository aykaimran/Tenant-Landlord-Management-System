import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Tenantsidebar';
import { fetchPaymentById } from '../services/tenantpaymenthistoryservice';
import { ChevronLeft } from 'lucide-react';

const ViewTenantPaymentHistory = () => {
  const { paymentID } = useParams();
  const [payment, setPayment] = useState(null);
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
    const loadPayment = async () => {
      try {
        const data = await fetchPaymentById(paymentID, userName);
        setPayment(data);
      } catch (err) {
        setError('Failed to load payment details');
        console.error('Failed to load payment:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentID, userName]);

  const handleBack = () => {
    navigate('/tenantpaymenthistory');
  };

  return (
    <div className="flex font-[Lexend] min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-[#E6E6E6] flex flex-col items-center">
        {/* Header */}
        <div className="pl-[80px] pr-[50px] mt-[10px] w-full">
          <h1 className="text-[#081E4A] text-[54px] font-bold">Payment Details</h1>
          <p className="text-[15px] text-[#4D4D4D] font-light">View your payment details.</p>
        </div>

        {/* White Card */}
        <div className="relative bg-white w-[70vw] h-[60vh] mt-8 rounded-lg shadow-md overflow-hidden">
          {/* Back Button */}
          <div className="absolute top-5 left-8">
            <button
              onClick={handleBack}
              className="w-[32px] h-[32px] rounded-full bg-[#D9D9D9] flex items-center justify-center"
            >
              <ChevronLeft className="text-black w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-full p-10 text-gray-700">
              Loading payment details...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full p-10 text-red-500">
              {error}
            </div>
          ) : payment ? (
            <div className="p-10 pt-16">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[14px]">
                {/* Payment ID */}
                <div>
                  <p className="font-bold mb-1">PAYMENT ID</p>
                  <div className="bg-gray-200 p-2 rounded">{payment.paymentID || 'N/A'}</div>
                </div>

                {/* Payment Date */}
                <div>
                  <p className="font-bold mb-1">PAYMENT DATE</p>
                  <div className="bg-gray-200 p-2 rounded">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</div>
                </div>

                {/* Amount */}
                <div>
                  <p className="font-bold mb-1">AMOUNT</p>
                  <div className="bg-gray-200 p-2 rounded">Rs. {payment.amount || 'N/A'}</div>
                </div>

                {/* Payment Status */}
                <div>
                  <p className="font-bold mb-1">PAYMENT STATUS</p>
                  <div className="bg-gray-200 p-2 rounded">{payment.paymentStatus || 'N/A'}</div>
                </div>

                {/* Property ID */}
                <div>
                  <p className="font-bold mb-1">PROPERTY ID</p>
                  <div className="bg-gray-200 p-2 rounded">{payment.property?.propertyID || 'N/A'}</div>
                </div>

                {/* Property Name */}
                <div>
                  <p className="font-bold mb-1">PROPERTY NAME</p>
                  <div className="bg-gray-200 p-2 rounded">{payment.property?.propertyName || 'N/A'}</div>
                </div>

                {/* Owner Name */}
                <div>
                  <p className="font-bold mb-1">OWNER NAME</p>
                  <div className="bg-gray-200 p-2 rounded">{payment.owner?.fullName || 'N/A'}</div>
                </div>


              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full p-10 text-gray-600">
              Payment not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTenantPaymentHistory;
