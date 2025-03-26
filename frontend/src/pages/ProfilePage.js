import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Switch,
  FormControlLabel,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Person as PersonIcon,
  Event as EventIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  // eslint-disable-next-line no-unused-vars
} from "@mui/icons-material";
// eslint-disable-next-line no-unused-vars
import { getImageUrl, getFallbackImage } from "../utils/imageUtils";
import { updateUserProfile } from "../store/authSlice"; // Import the action
import { SafeSlide } from "../components/common/SafeTransition";
import PageContainer from "../components/common/PageContainer";

// Custom transition component to prevent scrollTop errors
const Transition = React.forwardRef(function Transition(props, ref) {
  return <SafeSlide direction="up" ref={ref} {...props} />;
});

// Mock update user function (would come from Redux in real app)
const updateUser = (userData) => {
  console.log("Updating user profile:", userData);
  // This would make an API call in a real application
  return Promise.resolve({ success: true });
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Check if we should switch to a specific tab from local storage
  const savedTabIndex = localStorage.getItem("profileTabIndex");
  const [tabValue, setTabValue] = useState(
    savedTabIndex ? parseInt(savedTabIndex) : 0
  );

  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Create a local copy of user data for editing
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: user?.bio || "I love attending events and meeting new people!",
    phone: user?.phone || "",
    location: user?.location || "",
    profileImage: user?.profileImage || null,
  });

  // Form handling for security tab
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    eventReminders: true,
    marketingEmails: false,
  });

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "event_registered",
      title: "Registered for Tech Conference 2025",
      date: new Date(2024, 5, 15),
      icon: <EventIcon />,
    },
    {
      id: 2,
      type: "profile_updated",
      title: "Updated profile information",
      date: new Date(2024, 5, 10),
      icon: <PersonIcon />,
    },
    {
      id: 3,
      type: "event_reviewed",
      title: "Left a review for Music Festival",
      date: new Date(2024, 5, 5),
      icon: <EventIcon />,
    },
  ];

  // Clear the saved tab index from local storage when component loads
  useEffect(() => {
    if (savedTabIndex) {
      localStorage.removeItem("profileTabIndex");
    }
  }, [savedTabIndex]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSecurityInputChange = (e) => {
    const { name, value } = e.target;
    setSecurityData({
      ...securityData,
      [name]: value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs({
      ...notificationPrefs,
      [name]: checked,
    });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    // If canceling edit, reset form data
    if (editMode) {
      setUserData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        bio: user?.bio || "I love attending events and meeting new people!",
        phone: user?.phone || "",
        location: user?.location || "",
        profileImage: user?.profileImage || null,
      });
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setUserData({
          ...userData,
          profileImage: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, this would dispatch to Redux
      const result = await updateUser(userData);

      if (result.success) {
        // Update the Redux store with the new user data
        dispatch(
          updateUserProfile({
            ...user,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            bio: userData.bio,
            phone: userData.phone,
            location: userData.location,
            profileImage: userData.profileImage,
          })
        );

        setSuccessMessage("Profile updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        setEditMode(false);
      }
    } catch (error) {
      setErrorMessage("Failed to update profile: " + error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setErrorMessage("New passwords do not match");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    try {
      // Mock API call
      console.log("Changing password", securityData);
      setSuccessMessage("Password changed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Reset form
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setErrorMessage("Failed to change password: " + error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would dispatch to Redux
    console.log("Deleting account...");
    setDeleteDialogOpen(false);

    // Mock successful delete
    setSuccessMessage("Account deleted successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <PageContainer>
      {/* Main content grid */}
      <Grid container spacing={4}>
        {/* Sidebar with user info */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Profile Image */}
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={
                    userData.profileImage ||
                    `${process.env.PUBLIC_URL}/images/profiles/${
                      user?.profileImage || "default-avatar.jpg"
                    }`
                  }
                  onError={(e) => {
                    console.log("Profile image load error, using fallback");
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = `${process.env.PUBLIC_URL}/images/defaults/profile-default.jpg`;
                  }}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                {editMode && (
                  <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleProfileImageChange}
                    />
                    <label htmlFor="profile-image-upload">
                      <IconButton
                        component="span"
                        color="primary"
                        sx={{
                          bgcolor: "background.paper",
                          "&:hover": { bgcolor: "background.default" },
                        }}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                  </Box>
                )}
              </Box>

              <Typography variant="h5" component="h1">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Member since{" "}
                {formatDate(new Date(user?.createdAt || Date.now()))}
              </Typography>

              {/* Quick stats */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6">0</Typography>
                    <Typography variant="body2">Events Created</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6">2</Typography>
                    <Typography variant="body2">Events Attended</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 2, bgcolor: "primary.light" }}>
              <Typography variant="h6">Recent Activity</Typography>
            </Box>
            <List>
              {recentActivity.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.light" }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={formatDate(activity.date)}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main content area */}
        <Grid item xs={12} md={8} lg={9}>
          {/* Success/Error messages */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Tabs and content */}
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Personal Info" icon={<PersonIcon />} />
              <Tab label="Security" icon={<SecurityIcon />} />
              <Tab label="Notifications" icon={<NotificationsIcon />} />
            </Tabs>

            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" component="h2">
                    Personal Information
                  </Typography>
                  <Button
                    variant="outlined"
                    color={editMode ? "error" : "primary"}
                    startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                    onClick={handleEditToggle}
                  >
                    {editMode ? "Cancel" : "Edit Profile"}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  {/* Form Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={!editMode}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={!editMode}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={!editMode}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Location"
                      name="location"
                      value={userData.location}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Bio"
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={4}
                      disabled={!editMode}
                    />
                  </Grid>

                  {/* Save Button */}
                  {editMode && (
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                        fullWidth
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                  Security Settings
                </Typography>

                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Change Password
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value={securityData.currentPassword}
                          onChange={handleSecurityInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="New Password"
                          name="newPassword"
                          type="password"
                          value={securityData.newPassword}
                          onChange={handleSecurityInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityInputChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleChangePassword}
                        >
                          Update Password
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                      Delete Account
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteAccount}
                    >
                      Delete My Account
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                  Notification Preferences
                </Typography>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive notifications about your events via email"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationPrefs.emailNotifications}
                          onChange={handleNotificationChange}
                          name="emailNotifications"
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Event Reminders"
                      secondary="Get reminders before events you're attending"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationPrefs.eventReminders}
                          onChange={handleNotificationChange}
                          name="eventReminders"
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Marketing Emails"
                      secondary="Receive promotional emails about events and offers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationPrefs.marketingEmails}
                          onChange={handleNotificationChange}
                          name="marketingEmails"
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSuccessMessage("Notification preferences saved");
                      setTimeout(() => setSuccessMessage(""), 3000);
                    }}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        TransitionComponent={Transition}
        disableScrollLock
      >
        <DialogTitle id="delete-dialog-title" color="error">
          Delete Your Account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            This action cannot be undone. All of your data, including events
            you've created and registrations, will be permanently deleted. Are
            you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ProfilePage;
