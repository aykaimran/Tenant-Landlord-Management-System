import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message);
      } else if (paymentIntent?.status === 'succeeded') {
        console.log("Payment succeeded, calling onSuccess...");
        setMessage('✅ Payment succeeded!');
        onSuccess();
      } else {
        setMessage({
          processing: '⏳ Payment processing...',
          requires_payment_method: '❌ Payment failed. Please try again.',
        }[paymentIntent?.status] || '⚠️ Unexpected status.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('❌ An error occurred during payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Processing...' : `Pay Rs. ${amount.toFixed(2)}`}
          </button>
        </div>
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 
            message.includes('❌') ? 'bg-red-100 text-red-700' : 
            'bg-yellow-100 text-yellow-700'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default StripePaymentForm;