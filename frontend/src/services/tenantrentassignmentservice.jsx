import axios from 'axios';

const RENT_ASSIGNMENT_API_URL = 'http://localhost:8080/api/v1/rentAssignments';

// Fetch all rent assignments
export const fetchAllRentAssignments = async () => {
  try {
    const response = await axios.get(RENT_ASSIGNMENT_API_URL);
    console.log('Fetched all rent assignments:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching rent assignments:', error);
    throw error;
  }
};

// Fetch rent assignment by Property ID
export const fetchRentAssignmentByPropertyId = async (propertyID) => {
  try {
    const response = await axios.get(`${RENT_ASSIGNMENT_API_URL}/property/${propertyID}`);
    console.log('Fetched rent assignment by property ID:', response.data);
    return response.data; // This will include the full rent assignment object
  } catch (error) {
    console.error(`Error fetching rent assignment with property ID ${propertyID}:`, error);
    throw error;
  }
};

// Fetch rent assignment by ID
export const fetchRentAssignmentById = async (assignmentID) => {
  try {
    const response = await axios.get(`${RENT_ASSIGNMENT_API_URL}/${assignmentID}`);
    console.log('Fetched rent assignment:', response.data);
    return response.data;  // This returns the full rent assignment, including property and tenant details
  } catch (error) {
    console.error(`Error fetching rent assignment with ID ${assignmentID}:`, error);
    throw error;
  }
};

// Add a new rent assignment
export const createRentAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(RENT_ASSIGNMENT_API_URL, assignmentData);
    console.log('Created rent assignment:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating rent assignment:', error);
    throw error;
  }
};

export const fetchRentAssignmentsByTenantUsername = async (username, propertyId) => {
  try {
    const response = await axios.get(`${RENT_ASSIGNMENT_API_URL}/tenant/${username}/${propertyId}`);
    console.log('Fetched rent assignments for username:', username, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching rent assignments for username ${username}:`, error);
    throw error;
  }
};

// Update an existing rent assignment
export const updateRentAssignment = async (assignmentID, updatedData) => {
  try {
    const response = await axios.put(`${RENT_ASSIGNMENT_API_URL}/${assignmentID}`, updatedData);
    console.log('Updated rent assignment:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating rent assignment with ID ${assignmentID}:`, error);
    throw error;
  }
};

// Delete a rent assignment
export const deleteRentAssignment = async (assignmentID) => {
  try {
    const response = await axios.delete(`${RENT_ASSIGNMENT_API_URL}/${assignmentID}`);
    console.log('Deleted rent assignment:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting rent assignment with ID ${assignmentID}:`, error);
    throw error;
  }
};
