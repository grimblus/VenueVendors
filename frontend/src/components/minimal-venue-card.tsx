import { Card, HStack, Text, Button, Box, Field, Input, Stack } from "@chakra-ui/react";
import { type Venue } from "@/components/venue-card";
import { useState } from "react";

export interface VendorVenueCardProps {
  venue: Venue;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: (venueId: number) => void;
  onUpdate: (updatedVenue: Venue) => void;
}

export default function VendorVenueCard(props: VendorVenueCardProps) {
  const venue = props.venue;
  const isSelected = props.isSelected;
  const onToggle = props.onToggle;
  const onDelete = props.onDelete;
  const onUpdate = props.onUpdate;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(venue.name);
  const [editEventType, setEditEventType] = useState(venue.eventType || "");
  const [editLocation, setEditLocation] = useState(venue.location || "");
  const [editImageUrl, setEditImageUrl] = useState(venue.imageUrl || "");
  const [editSuitableEvents, setEditSuitableEvents] = useState(
    venue.suitableEvents?.join(", ") || ""
  );

  const handleSaveEdit = () => {
    if (!editName || !editEventType || !editLocation) {
      alert("Name, event type and location are required");
      return;
    }

    const updatedVenue: Venue = {
      ...venue,
      name: editName,
      eventType: editEventType,
      location: editLocation,
      imageUrl: editImageUrl,
      suitableEvents: editSuitableEvents.split(",").map((e) => e.trim()),
    };

    onUpdate(updatedVenue);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${venue.name}? This will also delete all bookings for this venue.`)) {
      onDelete(venue.id);
    }
  };

  return (
    <Card.Root w="full" maxW="2xl" mx="auto">
      <Card.Body>
        {isEditing ? (
          // EDIT MODE
          <Stack gap={3}>
            <Text fontWeight="bold" fontSize="lg">Editing: {venue.name}</Text>

            <Field.Root>
              <Field.Label>Venue Name</Field.Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Event Type</Field.Label>
              <Input
                value={editEventType}
                onChange={(e) => setEditEventType(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Location</Field.Label>
              <Input
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Suitable Events (comma separated)</Field.Label>
              <Input
                value={editSuitableEvents}
                onChange={(e) => setEditSuitableEvents(e.target.value)}
                placeholder="Wedding, Conference, Birthday Party"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Image URL</Field.Label>
              <Input
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="/melbhall.png"
              />
            </Field.Root>

            <HStack gap={2}>
              <Button colorPalette="green" size="sm" onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </HStack>
          </Stack>
        ) : (
          // VIEW MODE
          <HStack w="100%" justifyContent="space-between">
            <Text textStyle="3xl" fontWeight="semibold">{venue.name}</Text>

            <HStack gap={2}>
              <Button variant="outline" size="sm" onClick={onToggle}>
                {isSelected ? "Hide Applications" : "View Applications"}
              </Button>
              <Button colorPalette="blue" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button colorPalette="red" variant="outline" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </HStack>
          </HStack>
        )}
      </Card.Body>
    </Card.Root>
  );
}