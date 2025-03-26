import React from "react";
import PageHeader from "../components/common/PageHeader";
import EventForm from "../components/events/EventForm";
import AddIcon from "@mui/icons-material/Add";
import PageContainer from "../components/common/PageContainer";

const CreateEventPage = () => {
  return (
    <PageContainer>
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
    </PageContainer>
  );
};

export default CreateEventPage;
