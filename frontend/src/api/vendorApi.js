import axios from "./axiosConfig";

const vendorApi = {
  getVendors: async (params) => {
    const { page = 0, size = 10, sort, search, type } = params || {};
    let url = `/vendors?page=${page}&size=${size}`;

    if (sort) url += `&sort=${sort}`;
    if (search) url += `&search=${search}`;
    if (type) url += `&type=${type}`;

    return await axios.get(url);
  },

  getVendorById: async (id) => {
    return await axios.get(`/vendors/${id}`);
  },

  createVendor: async (vendorData) => {
    return await axios.post("/vendors", vendorData);
  },

  updateVendor: async (id, vendorData) => {
    return await axios.put(`/vendors/${id}`, vendorData);
  },

  deleteVendor: async (id) => {
    return await axios.delete(`/vendors/${id}`);
  },

  getVendorsByType: async (type) => {
    return await axios.get(`/vendors/type/${type}`);
  },

  getVendorsByServiceArea: async (area) => {
    return await axios.get(`/vendors/area/${area}`);
  },

  getVendorsByEvent: async (eventId) => {
    return await axios.get(`/vendors/event/${eventId}`);
  },
};

export default vendorApi;
