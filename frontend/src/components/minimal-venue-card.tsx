import { Card, HStack, Text, Button, Field, Input, Stack } from "@chakra-ui/react";
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
  const [editImageFile, setEditImageFile] = useState<string | null>(null);
  const [editImageFileName, setEditImageFileName] = useState<string>("");
  const [editSuitableEvents, setEditSuitableEvents] = useState(
    venue.suitableEvents?.join(", ") || ""
  );

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setEditImageFile(base64);
      setEditImageFileName(file.name);
    }
  };

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
      imageUrl: editImageFile || venue.imageUrl,
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
              <Field.Label>Venue Image</Field.Label>
              <input
                id="editVenueImageUpload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("editVenueImageUpload")?.click()}
              >
                Choose Image
              </Button>
              {editImageFileName && (
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {editImageFileName}
                </Text>
              )}
              {(editImageFile || venue.imageUrl) && (
                <img
                  src={editImageFile || venue.imageUrl as string}
                  alt="venue preview"
                  style={{ width: "200px", height: "100px", objectFit: "cover", marginTop: "8px", borderRadius: "4px" }}
                />
              )}
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