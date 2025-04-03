// Import the axios instance from the config
import { attendeeApiInstance as axios } from "./axiosConfig";

// Base URL for the registration service
const REGISTRATION_API_URL = "/registrations";

// Check if we should use mock data
const shouldUseMockData = () => {
  return true; // Enable mock data usage
};

// Mock data for development - using let instead of const to allow mutations
let MOCK_REGISTRATIONS = [
  {
    id: "reg-1",
    attendeeId: "mock-1",
    eventId: "event-1",
    confirmationNumber: "CONF12345",
    registrationDate: "2023-01-15T10:00:00Z",
    ticketType: "STANDARD",
    ticketPrice: 50.0,
    paymentStatus: "PAID",
    paymentMethod: "CREDIT_CARD",
    checkInStatus: "CHECKED_IN",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "reg-2",
    attendeeId: "mock-1",
    eventId: "event-2",
    confirmationNumber: "CONF23456",
    registrationDate: "2023-02-20T14:30:00Z",
    ticketType: "VIP",
    ticketPrice: 100.0,
    paymentStatus: "PAID",
    paymentMethod: "PAYPAL",
    checkInStatus: "NOT_CHECKED_IN",
    createdAt: "2023-02-20T14:30:00Z",
    updatedAt: "2023-02-20T14:30:00Z",
  },
  {
    id: "reg-3",
    attendeeId: "mock-2",
    eventId: "event-1",
    confirmationNumber: "CONF34567",
    registrationDate: "2023-03-10T09:15:00Z",
    ticketType: "STANDARD",
    ticketPrice: 50.0,
    paymentStatus: "PAID",
    paymentMethod: "CREDIT_CARD",
    checkInStatus: "CHECKED_IN",
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "reg-4",
    attendeeId: "mock-3",
    eventId: "event-3",
    confirmationNumber: "CONF45678",
    registrationDate: "2023-04-05T16:45:00Z",
    ticketType: "EARLY_BIRD",
    ticketPrice: 35.0,
    paymentStatus: "REFUNDED",
    paymentMethod: "BANK_TRANSFER",
    checkInStatus: "CANCELLED",
    createdAt: "2023-04-05T16:45:00Z",
    updatedAt: "2023-04-05T16:45:00Z",
  },
];

// Create a deep copy of mock registrations to ensure we don't lose original data
const getOriginalMockData = () => {
  return [
    {
      id: "reg-1",
      attendeeId: "mock-1",
      eventId: "event-1",
      confirmationNumber: "CONF12345",
      registrationDate: "2023-01-15T10:00:00Z",
      ticketType: "STANDARD",
      ticketPrice: 50.0,
      paymentStatus: "PAID",
      paymentMethod: "CREDIT_CARD",
      checkInStatus: "CHECKED_IN",
      createdAt: "2023-01-15T10:00:00Z",
      updatedAt: "2023-01-15T10:00:00Z",
    },
    {
      id: "reg-2",
      attendeeId: "mock-1",
      eventId: "event-2",
      confirmationNumber: "CONF23456",
      registrationDate: "2023-02-20T14:30:00Z",
      ticketType: "VIP",
      ticketPrice: 100.0,
      paymentStatus: "PAID",
      paymentMethod: "PAYPAL",
      checkInStatus: "NOT_CHECKED_IN",
      createdAt: "2023-02-20T14:30:00Z",
      updatedAt: "2023-02-20T14:30:00Z",
    },
    {
      id: "reg-3",
      attendeeId: "mock-2",
      eventId: "event-1",
      confirmationNumber: "CONF34567",
      registrationDate: "2023-03-10T09:15:00Z",
      ticketType: "STANDARD",
      ticketPrice: 50.0,
      paymentStatus: "PAID",
      paymentMethod: "CREDIT_CARD",
      checkInStatus: "CHECKED_IN",
      createdAt: "2023-03-10T09:15:00Z",
      updatedAt: "2023-03-10T09:15:00Z",
    },
    {
      id: "reg-4",
      attendeeId: "mock-3",
      eventId: "event-3",
      confirmationNumber: "CONF45678",
      registrationDate: "2023-04-05T16:45:00Z",
      ticketType: "EARLY_BIRD",
      ticketPrice: 35.0,
      paymentStatus: "REFUNDED",
      paymentMethod: "BANK_TRANSFER",
      checkInStatus: "CANCELLED",
      createdAt: "2023-04-05T16:45:00Z",
      updatedAt: "2023-04-05T16:45:00Z",
    },
  ];
};

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
      console.log("Creating mock registration for development");
      console.log("Original eventId:", registrationData.eventId);

      // Generate a new mock registration
      const mockRegistration = {
        id: `reg-${Math.random().toString(36).substring(2, 9)}`,
        ...registrationData,
        // Ensure eventId is in the format expected by getEventName
        eventId: registrationData.eventId,
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
    console.log("Registration updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating registration ${id}:`, error);

    // For development, return mock updated registration
    if (shouldUseMockData()) {
      console.log("Creating mock updated registration for development");

      // Find the registration to update
      const existingRegistration = MOCK_REGISTRATIONS.find((r) => r.id === id);

      if (!existingRegistration) {
        throw new Error(`Registration with ID ${id} not found`);
      }

      // Create updated registration with the new data
      const updatedRegistration = {
        ...existingRegistration,
        ...registrationData,
        // Preserve the eventId to ensure consistency
        eventId: registrationData.eventId || existingRegistration.eventId,
        updatedAt: new Date().toISOString(),
      };

      // Update the mock registration in the array
      MOCK_REGISTRATIONS = MOCK_REGISTRATIONS.map((r) =>
        r.id === id ? updatedRegistration : r
      );

      console.log("Mock registration updated:", updatedRegistration);
      return updatedRegistration;
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
    console.log(`Checking in registration: ${registrationId}`);
    const response = await axios.patch(
      `${REGISTRATION_API_URL}/${registrationId}/check-in`
    );
    console.log(`Registration ${registrationId} checked in successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error checking in registration ${registrationId}:`, error);

    // For development, create a mock checked-in registration
    if (shouldUseMockData()) {
      console.log(`Creating mock check-in for registration ${registrationId}`);

      // Find the registration in mock data
      const registration = MOCK_REGISTRATIONS.find(
        (r) => r.id === registrationId
      );

      if (!registration) {
        throw new Error(`Registration with ID ${registrationId} not found`);
      }

      // Update check-in status
      const updatedRegistration = {
        ...registration,
        checkInStatus: "CHECKED_IN",
        updatedAt: new Date().toISOString(),
        // Preserve event data to ensure it's available
        eventId: registration.eventId,
        // If the registration already has event data, preserve it
        event: registration.event,
      };

      // Update the mock registration
      MOCK_REGISTRATIONS = MOCK_REGISTRATIONS.map((r) =>
        r.id === registrationId ? updatedRegistration : r
      );

      console.log(
        `Mock registration ${registrationId} checked in successfully`
      );
      return updatedRegistration;
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
