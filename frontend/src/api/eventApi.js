import { getRandomDefaultImage } from "../utils/imageUtils";

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

const eventApi = {
  getEvents: async (params) => {
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
  },

  getEventById: async (id) => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const event = mockEvents.find((event) => event.id === id);

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  },

  createEvent: async (eventData) => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get a random default image using our image utility
    const randomImage = getRandomDefaultImage("event").replace("/images/", "");

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
  },

  updateEvent: async (id, eventData) => {
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
  },

  deleteEvent: async (id) => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const index = mockEvents.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new Error("Event not found");
    }

    mockEvents.splice(index, 1);

    return { success: true };
  },

  getUpcomingEvents: async () => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockEvents.filter((event) => event.status === "UPCOMING");
  },

  getEventsByCategory: async (category) => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockEvents.filter((event) => event.category === category);
  },

  getEventsByOrganizer: async (organizerId) => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockEvents.filter((event) => event.organizer.id === organizerId);
  },

  updateEventStatus: async (id, status) => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = mockEvents.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new Error("Event not found");
    }

    mockEvents[index].status = status;

    return mockEvents[index];
  },
};

export default eventApi;
