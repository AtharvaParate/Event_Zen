import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import EventForm from "../components/events/EventForm";
import Loading from "../components/common/Loading";
import { fetchEvent } from "../store/eventSlice";
import EditIcon from "@mui/icons-material/Edit";

const EditEventPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  if (loading) {
    return <Loading message="Loading event details..." />;
  }

  if (error) {
    return (
      <Container>
        <div>Error loading event: {error}</div>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <div>Event not found</div>
        <button onClick={() => navigate("/events")}>Browse Events</button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <PageHeader
        title={`Edit: ${event.title}`}
        subtitle="Update your event details"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Events", link: "/dashboard" },
          { label: "Edit Event" },
        ]}
        actionIcon={<EditIcon />}
      />

      <EventForm event={event} />
    </Container>
  );
};

export default EditEventPage;
