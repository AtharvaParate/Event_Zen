import { attendeeApiInstance } from "./axiosConfig";
// eslint-disable-next-line no-unused-vars
import { axiosInstance as axios1 } from "./axiosConfig";
import { createRegistration } from "./registrationApi";
import { API_CONFIG, getAuthHeader } from "../config/apiConfig";

// Base URLs for the attendee service
const ATTENDEE_API_URL = "/attendees";
const REGISTRATION_API_URL = "/registrations";

// Mock attendees for development
let MOCK_ATTENDEES = [
  {
    id: "mock-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    status: "REGISTERED",
    registrationIds: ["reg-1", "reg-2"],
    createdAt: "2023-01-01T12:00:00Z",
  },
  {
    id: "mock-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "555-123-4567",
    status: "CHECKED_IN",
    registrationIds: ["reg-3"],
    createdAt: "2023-01-02T12:00:00Z",
  },
  {
    id: "mock-3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    phoneNumber: "444-555-6666",
    status: "CANCELLED",
    registrationIds: ["reg-4"],
    createdAt: "2023-01-03T12:00:00Z",
  },
];

// Helper function to check if we should use mock data
const shouldUseMockData = () => {
  return true; // Enable mock data usage
};

// Attendee API methods
export const fetchAttendees = async (page = 0, size = 10) => {
  try {
    console.log(`Fetching attendees: page=${page}, size=${size}`);
    const response = await attendeeApiInstance.get(
      `${ATTENDEE_API_URL}?page=${page}&size=${size}`
    );
    console.log("Attendees fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendees:", error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock attendee data for development");

      // Return paginated mock data
      const start = page * size;
      const end = start + size;
      const paginatedAttendees = MOCK_ATTENDEES.slice(start, end);

      return {
        content: paginatedAttendees,
        totalElements: MOCK_ATTENDEES.length,
        totalPages: Math.ceil(MOCK_ATTENDEES.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= MOCK_ATTENDEES.length,
      };
    }

    throw error;
  }
};

export const fetchAttendeeById = async (id) => {
  try {
    console.log(`Fetching attendee with ID: ${id}`);
    const response = await attendeeApiInstance.get(`${ATTENDEE_API_URL}/${id}`);
    console.log(`Attendee ${id} fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendee with ID ${id}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock data for attendee ID ${id} due to API error`
      );

      // Try to find a matching mock attendee by ID
      const mockAttendee = MOCK_ATTENDEES.find((a) => a.id === id);

      // If found, return it, otherwise create a new mock attendee
      if (mockAttendee) {
        return { ...mockAttendee };
      }

      // Generate a mock attendee based on the ID
      return {
        id: id,
        firstName: "Mock",
        lastName: `User ${id.substring(0, 4)}`,
        email: `mock.user.${id.substring(0, 4)}@example.com`,
        phoneNumber: "123-456-7890",
        status: "REGISTERED",
        registrationIds: [`reg-${id}-1`, `reg-${id}-2`],
        createdAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

export const fetchAttendeeByUserId = async (userId) => {
  try {
    console.log(`Fetching attendee for user ID: ${userId}`);
    const response = await attendeeApiInstance.get(
      `${ATTENDEE_API_URL}/user/${userId}`
    );
    console.log(
      `Attendee for user ${userId} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendee for user ID ${userId}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock data for user ID ${userId} due to API error`
      );

      // Generate a mock attendee based on the user ID
      return {
        id: `attendee-${userId}`,
        firstName: "Mock",
        lastName: `User ${userId}`,
        email: `mock.user.${userId}@example.com`,
        phoneNumber: "123-456-7890",
        status: "REGISTERED",
        registrationIds: [`reg-${userId}-1`],
        createdAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

export const fetchAttendeesByEventId = async (eventId) => {
  try {
    console.log(`Fetching attendees for event ID: ${eventId}`);
    const response = await attendeeApiInstance.get(
      `${ATTENDEE_API_URL}/event/${eventId}`
    );
    console.log(
      `Attendees for event ${eventId} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendees for event ID ${eventId}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Returning mock data for event ${eventId} due to API error`);

      // Return 2-3 random mock attendees
      const randomAttendees = MOCK_ATTENDEES.sort(
        () => 0.5 - Math.random()
      ).slice(0, Math.floor(Math.random() * 3) + 2);

      return {
        content: randomAttendees,
        totalElements: randomAttendees.length,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
      };
    }

    throw error;
  }
};

export const createAttendee = async (attendeeData) => {
  try {
    console.log("Creating attendee with data:", attendeeData);
    const response = await attendeeApiInstance.post(
      ATTENDEE_API_URL,
      attendeeData
    );
    console.log("Attendee created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating attendee:", error);

    // For development, create a mock attendee if the API fails
    if (shouldUseMockData()) {
      console.warn("Creating mock attendee for development");

      const mockAttendee = {
        id: `mock-${Math.random().toString(36).substring(2, 9)}`,
        ...attendeeData,
        status: attendeeData.status || "REGISTERED",
        registrationIds: [],
        createdAt: new Date().toISOString(),
      };

      // Add to mock attendees list for consistent state management
      MOCK_ATTENDEES = [mockAttendee, ...MOCK_ATTENDEES];
      console.log("Mock attendee created:", mockAttendee);
      console.log("Updated mock attendees list:", MOCK_ATTENDEES);

      return mockAttendee;
    }

    throw error;
  }
};

export const updateAttendee = async (id, attendeeData) => {
  try {
    console.log(`Updating attendee ${id} with data:`, attendeeData);
    const response = await attendeeApiInstance.put(
      `${ATTENDEE_API_URL}/${id}`,
      attendeeData,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        timeout: 10000,
      }
    );
    console.log(`Attendee ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating attendee with ID ${id}:`, error);

    // For development, return mock updated attendee if the API fails
    if (shouldUseMockData()) {
      console.warn(`Updating mock attendee for ID ${id}`);

      // Update in the mock data array
      const attendeeIndex = MOCK_ATTENDEES.findIndex((a) => a.id === id);
      if (attendeeIndex !== -1) {
        const updatedAttendee = {
          ...MOCK_ATTENDEES[attendeeIndex],
          ...attendeeData,
          id: id, // Ensure ID stays the same
          updatedAt: new Date().toISOString(),
        };

        MOCK_ATTENDEES[attendeeIndex] = updatedAttendee;
        console.log("Mock attendee updated:", updatedAttendee);
        console.log("Updated mock attendees list:", MOCK_ATTENDEES);

        return updatedAttendee;
      } else {
        console.warn(`No mock attendee found with ID: ${id}`);
        return {
          id: id,
          ...attendeeData,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    throw error;
  }
};

export const updateAttendeeStatus = async (id, status) => {
  try {
    console.log(`Updating status for attendee ${id} to ${status}`);
    const response = await attendeeApiInstance.patch(
      `${ATTENDEE_API_URL}/${id}/status?status=${status}`
    );
    console.log(
      `Status for attendee ${id} updated successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating status for attendee with ID ${id}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock status update for attendee ${id} due to API error`
      );

      // Try to find a matching mock attendee by ID
      const mockIndex = MOCK_ATTENDEES.findIndex((a) => a.id === id);

      // If found, update it and return
      if (mockIndex !== -1) {
        MOCK_ATTENDEES[mockIndex].status = status;
        return { ...MOCK_ATTENDEES[mockIndex] };
      }

      // Otherwise create a new mock response
      return {
        id: id,
        status: status,
        updatedAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

export const deleteAttendee = async (id) => {
  try {
    console.log(`Deleting attendee with ID: ${id}`);
    await attendeeApiInstance.delete(`${ATTENDEE_API_URL}/${id}`);
    console.log(`Attendee ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting attendee with ID ${id}:`, error);

    // For development, handle deletion in mock data
    if (shouldUseMockData()) {
      console.warn(`Deleting mock attendee for ID ${id}`);

      // Remove from mock data array
      const initialLength = MOCK_ATTENDEES.length;
      MOCK_ATTENDEES = MOCK_ATTENDEES.filter((a) => a.id !== id);

      if (MOCK_ATTENDEES.length < initialLength) {
        console.log(`Mock attendee with ID ${id} deleted successfully`);
        console.log("Updated mock attendees list:", MOCK_ATTENDEES);
        return true;
      } else {
        console.warn(`No mock attendee found with ID: ${id}`);
        return true; // Still return success
      }
    }

    throw error;
  }
};

export const searchAttendees = async (searchTerm, filters = {}) => {
  try {
    console.log(
      `Searching attendees with term: "${searchTerm}" and filters:`,
      filters
    );
    // Build query string with search term and any additional filters
    let queryParams = `term=${encodeURIComponent(searchTerm)}`;

    // Add any additional filters to the query string
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    const response = await attendeeApiInstance.get(
      `${ATTENDEE_API_URL}/search?${queryParams}`
    );
    console.log("Search results:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error searching attendees:`, error);

    // For development, return mock search results if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock data for attendee search");
      return mockSearchResults(searchTerm, filters);
    }

    throw error;
  }
};

// Mock function for development/testing
const mockSearchResults = (searchTerm, filters) => {
  // Filter by search term (case insensitive)
  const lowerSearchTerm = searchTerm.toLowerCase();
  const filtered = MOCK_ATTENDEES.filter((attendee) => {
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
    return (
      fullName.includes(lowerSearchTerm) ||
      attendee.email.toLowerCase().includes(lowerSearchTerm) ||
      attendee.phoneNumber.includes(lowerSearchTerm)
    );
  });

  // Apply any additional filters
  const statusFilter = filters.status;
  if (statusFilter && statusFilter !== "ALL") {
    return filtered.filter((attendee) => attendee.status === statusFilter);
  }

  return filtered;
};

export const fetchRegistrationsByAttendeeId = async (attendeeId) => {
  try {
    console.log(`Fetching registrations for attendee ID: ${attendeeId}`);
    const response = await attendeeApiInstance.get(
      `${REGISTRATION_API_URL}/attendee/${attendeeId}`
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
      console.warn(
        `Returning mock registration data for attendee ID ${attendeeId} due to API error`
      );

      // Create mock registrations for this attendee
      const mockRegistrations = [
        {
          id: `reg-${attendeeId}-1`,
          attendeeId: attendeeId,
          eventId: "event-1",
          confirmationNumber: `CNF${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0")}`,
          registrationDate: new Date().toISOString(),
          ticketType: "VIP",
          ticketPrice: 150.0,
          paymentMethod: "CREDIT_CARD",
          paymentStatus: "PAID",
          checkInStatus: "CHECKED_IN",
          notes: "Requires vegetarian meal",
          event: {
            id: "event-1",
            title: "Annual Tech Conference",
            startDate: new Date().toISOString(),
            location: "San Francisco, CA",
          },
        },
        {
          id: `reg-${attendeeId}-2`,
          attendeeId: attendeeId,
          eventId: "event-2",
          confirmationNumber: `CNF${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0")}`,
          registrationDate: new Date(Date.now() - 86400000).toISOString(), // One day ago
          ticketType: "STANDARD",
          ticketPrice: 75.0,
          paymentMethod: "PAYPAL",
          paymentStatus: "PENDING",
          checkInStatus: "NOT_CHECKED_IN",
          notes: "",
          event: {
            id: "event-2",
            title: "Music Festival",
            startDate: new Date(Date.now() + 1209600000).toISOString(), // Two weeks in future
            location: "Los Angeles, CA",
          },
        },
      ];

      return {
        content: mockRegistrations,
        totalElements: mockRegistrations.length,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
      };
    }

    throw error;
  }
};

// Function to directly register for an event
export const registerForEvent = async (userData, eventId) => {
  try {
    console.log("registerForEvent called with:", userData, eventId);

    // First check if user already exists as an attendee
    let attendee;

    if (userData.id) {
      // If we already have the attendee ID, fetch it
      try {
        attendee = await fetchAttendeeById(userData.id);
        console.log("Found existing attendee by ID:", attendee);
      } catch (error) {
        console.log("Could not find attendee by ID, will create new one");
      }
    }

    if (!attendee && userData.email) {
      // Try to find by email as fallback
      try {
        attendee = await fetchAttendeeByEmail(userData.email);
        console.log("Found existing attendee by email:", attendee);
      } catch (error) {
        console.log("Could not find attendee by email, will create new one");
      }
    }

    // If attendee doesn't exist, create a new one
    if (!attendee) {
      const attendeeData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber || "",
        status: "REGISTERED",
      };

      console.log("Creating new attendee:", attendeeData);
      attendee = await createAttendee(attendeeData);
      console.log("New attendee created:", attendee);
    }

    // Create registration
    const registrationData = {
      attendeeId: attendee.id,
      eventId: eventId,
      ticketType: userData.ticketType || "STANDARD",
      ticketPrice: userData.ticketPrice || 0,
      paymentMethod: userData.paymentMethod || "CREDIT_CARD",
      paymentStatus: "PENDING",
      notes: userData.notes || "",
    };

    console.log("Creating registration with data:", registrationData);
    const registration = await createRegistration(registrationData);
    console.log("Registration created:", registration);

    // For development mode, handle case where backend might be unavailable
    if (!registration && shouldUseMockData()) {
      console.warn("Using mock registration data for development");
      return mockRegisterForEvent(userData, eventId);
    }

    return {
      success: true,
      attendee,
      registration,
    };
  } catch (error) {
    console.error("Error registering for event:", error);

    // For development mode, return mock data if backend fails
    if (shouldUseMockData()) {
      console.warn("Using mock registration data for development after error");
      return mockRegisterForEvent(userData, eventId);
    }

    throw error;
  }
};

// Mock version for development
export const mockRegisterForEvent = async (userData, eventId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Creating mock registration for development");

  const mockAttendee = {
    id: userData.id || `attendee-${Math.random().toString(36).substring(2, 9)}`,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phoneNumber: userData.phoneNumber || "",
    status: "REGISTERED",
    createdAt: new Date().toISOString(),
    registrationIds: [],
  };

  const mockRegistrationId = `reg-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  // Add the registration ID to the attendee
  mockAttendee.registrationIds.push(mockRegistrationId);

  const mockRegistration = {
    id: mockRegistrationId,
    attendeeId: mockAttendee.id,
    eventId: eventId,
    confirmationNumber: `CNF${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`,
    registrationDate: new Date().toISOString(),
    ticketType: userData.ticketType || "STANDARD",
    ticketPrice: userData.ticketPrice || 0,
    paymentMethod: userData.paymentMethod || "CREDIT_CARD",
    paymentStatus: "PENDING",
    checkInStatus: "NOT_CHECKED_IN",
    notes: userData.notes || "",
    attendee: {
      firstName: mockAttendee.firstName,
      lastName: mockAttendee.lastName,
    },
    event: {
      id: eventId,
      title: getEventTitle(eventId),
    },
  };

  console.log("Mock registration created:", { mockAttendee, mockRegistration });

  return {
    success: true,
    attendee: mockAttendee,
    registration: mockRegistration,
  };
};

// Helper function to get a mock event title
const getEventTitle = (eventId) => {
  const mockEvents = {
    "event-1": "Annual Tech Conference",
    "event-2": "Music Festival",
    "event-3": "Business Workshop",
  };

  return mockEvents[eventId] || "Unknown Event";
};

// Helper function to fetch attendee by email
export const fetchAttendeeByEmail = async (email) => {
  try {
    console.log(`Fetching attendee with email: ${email}`);
    const response = await attendeeApiInstance.get(
      `${ATTENDEE_API_URL}/email/${encodeURIComponent(email)}`
    );
    console.log(
      `Attendee with email ${email} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendee with email ${email}:`, error);

    // For development, return mock data if API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock attendee data for email ${email} due to API error`
      );

      // Create a mock attendee with the provided email
      return {
        id: `mock-${Math.random().toString(36).substring(2, 9)}`,
        firstName: email.split("@")[0].split(".")[0],
        lastName: email.split("@")[0].split(".")[1] || "User",
        email: email,
        phoneNumber: "123-456-7890",
        status: "REGISTERED",
        registrationIds: [],
        createdAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};
