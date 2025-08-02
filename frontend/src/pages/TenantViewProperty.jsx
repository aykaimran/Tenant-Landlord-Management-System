import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Tenantsidebar';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../utility/stripeUtils';
import StripePaymentForm from '../components/StripePaymentForm';
import { createStripePaymentIntent, savePayment } from '../services/tenantpaymenthistoryservice';
import { fetchRentAssignmentsByTenantUsername } from '../services/tenantrentassignmentservice';
import { ChevronLeft } from 'lucide-react';

const TenantViewProperty = () => {
  const { propertyID } = useParams();
  const [rentAssignment, setRentAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate(); // initialize navigation

    const userName = localStorage.getItem("userName");

    useEffect(() => {
        if (!userName) {
            navigate("/signin");
        }
    }, [userName, navigate]);
  useEffect(() => {
    const loadDetails = async () => {
      try {
        console.log('Fetching rent assignment for userName:', userName, 'and propertyID:', propertyID);
        const rentAssignmentData = await fetchRentAssignmentsByTenantUsername(userName, propertyID);
        console.log('Rent assignment fetched:', rentAssignmentData);
        setRentAssignment(rentAssignmentData[0]);
      } catch (err) {
        console.error('Error loading rent assignment:', err);
        setError('Failed to load rent assignment details');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [propertyID, userName]);

  useEffect(() => {
    if (showPaymentForm && rentAssignment?.property?.fixedRent) {
      const fetchClientSecret = async () => {
        try {
          console.log('Creating payment intent for amount:', rentAssignment.property.fixedRent);
          const { clientSecret } = await createStripePaymentIntent(rentAssignment.property.fixedRent);
          console.log('Received client secret:', clientSecret);
          setClientSecret(clientSecret);
        } catch (err) {
          console.error('Error fetching client secret:', err);
          setError('Failed to initialize payment');
          setShowPaymentForm(false);
          setIsBlurred(false);
        }
      };
      fetchClientSecret();
    }
  }, [showPaymentForm, rentAssignment]);

  const handleBack = () => {
    navigate('/tenantMngProperties');
  };

  const handlePayRent = () => {
    console.log('Pay Rent button clicked');
    setShowPaymentForm(true);
    setIsBlurred(true);
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const paymentData = {
        amount: rentAssignment.property.fixedRent,
        paymentStatus: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0],
        //paymentIntentId: paymentIntentId // <-- Save Stripe paymentIntent ID if needed
      };

      await savePayment(
        paymentData,
        userName,
        rentAssignment.property.owner?.userName,
        rentAssignment.property.propertyID
      );

      setShowPaymentForm(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setIsBlurred(false); // Remove blur when success message is closed
  };

  const stripePromise = getStripe();
  const appearance = { theme: 'flat' };
  const options = { clientSecret, appearance };

  return (
    <div className="flex font-[Lexend] min-h-screen bg-[#E6E6E6] relative">
      <Sidebar /> {/* Sidebar stays fixed */}

      {/* Blurred background when payment modal is visible */}
      {isBlurred && (
        <div className="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-lg z-20"></div>
      )}

      {/* Main content layout */}
      <div className="flex-1 bg-[#E6E6E6] flex flex-col items-center relative z-10">
        {/* Header */}
        
        <div className="pl-[80px] pr-[50px] mt-[10px] w-full">
          <h1 className="text-[#081E4A] text-[54px] font-bold">Property Details</h1>
          <p className="text-[15px] text-[#4D4D4D] font-light">View the property details and make payments.</p>
        </div>
        {/* White Card Layout */}
        <div className="relative bg-white w-[70vw] h-[60vh] mt-8 rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-full p-10 text-gray-700">
              Loading property details...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full p-10 text-red-500">
              {error}
            </div>
          ) : rentAssignment && rentAssignment.property ? (
            <div className="p-5 pt-13">
              {/* Grid Layout for Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[14px]">
                <div>
                  <p className="font-bold mb-1">PROPERTY ID</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.propertyID}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">PROPERTY NAME</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.propertyName}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">OWNER NAME</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.owner?.fullName || 'N/A'}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">LOCATION</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.location}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">AREA</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.area} sq. ft.</div>
                </div>
                <div>
                  <p className="font-bold mb-1">BEDROOMS</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.numOfBedRooms}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">BATHROOMS</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.numOfBaths}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">ROOMS</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.property.numOfRooms}</div>
                </div>

                <div>
                  <p className="font-bold mb-1">RENT START DATE</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.startDate}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">RENT END DATE</p>
                  <div className="bg-gray-200 p-2 rounded">{rentAssignment.dueDate}</div>
                </div>
                <div>
                  <p className="font-bold mb-1">RENT AMOUNT</p>
                  <div className="bg-gray-200 p-2 rounded">Rs. {rentAssignment.property.fixedRent}</div>
                </div>
              </div>

              <div className="flex justify-center items-center mt-10">
                <button
                  onClick={handlePayRent}
                  className="w-32 h-10 bg-orange-400 text-white rounded-lg text-lg transform hover:scale-105 transition-all duration-300"
                >
                  Pay Rent
                </button>
              </div>
              {/* Back Button */}
              <div className="absolute top-4 left-4">
                <button
                  onClick={handleBack}
                  className="w-[32px] h-[32px] rounded-full bg-[#D9D9D9] flex items-center justify-center"
                >
                  <ChevronLeft className="text-black w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full p-10 text-gray-600">
              No property details found.
            </div>
          )}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && clientSecret && (
        <div className="absolute inset-0 flex justify-center items-center z-30 overflow-y-auto max-h-screen">
          <Elements stripe={stripePromise} options={options}>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg h-auto overflow-y-auto">
              <StripePaymentForm
                amount={rentAssignment.property.fixedRent}
                onSuccess={handlePaymentSuccess}
                onCancel={() => {
                  setShowPaymentForm(false);
                  setIsBlurred(false);
                }}
              />
            </div>
          </Elements>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="absolute inset-0 flex justify-center items-center z-40">
          <div className="bg-white p-8 rounded shadow-lg text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
            <p className="mb-4">Your payment of Rs.{rentAssignment?.property?.fixedRent} has been processed successfully.</p>
            <button
              onClick={handleCloseSuccessMessage}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantViewProperty;
