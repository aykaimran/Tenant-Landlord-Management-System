import axios from 'axios';

// Base URL for the backend API
const BASE_API_URL = 'http://localhost:8080/api/v1/rentAssignments';

const tenantDashboardService = {
  // Get total owners for the given tenant username
  getTotalOwners: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/total-owners`);
      return response.data;  // Returns total owners
    } catch (error) {
      console.error("Error fetching total owners:", error);
      throw error;
    }
  },

  // Get total rented properties for the given tenant username
  getRentedProperties: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/rented-properties`);
      return response.data;  // Returns rented properties count
    } catch (error) {
      console.error("Error fetching rented properties:", error);
      throw error;
    }
  },

  // Get total rent paid for the given tenant username
  getTotalRentPaid: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/total-rent-paid`);
      return response.data;  // Returns total rent paid amount
    } catch (error) {
      console.error("Error fetching total rent paid:", error);
      throw error;
    }
  },

  // Get upcoming due date for the given tenant username
  getUpcomingDueDate: async (userName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/tenant/${userName}/upcoming-due-date`);
      return response.data;  // Returns upcoming due date (or "None")
    } catch (error) {
      console.error("Error fetching upcoming due date:", error);
      throw error;
    }
  }
};

export default tenantDashboardService;
///////////////////////////////
