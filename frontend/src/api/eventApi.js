import axios from "axios";
import { getRandomDefaultImage } from "../utils/imageUtils";
import {
  API_CONFIG,
  EVENT_ENDPOINTS,
  getAuthHeader,
} from "../config/apiConfig";

// Create a separate axios instance for event services with proper base URL
const eventAxios = axios.create({
  baseURL: API_CONFIG.EVENT_API_URL,
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor
eventAxios.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeader();
    if (authHeaders.Authorization) {
      config.headers["Authorization"] = authHeaders.Authorization;
    }
    console.log(`Event API request to ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error("Event API request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
eventAxios.interceptors.response.use(
  (response) => {
    console.log(
      `Event API response from ${response.config.url}:`,
      response.status
    );
    return response;
  },
  (error) => {
    console.error("Event API Error:", error);
    if (error.response) {
      console.error(
        "Error details:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
    }
    return Promise.reject(error);
  }
);

// Mock events data
const mockEvents = [
  {
    id: "evt-001",
    name: "Tech Conference 2024",
    title: "Tech Conference 2024",
    description: "Join us for the latest in technology innovation",
    startDate: "2024-09-15T09:00:00",
    endDate: "2024-09-16T17:00:00",
    location: "San Francisco Convention Center",
    category: "TECHNOLOGY",
    status: "UPCOMING",
    organizer: { id: "1", name: "John Doe" },
    capacity: 500,
    price: 299.99,
    image: "event-1.avif",
    createdAt: "2024-03-01T10:30:00",
  },
  {
    id: "evt-002",
    name: "Music Festival",
    title: "Music Festival",
    description: "Annual music festival featuring top artists",
    startDate: "2024-07-20T12:00:00",
    endDate: "2024-07-22T23:00:00",
    location: "Central Park, New York",
    category: "MUSIC",
    status: "UPCOMING",
    organizer: { id: "1", name: "John Doe" },
    capacity: 5000,
    price: 150,
    image: "event-2.avif",
    createdAt: "2024-02-15T14:20:00",
  },
  {
    id: "evt-003",
    name: "Wellness Retreat",
    title: "Wellness Retreat",
    description: "Weekend wellness and mindfulness retreat",
    startDate: "2024-08-05T08:00:00",
    endDate: "2024-08-07T16:00:00",
    location: "Mountain View Resort, Colorado",
    category: "HEALTH",
    status: "UPCOMING",
    organizer: { id: "1", name: "John Doe" },
    capacity: 50,
    price: 499.99,
    image: "event-3.avif",
    createdAt: "2024-03-10T09:15:00",
  },
];

// Mock ticket types
const mockTicketTypes = [
  {
    id: "general",
    name: "General Admission",
    price: 50,
    description: "Standard entry ticket",
    eventId: "evt-001",
  },
  {
    id: "vip",
    name: "VIP",
    price: 100,
    description: "Premium access with special perks",
    eventId: "evt-001",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    price: 35,
    description: "Discounted rate for early registration",
    eventId: "evt-001",
  },
  {
    id: "general",
    name: "General Admission",
    price: 25,
    description: "Standard entry ticket",
    eventId: "evt-002",
  },
  {
    id: "vip",
    name: "VIP",
    price: 75,
    description: "Premium access with special perks",
    eventId: "evt-002",
  },
];

// Flag to determine if we use mock data or real API
const USE_MOCK_DATA = false;

// Simple fetchEvents function for our new components
export const fetchEvents = async (
  page = 0,
  size = API_CONFIG.DEFAULT_PAGE_SIZE
) => {
  try {
    console.log("===== UPDATED fetchEvents called =====");
    console.log(`===== Events API URL: ${API_CONFIG.EVENT_API_URL} =====`);
    console.log(`===== Events endpoint: ${EVENT_ENDPOINTS.EVENTS} =====`);
    console.log(`===== Using mock data: ${API_CONFIG.USE_MOCK_DATA} =====`);

    const response = await eventAxios.get(
      `${EVENT_ENDPOINTS.EVENTS}?page=${page}&size=${size}`
    );
    console.log(
      "===== Events API response type:",
      typeof response.data,
      Array.isArray(response.data) ? "array" : "not array"
    );

    // Check if the response is an array (non-paginated) or an object with content (paginated)
    if (Array.isArray(response.data)) {
      console.log("===== Converting array response to paginated format =====");
      // Convert the array response to a paginated format
      return {
        content: response.data,
        totalPages: 1,
        totalElements: response.data.length,
        size: size,
        number: page,
        first: page === 0,
        last: true,
      };
    }

    return response.data;
  } catch (error) {
    console.error("===== Error fetching events =====", error);
    console.error(`===== Error details: ${error.message} =====`);

    // No fallback to mock data - throw the error to be handled by the caller
    throw error;
  }
};

const eventApi = {
  getEvents: async (params) => {
    try {
      const response = await eventAxios.get(EVENT_ENDPOINTS.EVENTS, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  getEventById: async (id) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const event = mockEvents.find((event) => event.id === id);

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    } else {
      try {
        const eventId = id.toString();
        console.log(`Fetching event with ID: ${eventId}`);
        const response = await eventAxios.get(
          EVENT_ENDPOINTS.EVENT_BY_ID(eventId)
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching event ${id}:`, error);
        throw error;
      }
    }
  },

  createEvent: async (eventData) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get a random default image using our image utility
      const randomImage = getRandomDefaultImage("event").replace(
        "/images/",
        ""
      );

      const newEvent = {
        id: `evt-${Math.random().toString(36).substr(2, 6)}`,
        ...eventData,
        // Add default image if none is provided
        image: eventData.image || randomImage,
        // Add organizer info
        organizer: { id: "1", name: "John Doe" },
        status: "UPCOMING",
        createdAt: new Date().toISOString(),
      };

      // Ensure image file extension is .avif
      if (newEvent.image && !newEvent.image.endsWith(".avif")) {
        newEvent.image = newEvent.image.replace(/\.[^/.]+$/, "") + ".avif";
      }

      mockEvents.unshift(newEvent);

      return newEvent;
    } else {
      let retries = 0;
      const maxRetries = 3;

      const attemptCreateEvent = async () => {
        try {
          console.log(
            `Attempt ${retries + 1}: Sending event data to API:`,
            JSON.stringify(eventData)
          );
          // Make a separate call with extended timeout for event creation
          const response = await axios({
            method: "post",
            url: `${API_CONFIG.EVENT_API_URL}${EVENT_ENDPOINTS.EVENTS}`,
            data: eventData,
            timeout: 45000, // 45 seconds timeout for each attempt
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
          });
          console.log("Event creation API response:", response);
          return response.data;
        } catch (error) {
          console.error(`Attempt ${retries + 1}: Error creating event:`, error);

          // Check for specific server errors and provide better messages
          if (error.response) {
            if (error.response.status === 500) {
              console.error(
                "Server error - possible database issue:",
                error.response.data
              );
              throw new Error(
                "Server error occurred. The database might be unavailable or there's a data validation issue."
              );
            } else if (
              error.response.status === 401 ||
              error.response.status === 403
            ) {
              console.error("Authentication error:", error.response.data);
              throw new Error(
                "You don't have permission to create events. Please log in again."
              );
            }
          }

          // Check if it's a timeout error and we can retry
          if (
            (error.code === "ECONNABORTED" ||
              (error.message && error.message.includes("timeout")) ||
              (error.message && error.message.includes("Network Error"))) &&
            retries < maxRetries
          ) {
            retries++;
            console.log(
              `Retrying event creation (${retries}/${maxRetries})...`
            );
            // Wait for 3 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return attemptCreateEvent(); // Recursive retry
          }

          // If all retries failed
          if (
            error.code === "ECONNABORTED" ||
            (error.message && error.message.includes("timeout"))
          ) {
            console.error(
              "Event creation timed out after all retry attempts - please try again"
            );
            throw new Error(
              "Request timed out. The server might be experiencing high load. Please try again later."
            );
          }

          throw error;
        }
      };

      return attemptCreateEvent();
    }
  },

  updateEvent: async (id, eventData) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = mockEvents.findIndex((event) => event.id === id);

      if (index === -1) {
        throw new Error("Event not found");
      }

      const updatedEvent = {
        ...mockEvents[index],
        ...eventData,
      };

      mockEvents[index] = updatedEvent;

      return updatedEvent;
    } else {
      try {
        const response = await eventAxios.put(
          EVENT_ENDPOINTS.EVENT_BY_ID(id),
          eventData
        );
        console.log("Update response:", response);
        return response.data;
      } catch (error) {
        console.error(`Error updating event ${id}:`, error);
        throw error;
      }
    }
  },

  deleteEvent: async (id) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const index = mockEvents.findIndex((event) => event.id === id);

      if (index === -1) {
        throw new Error("Event not found");
      }

      mockEvents.splice(index, 1);

      return { success: true };
    } else {
      try {
        const response = await eventAxios.delete(
          EVENT_ENDPOINTS.EVENT_BY_ID(id)
        );
        console.log("Delete response:", response);
        return response.data;
      } catch (error) {
        console.error(`Error deleting event ${id}:`, error);
        throw error;
      }
    }
  },

  getUpcomingEvents: async () => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockEvents.filter((event) => event.status === "UPCOMING");
    } else {
      try {
        const response = await eventAxios.get(EVENT_ENDPOINTS.UPCOMING_EVENTS);
        return response.data;
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        throw error;
      }
    }
  },

  getEventsByCategory: async (category) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockEvents.filter((event) => event.category === category);
    } else {
      try {
        const response = await eventAxios.get(
          EVENT_ENDPOINTS.EVENTS_BY_CATEGORY(category)
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching events for category ${category}:`, error);
        throw error;
      }
    }
  },

  getEventsByOrganizer: async (organizerId) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockEvents.filter((event) => event.organizer.id === organizerId);
    } else {
      try {
        const response = await eventAxios.get(
          EVENT_ENDPOINTS.EVENTS_BY_ORGANIZER(organizerId)
        );
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching events for organizer ${organizerId}:`,
          error
        );
        throw error;
      }
    }
  },

  updateEventStatus: async (id, status) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      const index = mockEvents.findIndex((event) => event.id === id);

      if (index === -1) {
        throw new Error("Event not found");
      }

      mockEvents[index].status = status;

      return mockEvents[index];
    } else {
      try {
        const response = await eventAxios.patch(
          EVENT_ENDPOINTS.EVENT_STATUS(id, status)
        );
        console.log("Status update response:", response);
        return response.data;
      } catch (error) {
        console.error(`Error updating status for event ${id}:`, error);
        throw error;
      }
    }
  },

  // Ticket Types API functions
  fetchTicketTypesByEventId: async (eventId) => {
    try {
      console.log(`Fetching ticket types for event ${eventId}`);
      const response = await fetch(
        `${API_CONFIG.EVENT_API_URL}/${eventId}/ticket-types`
      );

      if (!response.ok) {
        console.error(
          `Failed to fetch ticket types: ${response.status} ${response.statusText}`
        );

        // In development, return mock data if API fails
        if (API_CONFIG.NODE_ENV === "development") {
          console.log("Using mock ticket type data in development");
          return [
            {
              id: 1,
              name: "VIP",
              price: 99.99,
              description: "VIP access with special perks",
            },
            {
              id: 2,
              name: "STANDARD",
              price: 49.99,
              description: "Standard admission",
            },
            {
              id: 3,
              name: "EARLY_BIRD",
              price: 39.99,
              description: "Discounted early registration",
            },
          ];
        }
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching ticket types:", error);

      // In development, return mock data if API fails
      if (API_CONFIG.NODE_ENV === "development") {
        console.log("Using mock ticket type data in development due to error");
        return [
          {
            id: 1,
            name: "VIP",
            price: 99.99,
            description: "VIP access with special perks",
          },
          {
            id: 2,
            name: "STANDARD",
            price: 49.99,
            description: "Standard admission",
          },
          {
            id: 3,
            name: "EARLY_BIRD",
            price: 39.99,
            description: "Discounted early registration",
          },
        ];
      }
      return [];
    }
  },

  // Add the ticket types function to eventApi object
  getTicketTypesByEventId: async (eventId) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Filter ticket types by event ID
      const filteredTicketTypes = mockTicketTypes.filter(
        (ticket) => ticket.eventId === eventId
      );

      return filteredTicketTypes.length > 0
        ? filteredTicketTypes
        : [
            {
              id: "general",
              name: "General Admission",
              price: 50,
              description: "Standard entry ticket",
              eventId: eventId,
            },
            {
              id: "vip",
              name: "VIP",
              price: 100,
              description: "Premium access with special perks",
              eventId: eventId,
            },
          ];
    } else {
      try {
        const response = await eventAxios.get(
          EVENT_ENDPOINTS.TICKET_TYPES(eventId)
        );
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching ticket types for event ${eventId}:`,
          error
        );

        // In development mode, return mock data
        if (API_CONFIG.NODE_ENV === "development") {
          console.warn("Returning mock ticket types in development");
          return [
            {
              id: "general",
              name: "General Admission",
              price: 50,
              description: "Standard entry ticket",
              eventId: eventId,
            },
            {
              id: "vip",
              name: "VIP",
              price: 100,
              description: "Premium access with special perks",
              eventId: eventId,
            },
          ];
        }

        throw error;
      }
    }
  },
};

export default eventApi;

// Fetch ticket types by event ID
export const fetchTicketTypesByEventId = async (eventId) => {
  try {
    const response = await eventApi.getTicketTypesByEventId(eventId);
    return response;
  } catch (error) {
    console.error(`Error fetching ticket types for event ${eventId}:`, error);

    // For development, return mock data if the API fails
    if (API_CONFIG.NODE_ENV === "development") {
      console.warn(
        `Returning mock ticket types for event ${eventId} due to API error`
      );

      // Filter ticket types by event ID
      const filteredTicketTypes = mockTicketTypes.filter(
        (ticket) => ticket.eventId === eventId
      );

      // If no ticket types for this event, return default ones
      if (filteredTicketTypes.length === 0) {
        return [
          {
            id: "general",
            name: "General Admission",
            price: 50,
            description: "Standard entry ticket",
            eventId: eventId,
          },
          {
            id: "vip",
            name: "VIP",
            price: 100,
            description: "Premium access with special perks",
            eventId: eventId,
          },
        ];
      }

      return filteredTicketTypes;
    }

    throw error;
  }
};
