import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/payments';

// Stripe Payment Service
export const createStripePaymentIntent = async (amount, currency = "pkr") => {
  try {
    console.log('Creating Stripe payment intent with amount:', amount, 'and currency:', currency);
    const response = await axios.post(`${API_BASE_URL}/stripe-payment`, {
      amount: amount,
      currency: currency
    });
    return response.data;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};



export const fetchTenantPaymentHistory = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tenant`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

export const fetchPaymentById = async (paymentId, username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tenant/${paymentId}`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};
export const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

export const savePayment = async (payment, tenantUserName, ownerUserName, propertyID) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save`, payment, {
      params: {
        tenantUserName,
        ownerUserName,
        propertyID
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};
