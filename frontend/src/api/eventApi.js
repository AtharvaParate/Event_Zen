import { getRandomDefaultImage } from "../utils/imageUtils";
import { eventApiInstance } from "./axiosConfig";
import axios from "axios";

// Mock events data
const mockEvents = [
  {
    id: "evt-001",
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
export const fetchEvents = async (page = 0, size = 10) => {
  try {
    const response = await eventApi.getEvents({ page, size });
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);

    // For development, return mock data if the API fails
    if (process.env.NODE_ENV === "development") {
      console.warn("Returning mock data for events due to API error");

      // Return mock events in paginated format
      return {
        content: mockEvents,
        totalElements: mockEvents.length,
        totalPages: 1,
        number: page,
        size: size,
        first: page === 0,
        last: true,
      };
    }

    throw error;
  }
};

const eventApi = {
  getEvents: async (params) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { userId } = params || {};
      let filteredEvents = [...mockEvents];

      // If userId is provided, filter events by organizer
      if (userId) {
        filteredEvents = mockEvents.filter(
          (event) => event.organizer.id === userId
        );
      }

      // Return paginated response format
      return {
        content: filteredEvents,
        totalElements: filteredEvents.length,
        totalPages: 1,
        number: 0,
        size: filteredEvents.length,
      };
    } else {
      try {
        // Create a raw axios instance without auth headers for public endpoints
        const publicAxios = axios.create({
          baseURL:
            process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await publicAxios.get("/events", { params });
        return response.data;
      } catch (error) {
        console.error("Error fetching events:", error);

        // Log more detailed error information
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

        throw error;
      }
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
        // Convert potential numeric IDs to strings and log it
        const eventId = id.toString();
        console.log(`Fetching event with ID: ${eventId}`);

        // Handle special case for ID "1" in development mode
        if (eventId === "1") {
          console.log(
            "Development mode: Using first event from mock data for ID 1"
          );
          return {
            id: "1",
            title: "Demo Event",
            description: "This is a demo event for development",
            startTime: [2025, 3, 30, 13, 0],
            endTime: [2025, 3, 30, 15, 0],
            location: "Demo Location",
            category: "TECHNOLOGY",
            maxAttendees: 100,
            price: 0,
            organizerId: "test-organizer",
            status: "PUBLISHED",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        // Create a raw axios instance without auth headers for public endpoints
        const publicAxios = axios.create({
          baseURL:
            process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await publicAxios.get(`/events/${eventId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching event ${id}:`, error);

        // Log more detailed error information
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

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
      try {
        console.log("Sending event data to API:", JSON.stringify(eventData));

        // Create a raw axios instance without auth headers for public endpoints
        const publicAxios = axios.create({
          baseURL:
            process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Use the public endpoint for testing with a clean axios instance
        const response = await publicAxios.post(
          "/events/public/create",
          eventData
        );

        console.log("API response:", response);

        if (response && response.data) {
          return response.data;
        } else {
          throw new Error("No data returned from API");
        }
      } catch (error) {
        console.error("Error creating event:", error);

        // Log more detailed error information
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }

        throw error;
      }
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
        // Create a raw axios instance without auth headers for public endpoints
        const publicAxios = axios.create({
          baseURL:
            process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Updating event with data:", JSON.stringify(eventData));
        const response = await publicAxios.put(`/events/${id}`, eventData);
        console.log("Update response:", response);
        return response.data;
      } catch (error) {
        console.error(`Error updating event ${id}:`, error);

        // Log more detailed error information
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

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
        // Create a raw axios instance without auth headers for public endpoints
        const publicAxios = axios.create({
          baseURL:
            process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`Deleting event with ID: ${id}`);
        const response = await publicAxios.delete(`/events/${id}`);
        console.log("Delete response:", response);
        return response.data;
      } catch (error) {
        console.error(`Error deleting event ${id}:`, error);

        // Log more detailed error information
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

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
        const response = await eventApiInstance.get("/events/upcoming");
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
        const response = await eventApiInstance.get(
          `/events/category/${category}`
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
        const response = await eventApiInstance.get(
          `/events/organizer/${organizerId}`
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
        // Create a raw axios instance without auth headers for public endpoints
        const publicAxios = axios.create({
          baseURL:
            process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`Updating status for event ${id} to ${status}`);
        const response = await publicAxios.patch(
          `/events/${id}/status?status=${status}`
        );
        console.log("Status update response:", response);
        return response.data;
      } catch (error) {
        console.error(`Error updating status for event ${id}:`, error);

        // Log more detailed error information
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

        throw error;
      }
    }
  },

  // Ticket Types API functions
  fetchTicketTypesByEventId: async (eventId) => {
    try {
      console.log(`Fetching ticket types for event ${eventId}`);
      const response = await fetch(
        `${process.env.REACT_APP_EVENT_API_URL}/${eventId}/ticket-types`
      );

      if (!response.ok) {
        console.error(
          `Failed to fetch ticket types: ${response.status} ${response.statusText}`
        );

        // In development, return mock data if API fails
        if (process.env.NODE_ENV === "development") {
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
      if (process.env.NODE_ENV === "development") {
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
        // Create a raw axios instance without auth headers for public endpoints
        const publicAxios = axios.create({
          baseURL:
            process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await publicAxios.get(
          `/events/${eventId}/ticket-types`
        );
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching ticket types for event ${eventId}:`,
          error
        );

        // In development mode, return mock data
        if (process.env.NODE_ENV === "development") {
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
    if (process.env.NODE_ENV === "development") {
      console.warn(`Returning mock ticket types for event ${eventId} due to API error`);

      // Filter ticket types by event ID
      const filteredTicketTypes = mockTicketTypes.filter(
        ticket => ticket.eventId === eventId
      );

      // If no ticket types for this event, return default ones
      if (filteredTicketTypes.length === 0) {
        return [
          {
            id: 'general',
            name: 'General Admission',
            price: 50,
            description: 'Standard entry ticket',
            eventId: eventId
          },
          {
            id: 'vip',
            name: 'VIP',
            price: 100,
            description: 'Premium access with special perks',
            eventId: eventId
          }
        ];
      }

      return filteredTicketTypes;
    }

    throw error;
  }
};
