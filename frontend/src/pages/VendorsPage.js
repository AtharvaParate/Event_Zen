import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";

// Mock data for vendors
const vendors = [
  {
    id: 1,
    name: "Party Planners Deluxe",
    category: "Event Planning",
    location: "New York, NY",
    rating: 4.8,
    description:
      "Premier event planning service with 10+ years experience in corporate and private events.",
    image: "vendor-1.jpg",
  },
  {
    id: 2,
    name: "Gourmet Catering Co.",
    category: "Catering",
    location: "Los Angeles, CA",
    rating: 4.6,
    description:
      "Fine dining catering service specializing in international cuisine for events of all sizes.",
    image: "vendor-2.jpg",
  },
  {
    id: 3,
    name: "Sound & Lighting Pros",
    category: "Audio/Visual",
    location: "Chicago, IL",
    rating: 4.7,
    description:
      "Complete audio and visual solutions for concerts, conferences, and special events.",
    image: "vendor-3.jpg",
  },
  {
    id: 4,
    name: "Blooms & Bouquets",
    category: "Floral Design",
    location: "Miami, FL",
    rating: 4.9,
    description:
      "Award-winning floral design studio creating stunning arrangements for weddings and corporate events.",
    image: "vendor-4.jpg",
  },
];

// Categories for filtering
const categories = [
  "All Categories",
  "Event Planning",
  "Catering",
  "Audio/Visual",
  "Floral Design",
  "Photography",
  "Venues",
  "Entertainment",
];

const VendorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [page, setPage] = useState(1);
  const vendorsPerPage = 6;

  // Filter vendors based on search term and category
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      vendor.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Paginate results
  const paginatedVendors = filteredVendors.slice(
    (page - 1) * vendorsPerPage,
    page * vendorsPerPage
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, sm: 4 },
        maxWidth: "1600px",
        mx: "auto",
        mt: 4,
        mb: 8,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Find the Perfect Vendor
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Discover top-rated vendors to make your next event exceptional
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Vendors"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by name, location, or keywords"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Results count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          {filteredVendors.length} vendors found
          {selectedCategory !== "All Categories" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </Typography>
      </Box>

      {/* Vendors Grid */}
      <Grid container spacing={4}>
        {paginatedVendors.length > 0 ? (
          paginatedVendors.map((vendor) => (
            <Grid item xs={12} sm={6} md={4} key={vendor.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 4,
                  },
                }}
                elevation={2}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`${process.env.PUBLIC_URL}/images/vendors/${vendor.image}`}
                  alt={vendor.name}
                  onError={(e) => {
                    console.log("Vendor image load error, using fallback");
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: "bold" }}
                    >
                      {vendor.name}
                    </Typography>
                    <Chip
                      icon={<StoreIcon />}
                      label={vendor.category}
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Rating
                      value={vendor.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {vendor.rating}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: "text.secondary",
                    }}
                  >
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{vendor.location}</Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {vendor.description}
                  </Typography>

                  <Button
                    component={RouterLink}
                    to={`/vendors/${vendor.id}`}
                    variant="outlined"
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                No vendors found matching your criteria
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {filteredVendors.length > vendorsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredVendors.length / vendorsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default VendorsPage;
