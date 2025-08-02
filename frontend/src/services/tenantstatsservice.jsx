
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/v1/rentAssignments';
const BASE_API_URL1 = 'http://localhost:8080/api/v1/payments';

const tenantStatsService = {
  // Get total rented properties
  getRentedProperties: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/rented-properties`);
      console.log("Rented Properties Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching rented properties:", error);
      throw error;
    }
  },

  // Get last payment date
  getLastPaymentDate: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/last-payment-date`);
      console.log("Last Payment Date Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching last payment date:", error);
      throw error;
    }
  },

  // Get upcoming due date
  getUpcomingDueDate: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/upcoming-due-date`);
      console.log("Upcoming Due Date Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming due date:", error);
      throw error;
    }
  },

  // Get total payments made
  getTotalPaymentsMade: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL1}/total-payments/${userName}`);
      console.log("Total Payments Made Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching total payments made:", error);
      throw error;
    }
  },

  // Get total rent paid
  getTotalRentPaid: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/total-rent-paid`);
      console.log("Total Rent Paid Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching total rent paid:", error);
      throw error;
    }
  },

  // Get yearly rent paid
  getYearlyRentPaid: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/yearly-rent-paid`);
      console.log("Yearly Rent Paid Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching yearly rent paid:", error);
      throw error;
    }
  },

  // Get average rent paid
  getAverageRentPaid: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/average-rent-paid`);
      console.log("Average Rent Paid Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching average rent paid:", error);
      throw error;
    }
  },

  // Get total owners
  getTotalOwners: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/total-owners`);
      console.log("Total Owners Response: ", response);  // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching total owners:", error);
      throw error;
    }
  }
};

export default tenantStatsService;
