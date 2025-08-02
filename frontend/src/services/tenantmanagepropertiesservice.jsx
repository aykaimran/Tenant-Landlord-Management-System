import axios from 'axios';

const TENANT_PROPERTIES_API_URL = 'http://localhost:8080/api/property-assignments';

export const fetchAllTenantManageProperties = async (username) => {
  try {
    const response = await axios.get(`${TENANT_PROPERTIES_API_URL}/tenant`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tenant-managed properties:', error);
    throw error;
  }
};

export const fetchPropertyById = async (propertyID, username) => {
  try {
    const response = await axios.get(`${TENANT_PROPERTIES_API_URL}/tenant/${propertyID}`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with ID ${propertyID}:`, error);
    throw error;
  }
};