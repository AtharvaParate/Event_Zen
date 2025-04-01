import axios from "./axiosConfig";

// Base URL for venue API endpoints
const VENUE_API_URL = "/venues";

// Helper function to check if we should use mock data
const shouldUseMockData = () => {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.REACT_APP_USE_MOCK_DATA === "true"
  );
};

// Mock venues for development
const MOCK_VENUES = [
  {
    id: "venue-1",
    name: "Grand Ballroom",
    location: "123 Main St, San Francisco, CA",
    capacity: 500,
    pricePerHour: 1000,
    description: "Elegant ballroom with chandeliers and a spacious dance floor",
    amenities: ["WiFi", "Catering", "Sound System", "Projector", "Stage"],
    images: ["https://source.unsplash.com/random/800x600/?ballroom"],
    availability: true,
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-02-01T12:00:00Z",
  },
  {
    id: "venue-2",
    name: "Garden Terrace",
    location: "456 Park Ave, San Francisco, CA",
    capacity: 200,
    pricePerHour: 750,
    description: "Beautiful outdoor venue with lush gardens and fountain",
    amenities: ["Outdoor Lighting", "BBQ Area", "Tent Options", "Restrooms"],
    images: ["https://source.unsplash.com/random/800x600/?garden"],
    availability: true,
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-02-15T12:00:00Z",
  },
  {
    id: "venue-3",
    name: "Tech Conference Center",
    location: "789 Technology Blvd, San Jose, CA",
    capacity: 300,
    pricePerHour: 850,
    description: "Modern conference center with state-of-the-art technology",
    amenities: [
      "High-speed WiFi",
      "Video Conferencing",
      "Multiple Screens",
      "Breakout Rooms",
    ],
    images: ["https://source.unsplash.com/random/800x600/?conference"],
    availability: false,
    createdAt: "2023-02-01T12:00:00Z",
    updatedAt: "2023-03-01T12:00:00Z",
  },
];

// Fetch all venues with optional pagination
export const fetchVenues = async (page = 0, size = 10) => {
  try {
    console.log(`Fetching venues: page=${page}, size=${size}`);
    const response = await axios.get(
      `${VENUE_API_URL}?page=${page}&size=${size}`
    );
    console.log("Venues fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching venues:", error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock venue data for development");

      // Paginate mock data
      const start = page * size;
      const end = start + size;
      const paginatedVenues = MOCK_VENUES.slice(start, end);

      return {
        content: paginatedVenues,
        totalElements: MOCK_VENUES.length,
        totalPages: Math.ceil(MOCK_VENUES.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= MOCK_VENUES.length,
      };
    }

    throw error;
  }
};

// Fetch venue by ID
export const fetchVenueById = async (id) => {
  try {
    console.log(`Fetching venue with ID: ${id}`);
    const response = await axios.get(`${VENUE_API_URL}/${id}`);
    console.log(`Venue ${id} fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching venue with ID ${id}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Returning mock data for venue ID ${id} due to API error`);

      // Try to find a matching mock venue by ID
      const mockVenue = MOCK_VENUES.find((v) => v.id === id);

      // If found, return it, otherwise create a new mock venue
      if (mockVenue) {
        return { ...mockVenue };
      }

      // Generate a mock venue based on the ID
      return {
        id: id,
        name: `Venue ${id.substring(0, 4)}`,
        location: "123 Mock St, San Francisco, CA",
        capacity: 250,
        pricePerHour: 800,
        description: "Mock venue generated for development purposes",
        amenities: ["WiFi", "Parking", "Catering"],
        images: ["https://source.unsplash.com/random/800x600/?venue"],
        availability: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

// Create new venue
export const createVenue = async (venueData) => {
  try {
    console.log("Creating venue with data:", venueData);
    const response = await axios.post(VENUE_API_URL, venueData);
    console.log("Venue created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating venue:", error);

    // For development, create a mock venue if the API fails
    if (shouldUseMockData()) {
      console.warn("Creating mock venue for development");

      const mockVenue = {
        id: `venue-${Math.random().toString(36).substring(2, 9)}`,
        ...venueData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to mock venues list for consistent state
      MOCK_VENUES.push(mockVenue);

      return mockVenue;
    }

    throw error;
  }
};

// Update venue
export const updateVenue = async (id, venueData) => {
  try {
    console.log(`Updating venue ${id} with data:`, venueData);
    const response = await axios.put(`${VENUE_API_URL}/${id}`, venueData);
    console.log(`Venue ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating venue with ID ${id}:`, error);

    // For development, update a mock venue if the API fails
    if (shouldUseMockData()) {
      console.warn(`Updating mock venue for ID ${id}`);

      // Find the venue in the mock list
      const venueIndex = MOCK_VENUES.findIndex((v) => v.id === id);

      if (venueIndex !== -1) {
        // Update the mock venue
        const updatedVenue = {
          ...MOCK_VENUES[venueIndex],
          ...venueData,
          id: id, // Ensure ID stays the same
          updatedAt: new Date().toISOString(),
        };

        MOCK_VENUES[venueIndex] = updatedVenue;
        return updatedVenue;
      } else {
        console.warn(`No mock venue found with ID ${id}`);
        throw new Error(`Venue with ID ${id} not found`);
      }
    }

    throw error;
  }
};

// Delete venue
export const deleteVenue = async (id) => {
  try {
    console.log(`Deleting venue with ID: ${id}`);
    await axios.delete(`${VENUE_API_URL}/${id}`);
    console.log(`Venue ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting venue with ID ${id}:`, error);

    // For development, delete from mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Deleting mock venue for ID ${id}`);

      // Filter out the venue from the mock list
      const initialLength = MOCK_VENUES.length;
      const filteredVenues = MOCK_VENUES.filter((v) => v.id !== id);
      MOCK_VENUES.length = 0;
      MOCK_VENUES.push(...filteredVenues);

      if (MOCK_VENUES.length < initialLength) {
        console.log(`Mock venue with ID ${id} deleted successfully`);
        return true;
      } else {
        console.warn(`No mock venue found with ID: ${id}`);
        return false;
      }
    }

    throw error;
  }
};

// Search venues
export const searchVenues = async (searchTerm, filters = {}) => {
  try {
    console.log(
      `Searching venues with term: "${searchTerm}" and filters:`,
      filters
    );

    // Build query parameters
    let queryParams = `term=${encodeURIComponent(searchTerm)}`;

    // Add additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    const response = await axios.get(`${VENUE_API_URL}/search?${queryParams}`);
    console.log("Search results:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching venues:", error);

    // For development, return filtered mock data if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock data for venue search");

      // Filter venues by search term (case insensitive)
      const lowerSearchTerm = searchTerm.toLowerCase();

      const filteredVenues = MOCK_VENUES.filter((venue) => {
        return (
          venue.name.toLowerCase().includes(lowerSearchTerm) ||
          venue.location.toLowerCase().includes(lowerSearchTerm) ||
          venue.description.toLowerCase().includes(lowerSearchTerm) ||
          (venue.amenities &&
            venue.amenities.some((amenity) =>
              amenity.toLowerCase().includes(lowerSearchTerm)
            ))
        );
      });

      // Apply capacity filter if provided
      if (filters.minCapacity) {
        const minCapacity = parseInt(filters.minCapacity, 10);
        if (!isNaN(minCapacity)) {
          return filteredVenues.filter(
            (venue) => venue.capacity >= minCapacity
          );
        }
      }

      // Apply availability filter if provided
      if (filters.availability === "true") {
        return filteredVenues.filter((venue) => venue.availability === true);
      }

      return filteredVenues;
    }

    throw error;
  }
};

// Check venue availability
export const checkVenueAvailability = async (venueId, date) => {
  try {
    console.log(`Checking availability for venue ${venueId} on ${date}`);
    const response = await axios.get(
      `${VENUE_API_URL}/${venueId}/availability?date=${date}`
    );
    console.log("Availability status:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking venue availability:", error);

    // For development, return mock availability if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock availability data for development");

      // Find the venue in the mock list
      const venue = MOCK_VENUES.find((v) => v.id === venueId);

      if (venue) {
        // Random availability with 70% chance of being available
        const isAvailable = Math.random() < 0.7;

        return {
          venueId: venueId,
          date: date,
          available: isAvailable,
          availableTimeSlots: isAvailable
            ? ["09:00-12:00", "13:00-17:00", "18:00-22:00"]
            : [],
        };
      } else {
        console.warn(`No mock venue found with ID ${venueId}`);
        throw new Error(`Venue with ID ${venueId} not found`);
      }
    }

    throw error;
  }
};
