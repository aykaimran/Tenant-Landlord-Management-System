import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

export const fetchAllNotifications = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: {
        username: username  // This will add ?username=sara123 to the URL
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// services/tenantnotificationservice.js

// Fetch a single notification by ID
export const fetchNotificationByID = async (username, notificationID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${notificationID}`, {
      params: { username: username }, // Add username to the request
    });
    return response.data;  // Returns the notification data
  } catch (error) {
    console.error('Error fetching notification by ID:', error);
    throw error;
  }
};
