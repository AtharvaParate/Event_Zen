import React from "react";
import { Container } from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import EventForm from "../components/events/EventForm";
import AddIcon from "@mui/icons-material/Add";

const CreateEventPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <PageHeader
        title="Create New Event"
        subtitle="Fill in the details to create your event"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Create Event" },
        ]}
        actionIcon={<AddIcon />}
      />

      <EventForm />
    </Container>
  );
};

export default CreateEventPage;
