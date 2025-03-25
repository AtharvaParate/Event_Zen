import axios from "./axiosConfig";

const eventApi = {
  getEvents: async (params) => {
    const {
      page = 0,
      size = 10,
      sort,
      search,
      category,
      status,
    } = params || {};
    let url = `/events?page=${page}&size=${size}`;

    if (sort) url += `&sort=${sort}`;
    if (search) url += `&search=${search}`;
    if (category) url += `&category=${category}`;
    if (status) url += `&status=${status}`;

    return await axios.get(url);
  },

  getEventById: async (id) => {
    return await axios.get(`/events/${id}`);
  },

  createEvent: async (eventData) => {
    return await axios.post("/events", eventData);
  },

  updateEvent: async (id, eventData) => {
    return await axios.put(`/events/${id}`, eventData);
  },

  deleteEvent: async (id) => {
    return await axios.delete(`/events/${id}`);
  },

  getUpcomingEvents: async () => {
    return await axios.get("/events/upcoming");
  },

  getEventsByCategory: async (category) => {
    return await axios.get(`/events/category/${category}`);
  },

  getEventsByOrganizer: async (organizerId) => {
    return await axios.get(`/events/organizer/${organizerId}`);
  },

  updateEventStatus: async (id, status) => {
    return await axios.patch(`/events/${id}/status`, { status });
  },
};

export default eventApi;
