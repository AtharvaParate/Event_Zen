// Import the axios instance from the config
import axios from "./axiosConfig";

// Base URL for the registration service
const REGISTRATION_API_URL = "/registrations";

// Check if we should use mock data
const shouldUseMockData = () => {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.REACT_APP_USE_MOCK_DATA === "true"
  );
};

// Mock data for development - using let instead of const to allow mutations
let MOCK_REGISTRATIONS = [
  {
    id: "reg-1",
    attendeeId: "mock-1",
    eventId: "event-1",
    confirmationNumber: "REG-ABC123",
    registrationDate: "2023-04-15T10:00:00Z",
    ticketType: "VIP",
    ticketPrice: 99.99,
    paymentStatus: "COMPLETED",
    paymentMethod: "CREDIT_CARD",
    checkInStatus: "CHECKED_IN",
    checkInTime: "2023-04-15T13:30:00Z",
    notes: "VIP package includes meet and greet",
    attendee: {
      id: "mock-1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    event: {
      id: "event-1",
      name: "Annual Conference",
      location: "Convention Center",
      startDate: "2023-04-15T09:00:00Z",
      endDate: "2023-04-17T18:00:00Z",
    },
  },
  {
    id: "reg-2",
    attendeeId: "mock-1",
    eventId: "event-2",
    confirmationNumber: "REG-DEF456",
    registrationDate: "2023-05-20T11:15:00Z",
    ticketType: "STANDARD",
    ticketPrice: 49.99,
    paymentStatus: "PENDING",
    paymentMethod: "PAYPAL",
    checkInStatus: "NOT_CHECKED_IN",
    notes: "",
    attendee: {
      id: "mock-1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    event: {
      id: "event-2",
      name: "Tech Workshop",
      location: "Innovation Hub",
      startDate: "2023-05-25T10:00:00Z",
      endDate: "2023-05-25T16:00:00Z",
    },
  },
  {
    id: "reg-3",
    attendeeId: "mock-2",
    eventId: "event-1",
    confirmationNumber: "REG-GHI789",
    registrationDate: "2023-04-10T09:30:00Z",
    ticketType: "EARLY_BIRD",
    ticketPrice: 79.99,
    paymentStatus: "COMPLETED",
    paymentMethod: "BANK_TRANSFER",
    checkInStatus: "CHECKED_IN",
    checkInTime: "2023-04-15T09:15:00Z",
    notes: "Early arrival",
    attendee: {
      id: "mock-2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
    },
    event: {
      id: "event-1",
      name: "Annual Conference",
      location: "Convention Center",
      startDate: "2023-04-15T09:00:00Z",
      endDate: "2023-04-17T18:00:00Z",
    },
  },
];

// Create a deep copy of mock registrations to ensure we don't lose original data
const getOriginalMockData = () =>
  JSON.parse(JSON.stringify(MOCK_REGISTRATIONS));

// Fetch all registrations with pagination support
export const fetchRegistrations = async (page = 0, size = 10) => {
  try {
    console.log(`Fetching registrations: page=${page}, size=${size}`);
    const response = await axios.get(
      `${REGISTRATION_API_URL}?page=${page}&size=${size}`
    );
    console.log("Registrations fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching registrations:", error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock registration data for development");

      // Return paginated mock data
      const start = page * size;
      const end = start + size;
      const paginatedRegistrations = MOCK_REGISTRATIONS.slice(start, end);

      return {
        content: paginatedRegistrations,
        totalElements: MOCK_REGISTRATIONS.length,
        totalPages: Math.ceil(MOCK_REGISTRATIONS.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= MOCK_REGISTRATIONS.length,
      };
    }

    throw error;
  }
};

// Fetch a registration by ID
export const fetchRegistrationById = async (id) => {
  try {
    console.log(`Fetching registration with ID: ${id}`);
    const response = await axios.get(`${REGISTRATION_API_URL}/${id}`);
    console.log(`Registration ${id} fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching registration with ID ${id}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Returning mock registration for ID ${id}`);
      const mockRegistration = MOCK_REGISTRATIONS.find((reg) => reg.id === id);

      if (mockRegistration) {
        return mockRegistration;
      } else {
        console.warn(`No mock registration found with ID: ${id}`);
        return {
          id: id,
          attendeeId: "unknown",
          eventId: "unknown",
          confirmationNumber: "UNKNOWN",
          registrationDate: new Date().toISOString(),
          ticketType: "STANDARD",
          ticketPrice: 0,
          paymentStatus: "UNKNOWN",
          paymentMethod: "UNKNOWN",
          checkInStatus: "NOT_CHECKED_IN",
        };
      }
    }

    throw error;
  }
};

// Fetch registrations by event ID
export const fetchRegistrationsByEventId = async (
  eventId,
  page = 0,
  size = 10
) => {
  try {
    console.log(`Fetching registrations for event ID: ${eventId}`);
    const response = await axios.get(
      `${REGISTRATION_API_URL}/event/${eventId}?page=${page}&size=${size}`
    );
    console.log(
      `Registrations for event ${eventId} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching registrations for event ${eventId}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Returning mock registrations for event ${eventId}`);

      // Filter by event ID and paginate
      const filteredRegistrations = MOCK_REGISTRATIONS.filter(
        (reg) => reg.eventId === eventId
      );

      const start = page * size;
      const end = start + size;
      const paginatedRegistrations = filteredRegistrations.slice(start, end);

      return {
        content: paginatedRegistrations,
        totalElements: filteredRegistrations.length,
        totalPages: Math.ceil(filteredRegistrations.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= filteredRegistrations.length,
      };
    }

    throw error;
  }
};

// Fetch registrations by attendee ID
export const fetchRegistrationsByAttendeeId = async (
  attendeeId,
  page = 0,
  size = 10
) => {
  try {
    console.log(`Fetching registrations for attendee ID: ${attendeeId}`);
    const response = await axios.get(
      `${REGISTRATION_API_URL}/attendee/${attendeeId}?page=${page}&size=${size}`
    );
    console.log(
      `Registrations for attendee ${attendeeId} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching registrations for attendee ID ${attendeeId}:`,
      error
    );

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Returning mock registrations for attendee ${attendeeId}`);

      // Filter by attendee ID and paginate
      const filteredRegistrations = MOCK_REGISTRATIONS.filter(
        (reg) => reg.attendeeId === attendeeId
      );

      const start = page * size;
      const end = start + size;
      const paginatedRegistrations = filteredRegistrations.slice(start, end);

      return {
        content: paginatedRegistrations,
        totalElements: filteredRegistrations.length,
        totalPages: Math.ceil(filteredRegistrations.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= filteredRegistrations.length,
      };
    }

    throw error;
  }
};

// Fetch registrations by event ID and payment status
export const fetchRegistrationsByEventIdAndPaymentStatus = async (
  eventId,
  paymentStatus,
  page = 0,
  size = 10
) => {
  try {
    console.log(
      `Fetching registrations for event ID: ${eventId} with payment status: ${paymentStatus}`
    );
    const response = await axios.get(
      `${REGISTRATION_API_URL}/event/${eventId}/payment-status/${paymentStatus}?page=${page}&size=${size}`
    );
    console.log(
      `Registrations for event ${eventId} with payment status ${paymentStatus} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching registrations for event ${eventId} with payment status ${paymentStatus}:`,
      error
    );

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock registrations for event ${eventId} with payment status ${paymentStatus}`
      );

      // Filter by event ID and payment status, then paginate
      const filteredRegistrations = MOCK_REGISTRATIONS.filter(
        (reg) => reg.eventId === eventId && reg.paymentStatus === paymentStatus
      );

      const start = page * size;
      const end = start + size;
      const paginatedRegistrations = filteredRegistrations.slice(start, end);

      return {
        content: paginatedRegistrations,
        totalElements: filteredRegistrations.length,
        totalPages: Math.ceil(filteredRegistrations.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= filteredRegistrations.length,
      };
    }

    throw error;
  }
};

// Create a new registration
export const createRegistration = async (registrationData) => {
  try {
    console.log("Creating registration with data:", registrationData);
    const response = await axios.post(REGISTRATION_API_URL, registrationData);
    console.log("Registration created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating registration:", error);

    // For development, create a mock registration if the API fails
    if (shouldUseMockData()) {
      console.warn("Creating mock registration for development");

      // Generate a new mock registration
      const mockRegistration = {
        id: `reg-${Math.random().toString(36).substring(2, 9)}`,
        ...registrationData,
        confirmationNumber: `REG-${Math.random()
          .toString(36)
          .substr(2, 6)
          .toUpperCase()}`,
        registrationDate:
          registrationData.registrationDate || new Date().toISOString(),
        checkInStatus: "NOT_CHECKED_IN",
        createdAt: new Date().toISOString(),
      };

      // Add to mock registrations array for consistent state management
      MOCK_REGISTRATIONS = [mockRegistration, ...MOCK_REGISTRATIONS];
      console.log("Mock registration created:", mockRegistration);
      console.log("Updated mock registrations list:", MOCK_REGISTRATIONS);

      return mockRegistration;
    }

    throw error;
  }
};

// Update an existing registration
export const updateRegistration = async (id, registrationData) => {
  try {
    console.log(`Updating registration ${id} with data:`, registrationData);
    const response = await axios.put(
      `${REGISTRATION_API_URL}/${id}`,
      registrationData
    );
    console.log(`Registration ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating registration with ID ${id}:`, error);

    // For development, update mock registration if the API fails
    if (shouldUseMockData()) {
      console.warn(`Updating mock registration for ID ${id}`);

      // Find and update the registration in the mock data array
      const registrationIndex = MOCK_REGISTRATIONS.findIndex(
        (reg) => reg.id === id
      );
      if (registrationIndex !== -1) {
        const updatedRegistration = {
          ...MOCK_REGISTRATIONS[registrationIndex],
          ...registrationData,
          id: id, // Ensure ID stays the same
          updatedAt: new Date().toISOString(),
        };

        MOCK_REGISTRATIONS[registrationIndex] = updatedRegistration;
        console.log("Mock registration updated:", updatedRegistration);
        console.log("Updated mock registrations list:", MOCK_REGISTRATIONS);

        return updatedRegistration;
      } else {
        console.warn(`No mock registration found with ID: ${id}`);
        return {
          id: id,
          ...registrationData,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    throw error;
  }
};

// Delete a registration
export const deleteRegistration = async (id) => {
  try {
    console.log(`Deleting registration with ID: ${id}`);
    await axios.delete(`${REGISTRATION_API_URL}/${id}`);
    console.log(`Registration ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting registration with ID ${id}:`, error);

    // For development, handle deletion in mock data
    if (shouldUseMockData()) {
      console.warn(`Deleting mock registration for ID ${id}`);

      // Remove from mock data array
      const initialLength = MOCK_REGISTRATIONS.length;
      MOCK_REGISTRATIONS = MOCK_REGISTRATIONS.filter((reg) => reg.id !== id);

      if (MOCK_REGISTRATIONS.length < initialLength) {
        console.log(`Mock registration with ID ${id} deleted successfully`);
        console.log("Updated mock registrations list:", MOCK_REGISTRATIONS);
        return true;
      } else {
        console.warn(`No mock registration found with ID: ${id}`);
        return true; // Still return success
      }
    }

    throw error;
  }
};

// Update check-in status for a registration
export const updateCheckInStatus = async (registrationId, checkInStatus) => {
  try {
    console.log(
      `Updating check-in status for registration ${registrationId} to ${checkInStatus}`
    );
    const response = await axios.patch(
      `${REGISTRATION_API_URL}/${registrationId}/check-in-status?status=${checkInStatus}`
    );
    console.log(
      `Check-in status for registration ${registrationId} updated successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating check-in status for registration with ID ${registrationId}:`,
      error
    );

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock check-in status update for registration ${registrationId} due to API error`
      );

      return {
        id: registrationId,
        checkInStatus: checkInStatus,
        updatedAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

// Update payment status for a registration
export const updatePaymentStatus = async (registrationId, paymentStatus) => {
  try {
    console.log(
      `Updating payment status for registration ${registrationId} to ${paymentStatus}`
    );
    const response = await axios.patch(
      `${REGISTRATION_API_URL}/${registrationId}/payment-status?status=${paymentStatus}`
    );
    console.log(
      `Payment status for registration ${registrationId} updated successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating payment status for registration with ID ${registrationId}:`,
      error
    );

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock payment status update for registration ${registrationId} due to API error`
      );

      return {
        id: registrationId,
        paymentStatus: paymentStatus,
        updatedAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

// Check in a registration
export const checkInRegistration = async (registrationId) => {
  try {
    console.log(`Checking in registration with ID: ${registrationId}`);
    const response = await axios.put(
      `${REGISTRATION_API_URL}/${registrationId}/check-in`
    );
    console.log(
      `Registration ${registrationId} checked in successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error checking in registration with ID ${registrationId}:`,
      error
    );

    // For development, update mock check-in status if the API fails
    if (shouldUseMockData()) {
      console.warn(`Checking in mock registration for ID ${registrationId}`);

      // Find and update the registration in the mock data array
      const registrationIndex = MOCK_REGISTRATIONS.findIndex(
        (reg) => reg.id === registrationId
      );
      if (registrationIndex !== -1) {
        const updatedRegistration = {
          ...MOCK_REGISTRATIONS[registrationIndex],
          checkInStatus: "CHECKED_IN",
          checkInTime: new Date().toISOString(),
        };

        MOCK_REGISTRATIONS[registrationIndex] = updatedRegistration;
        console.log("Mock registration checked in:", updatedRegistration);
        console.log("Updated mock registrations list:", MOCK_REGISTRATIONS);

        return updatedRegistration;
      } else {
        console.warn(`No mock registration found with ID: ${registrationId}`);
        return {
          id: registrationId,
          checkInStatus: "CHECKED_IN",
          checkInTime: new Date().toISOString(),
        };
      }
    }

    throw error;
  }
};

// Search registrations by confirmation number
export const searchRegistrationsByConfirmationNumber = async (
  confirmationNumber
) => {
  try {
    console.log(
      `Searching registrations by confirmation number: ${confirmationNumber}`
    );
    const response = await axios.get(
      `${REGISTRATION_API_URL}/search?confirmationNumber=${encodeURIComponent(
        confirmationNumber
      )}`
    );
    console.log(
      `Search results for confirmation number ${confirmationNumber}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error searching registrations by confirmation number ${confirmationNumber}:`,
      error
    );

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock search results for confirmation number ${confirmationNumber} due to API error`
      );

      const mockResults = MOCK_REGISTRATIONS.filter((reg) =>
        reg.confirmationNumber.includes(confirmationNumber)
      );

      return mockResults.length > 0 ? mockResults : [];
    }

    throw error;
  }
};

// Search registrations
export const searchRegistrations = async (
  searchTerm,
  filters = {},
  page = 0,
  size = 10
) => {
  try {
    console.log(
      `Searching registrations with term: "${searchTerm}", filters:`,
      filters
    );

    // Construct query parameters
    let queryParams = `page=${page}&size=${size}`;
    if (searchTerm) {
      queryParams += `&search=${encodeURIComponent(searchTerm)}`;
    }

    // Add filters
    if (filters.eventId) {
      queryParams += `&eventId=${filters.eventId}`;
    }
    if (filters.paymentStatus) {
      queryParams += `&paymentStatus=${filters.paymentStatus}`;
    }
    if (filters.checkInStatus) {
      queryParams += `&checkInStatus=${filters.checkInStatus}`;
    }
    if (filters.startDate) {
      queryParams += `&startDate=${filters.startDate}`;
    }
    if (filters.endDate) {
      queryParams += `&endDate=${filters.endDate}`;
    }

    const response = await axios.get(
      `${REGISTRATION_API_URL}/search?${queryParams}`
    );
    console.log("Registration search results:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching registrations:", error);

    // For development, return filtered mock registrations if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock search results for registrations");

      // Filter registrations based on search term and filters
      let filteredRegistrations = [...MOCK_REGISTRATIONS];

      // Apply search term filter (check confirmationNumber, attendee name, email)
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredRegistrations = filteredRegistrations.filter(
          (reg) =>
            reg.confirmationNumber.toLowerCase().includes(lowerSearchTerm) ||
            `${reg.attendee?.firstName} ${reg.attendee?.lastName}`
              .toLowerCase()
              .includes(lowerSearchTerm) ||
            reg.attendee?.email.toLowerCase().includes(lowerSearchTerm)
        );
      }

      // Apply event filter
      if (filters.eventId) {
        filteredRegistrations = filteredRegistrations.filter(
          (reg) => reg.eventId === filters.eventId
        );
      }

      // Apply payment status filter
      if (filters.paymentStatus) {
        filteredRegistrations = filteredRegistrations.filter(
          (reg) => reg.paymentStatus === filters.paymentStatus
        );
      }

      // Apply check-in status filter
      if (filters.checkInStatus) {
        filteredRegistrations = filteredRegistrations.filter(
          (reg) => reg.checkInStatus === filters.checkInStatus
        );
      }

      // Apply date range filter if both dates are provided
      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);

        filteredRegistrations = filteredRegistrations.filter((reg) => {
          const regDate = new Date(reg.registrationDate);
          return regDate >= startDate && regDate <= endDate;
        });
      }

      // Paginate results
      const start = page * size;
      const end = start + size;
      const paginatedRegistrations = filteredRegistrations.slice(start, end);

      return {
        content: paginatedRegistrations,
        totalElements: filteredRegistrations.length,
        totalPages: Math.ceil(filteredRegistrations.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= filteredRegistrations.length,
      };
    }

    throw error;
  }
};

// Create a registration API object with all functions
const registrationApi = {
  fetchRegistrations,
  fetchRegistrationById,
  fetchRegistrationsByEventId,
  fetchRegistrationsByAttendeeId,
  fetchRegistrationsByEventIdAndPaymentStatus,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  updateCheckInStatus,
  updatePaymentStatus,
  checkInRegistration,
  searchRegistrationsByConfirmationNumber,
  searchRegistrations,

  // Add a reset function for testing
  _resetMockData: () => {
    if (shouldUseMockData()) {
      MOCK_REGISTRATIONS = getOriginalMockData();
    }
  },
};

export default registrationApi;
