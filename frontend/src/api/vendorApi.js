import axios from "./axiosConfig";

// Base URL for vendor API
const VENDOR_API_URL = "/vendors";

// Helper function to check if we should use mock data
const shouldUseMockData = () => {
  return false; // Disable mock data usage
};

// Mock vendors for development
const MOCK_VENDORS = [
  {
    id: "vendor-1",
    name: "Premium Catering Co.",
    email: "info@premiumcatering.com",
    phone: "555-123-4567",
    type: "CATERING",
    description: "Premium catering services for all types of events",
    serviceAreas: ["San Francisco", "Oakland", "San Jose"],
    priceRange: "$$$",
    website: "https://premiumcatering.example.com",
    socialMedia: {
      facebook: "premiumcatering",
      instagram: "premium_catering",
    },
    reviews: [
      {
        id: "rev-1",
        rating: 5,
        comment: "Excellent service and delicious food!",
        reviewer: "John Smith",
        date: "2023-02-15T10:30:00Z",
      },
    ],
    active: true,
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-03-01T14:30:00Z",
  },
  {
    id: "vendor-2",
    name: "Event Photography Masters",
    email: "contact@eventphotography.com",
    phone: "555-987-6543",
    type: "PHOTOGRAPHY",
    description:
      "Professional photography services for weddings, corporate events, and more",
    serviceAreas: ["San Francisco", "Napa Valley", "Monterey"],
    priceRange: "$$",
    website: "https://eventphotography.example.com",
    socialMedia: {
      instagram: "event_photography",
      twitter: "EventPhotoMasters",
    },
    reviews: [
      {
        id: "rev-2",
        rating: 4,
        comment: "Great photos, very professional team",
        reviewer: "Emily Johnson",
        date: "2023-03-10T15:45:00Z",
      },
    ],
    active: true,
    createdAt: "2023-01-15T09:00:00Z",
    updatedAt: "2023-03-15T11:20:00Z",
  },
  {
    id: "vendor-3",
    name: "Elegant Estates",
    email: "bookings@elegantestates.com",
    phone: "555-456-7890",
    type: "VENUE",
    description: "Beautiful venues for weddings and corporate events",
    serviceAreas: ["Napa Valley", "Sonoma", "San Francisco"],
    priceRange: "$$$$",
    website: "https://elegantestates.example.com",
    socialMedia: {
      facebook: "elegantestates",
      instagram: "elegant_estates",
      pinterest: "elegantestates",
    },
    reviews: [
      {
        id: "rev-3",
        rating: 5,
        comment: "Stunning venue, perfect for our wedding!",
        reviewer: "Sarah Williams",
        date: "2023-02-28T16:20:00Z",
      },
    ],
    active: true,
    createdAt: "2022-12-01T10:15:00Z",
    updatedAt: "2023-03-10T13:40:00Z",
  },
];

// Get all vendors with optional pagination
export const fetchVendors = async (page = 0, size = 10) => {
  try {
    console.log(`Fetching vendors: page=${page}, size=${size}`);
    const response = await axios.get(
      `${VENDOR_API_URL}?page=${page}&size=${size}`
    );
    console.log("Vendors fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock vendor data for development");

      // Return paginated mock data
      const start = page * size;
      const end = start + size;
      const paginatedVendors = MOCK_VENDORS.slice(start, end);

      return {
        content: paginatedVendors,
        totalElements: MOCK_VENDORS.length,
        totalPages: Math.ceil(MOCK_VENDORS.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= MOCK_VENDORS.length,
      };
    }

    throw error;
  }
};

// Get vendor by ID
export const fetchVendorById = async (id) => {
  try {
    console.log(`Fetching vendor with ID: ${id}`);
    const response = await axios.get(`${VENDOR_API_URL}/${id}`);
    console.log(`Vendor ${id} fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vendor with ID ${id}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Returning mock data for vendor ID ${id} due to API error`);

      // Try to find a matching mock vendor by ID
      const mockVendor = MOCK_VENDORS.find((v) => v.id === id);

      // If found, return it, otherwise create a new mock vendor
      if (mockVendor) {
        return { ...mockVendor };
      }

      // Generate a mock vendor based on the ID
      return {
        id: id,
        name: `Vendor ${id.substring(0, 4)}`,
        email: `info@vendor${id.substring(0, 4)}.com`,
        phone: "555-000-0000",
        type: "OTHER",
        description: "Mock vendor generated for development purposes",
        serviceAreas: ["San Francisco"],
        priceRange: "$$",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

// Get vendors by type
export const fetchVendorsByType = async (type, page = 0, size = 10) => {
  try {
    console.log(`Fetching vendors of type ${type}: page=${page}, size=${size}`);
    const response = await axios.get(
      `${VENDOR_API_URL}/type/${type}?page=${page}&size=${size}`
    );
    console.log(`Vendors of type ${type} fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vendors of type ${type}:`, error);

    // For development, return mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(
        `Returning mock data for vendors of type ${type} due to API error`
      );

      // Filter mock vendors by type
      const filteredVendors = MOCK_VENDORS.filter((v) => v.type === type);

      // Paginate results
      const start = page * size;
      const end = start + size;
      const paginatedVendors = filteredVendors.slice(start, end);

      return {
        content: paginatedVendors,
        totalElements: filteredVendors.length,
        totalPages: Math.ceil(filteredVendors.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: (page + 1) * size >= filteredVendors.length,
      };
    }

    throw error;
  }
};

// Create new vendor
export const createVendor = async (vendorData) => {
  try {
    console.log("Creating vendor with data:", vendorData);
    const response = await axios.post(VENDOR_API_URL, vendorData);
    console.log("Vendor created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating vendor:", error);

    // For development, create a mock vendor if the API fails
    if (shouldUseMockData()) {
      console.warn("Creating mock vendor for development");

      const mockVendor = {
        id: `vendor-${Math.random().toString(36).substring(2, 9)}`,
        ...vendorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to mock vendors list for consistent state
      MOCK_VENDORS.push(mockVendor);

      return mockVendor;
    }

    throw error;
  }
};

// Update vendor
export const updateVendor = async (id, vendorData) => {
  try {
    console.log(`Updating vendor ${id} with data:`, vendorData);
    const response = await axios.put(`${VENDOR_API_URL}/${id}`, vendorData);
    console.log(`Vendor ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating vendor with ID ${id}:`, error);

    // For development, update a mock vendor if the API fails
    if (shouldUseMockData()) {
      console.warn(`Updating mock vendor for ID ${id}`);

      // Find the vendor in the mock list
      const vendorIndex = MOCK_VENDORS.findIndex((v) => v.id === id);

      if (vendorIndex !== -1) {
        // Update the mock vendor
        const updatedVendor = {
          ...MOCK_VENDORS[vendorIndex],
          ...vendorData,
          id: id, // Ensure ID stays the same
          updatedAt: new Date().toISOString(),
        };

        MOCK_VENDORS[vendorIndex] = updatedVendor;
        return updatedVendor;
      } else {
        console.warn(`No mock vendor found with ID ${id}`);
        throw new Error(`Vendor with ID ${id} not found`);
      }
    }

    throw error;
  }
};

// Delete vendor
export const deleteVendor = async (id) => {
  try {
    console.log(`Deleting vendor with ID: ${id}`);
    await axios.delete(`${VENDOR_API_URL}/${id}`);
    console.log(`Vendor ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting vendor with ID ${id}:`, error);

    // For development, delete from mock data if the API fails
    if (shouldUseMockData()) {
      console.warn(`Deleting mock vendor for ID ${id}`);

      // Filter out the vendor from the mock list
      const initialLength = MOCK_VENDORS.length;
      const filteredVendors = MOCK_VENDORS.filter((v) => v.id !== id);
      MOCK_VENDORS.length = 0;
      MOCK_VENDORS.push(...filteredVendors);

      if (MOCK_VENDORS.length < initialLength) {
        console.log(`Mock vendor with ID ${id} deleted successfully`);
        return true;
      } else {
        console.warn(`No mock vendor found with ID: ${id}`);
        return false;
      }
    }

    throw error;
  }
};

// Search vendors
export const searchVendors = async (searchTerm, filters = {}) => {
  try {
    console.log(
      `Searching vendors with term: "${searchTerm}" and filters:`,
      filters
    );

    // Build query parameters
    let queryParams = `term=${encodeURIComponent(searchTerm)}`;

    // Add additional filters to the query string
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    const response = await axios.get(`${VENDOR_API_URL}/search?${queryParams}`);
    console.log("Search results:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching vendors:", error);

    // For development, return filtered mock data if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock data for vendor search");

      // Filter vendors by search term (case insensitive)
      const lowerSearchTerm = searchTerm.toLowerCase();

      const filteredVendors = MOCK_VENDORS.filter((vendor) => {
        return (
          vendor.name.toLowerCase().includes(lowerSearchTerm) ||
          vendor.description.toLowerCase().includes(lowerSearchTerm) ||
          vendor.email.toLowerCase().includes(lowerSearchTerm) ||
          vendor.type.toLowerCase().includes(lowerSearchTerm) ||
          (vendor.serviceAreas &&
            vendor.serviceAreas.some((area) =>
              area.toLowerCase().includes(lowerSearchTerm)
            ))
        );
      });

      // Apply type filter if provided
      if (filters.type) {
        return filteredVendors.filter((vendor) => vendor.type === filters.type);
      }

      // Apply service area filter if provided
      if (filters.serviceArea) {
        return filteredVendors.filter(
          (vendor) =>
            vendor.serviceAreas &&
            vendor.serviceAreas.some((area) =>
              area.toLowerCase().includes(filters.serviceArea.toLowerCase())
            )
        );
      }

      // Apply active filter if provided
      if (filters.active === "true" || filters.active === "false") {
        const activeFilter = filters.active === "true";
        return filteredVendors.filter(
          (vendor) => vendor.active === activeFilter
        );
      }

      return filteredVendors;
    }

    throw error;
  }
};

// Get vendor types (for dropdown menus)
export const getVendorTypes = async () => {
  try {
    console.log("Fetching vendor types");
    const response = await axios.get(`${VENDOR_API_URL}/types`);
    console.log("Vendor types fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor types:", error);

    // For development, return mock vendor types if the API fails
    if (shouldUseMockData()) {
      console.warn("Returning mock vendor types for development");

      // Return predefined vendor types
      return [
        "CATERING",
        "PHOTOGRAPHY",
        "VIDEOGRAPHY",
        "VENUE",
        "ENTERTAINMENT",
        "DECORATION",
        "TRANSPORTATION",
        "FLORIST",
        "OTHER",
      ];
    }

    throw error;
  }
};
