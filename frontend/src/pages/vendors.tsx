import { useState, useEffect } from "react";
import { Container, Text, Stack, Box, Button, Field, Input, Card, HStack, Spinner, Center } from "@chakra-ui/react";
import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import ApplicantCard, { type Applicant } from "@/components/applicant-card";
import VendorVenueCard from "@/components/minimal-venue-card";
import { Venue } from "@/components/venue-card";
import { TiStar } from "react-icons/ti";
import { useAuth } from "@/context/AuthContext";

export default function VendorsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const { currentUser } = useAuth();
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [venuesLoading, setVenuesLoading] = useState(true);

  // new venue form state
  const [newName, setNewName] = useState("");
  const [newEventType, setNewEventType] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newImageFile, setNewImageFile] = useState<string | null>(null);
  const [newImageFileName, setNewImageFileName] = useState<string>("");
  const [newSuitableEvents, setNewSuitableEvents] = useState("");

  //blocktime
  const [blockDate, setBlockDate] = useState("");
  const [blockTime, setBlockTime] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleNewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setNewImageFile(base64);
      setNewImageFileName(file.name);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3001/api/venues/vendor/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          setVenues(data);
          setVenuesLoading(false); 
        })
        .catch(err => {
          console.error(err);
          setVenuesLoading(false);
        });
    }
  }, [currentUser]);

  const handleToggleVenue = (venueName: string, venueId: number) => {
    if (selectedVenue === venueName) {
      setSelectedVenue(null);
      setApplicants([]);
    } else {
      setSelectedVenue(venueName);
      console.log("Setting loading to true");
      setApplicantsLoading(true);
      fetch(`http://localhost:3001/api/bookings/venue/${venueId}`)
        .then(res => res.json())
        .then(data => {
          const mapped = data.map((booking: any) => ({
            id: booking.id,
            hirerId: booking.hirer?.id,
            venueId: venueId,
            name: `${booking.hirer?.firstName} ${booking.hirer?.lastName}`,
            email: booking.hirer?.email || "",
            venueName: venueName,
            eventType: booking.eventName,
            eventDate: booking.date,
            guestCount: Number(booking.expectedGuests),
            venueRequirements: booking.eventName,
            previousHires: "",
            documentName: "",
            selected: booking.bookingStatus === "accepted",
            approved: booking.bookingStatus === "approved",
            rejected: booking.bookingStatus === "rejected",
            comments: booking.comments || [],
            totalStars: booking.hirer?.totalStars || 0,
            ratingCount: booking.hirer?.reviewCount || 0,
            complianceScore: booking.hirer?.complianceScore || 0,
            driversLicense: booking.hirer?.driversLicense || null,
            publicLiabilityInsurance: booking.hirer?.publicLiabilityInsurance || null,
            businessRegistration: booking.hirer?.businessRegistration || null,
            isBusinessApplication: booking.hirer?.isBusinessApplication || false,
            abnNumber: booking.hirer?.abnNumber || null,
          }));
          setApplicants(mapped);
          setApplicantsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setApplicantsLoading(false);
        });
    }
};

  // CREATE venue
  const handleAddVenue = async () => {
    if (!newName || !newEventType || !newLocation) {
      alert("Name, event type and location are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: currentUser?.id,
          name: newName,
          eventType: newEventType,
          location: newLocation,
          imageUrl: newImageFile || "",
          suitableEvents: newSuitableEvents.split(",").map((e) => e.trim()),
        })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create venue");
        return;
      }

      const updatedRes = await fetch(`http://localhost:3001/api/venues/vendor/${currentUser?.id}`);
      const updatedData = await updatedRes.json();
      setVenues(updatedData);

      // reset form
      setNewName("");
      setNewEventType("");
      setNewLocation("");
      setNewImageFile(null);
      setNewImageFileName("");
      setNewSuitableEvents("");
      setShowAddVenue(false);
      alert("Venue created successfully!");
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // UPDATE venue
  const handleUpdateVenue = async (updatedVenue: Venue) => {
    try {
      const res = await fetch(`http://localhost:3001/api/venues/${updatedVenue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: currentUser?.id,
          name: updatedVenue.name,
          eventType: updatedVenue.eventType,
          location: updatedVenue.location,
          imageUrl: updatedVenue.imageUrl,
          suitableEvents: updatedVenue.suitableEvents,
        })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update venue");
        return;
      }

      setVenues((prev) => prev.map((v) => v.id === updatedVenue.id ? updatedVenue : v));
      alert("Venue updated successfully!");
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  // DELETE venue
  const handleDeleteVenue = async (venueId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/venues/${venueId}?vendorId=${currentUser?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete venue");
        return;
      }

      setVenues((prev) => prev.filter((v) => v.id !== venueId));

      if (selectedVenue) {
        setSelectedVenue(null);
        setApplicants([]);
      }

      alert("Venue deleted successfully!");
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  const sortByHighestRating = () => {
    const sorted = [...applicants].sort((a, b) => {
      const avgA = a.ratingCount ? a.totalStars / a.ratingCount : 0;
      const avgB = b.ratingCount ? b.totalStars / b.ratingCount : 0;
      return avgB - avgA;
    });
    setApplicants(sorted);
    alert("Applicants have been sorted!");
  };

  const handleUpdate = async (updatedApplicant: Applicant) => {
    await fetch(`http://localhost:3001/api/bookings/${updatedApplicant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedApplicant)
    });

    setApplicants((prev) => prev.map((app) =>
      app.id === updatedApplicant.id ? updatedApplicant : app
    ));
  };

  const handleBlockTimeslot = async (
    venueId: number,
    date: string,
    startTime: string,
    endTime: string
  ) => {

    if (!date || !startTime || !endTime) {
      alert("Please enter a date and time range");
      return;
    }

    const res = await fetch(
      "http://localhost:3001/api/venues/block",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          venueId,
          date,
          startTime,
          endTime
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    const updatedRes = await fetch(
      `http://localhost:3001/api/venues/vendor/${currentUser?.id}`
    );

    const updatedData = await updatedRes.json();

    setVenues(updatedData);

    alert("Timeslot successfully blocked");
  };

  const handleUnblockTimeslot = async (
    venueId: number,
    slotId: number
  ) => {

    console.log("Sending venueId:", venueId);

    const res = await fetch(
      "http://localhost:3001/api/venues/unblock",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          venueId,
          slotId
        })
      }
    );

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed");
      return;
    }

    const updatedRes = await fetch(
      `http://localhost:3001/api/venues/vendor/${currentUser?.id}`
    );

    const updatedData = await updatedRes.json();

    setVenues(updatedData);

    alert("Timeslot successfully unblocked");
  };

  return (
    <div className="vendorsPage min-h-screen flex flex-col">
      <HeaderContainer />
      <div className="mainContent flex flex-1 flex-col items-center pt-12">
        <Container maxW="container.lg">
          <Text textStyle="6xl" textAlign="center" mb={8}>
            My Venues
          </Text>

          {/* Add venue button */}
          <Box mb={6} display="flex" justifyContent="flex-end">
            <Button
              colorPalette="green"
              onClick={() => setShowAddVenue(!showAddVenue)}
            >
              {showAddVenue ? "Cancel" : "+ Add New Venue"}
            </Button>
          </Box>

          {/* Add venue form */}
          {showAddVenue && (
            <Card.Root w="full" maxW="2xl" mx="auto" mb={6}>
              <Card.Body>
                <Stack gap={3}>
                  <Text fontWeight="bold" fontSize="lg">Add New Venue</Text>

                  <Field.Root>
                    <Field.Label>Venue Name</Field.Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Melbourne Hall"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Event Type</Field.Label>
                    <Input
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value)}
                      placeholder="e.g. Indoor Hall"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Location</Field.Label>
                    <Input
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. 90/130 Swanston Street"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Suitable Events (comma separated)</Field.Label>
                    <Input
                      value={newSuitableEvents}
                      onChange={(e) => setNewSuitableEvents(e.target.value)}
                      placeholder="Wedding, Conference, Birthday Party"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Venue Image</Field.Label>
                    <input
                      id="venueImageUpload"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleNewImageUpload}
                      style={{ display: "none" }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("venueImageUpload")?.click()}
                    >
                      Choose Image
                    </Button>
                    {newImageFileName && (
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        {newImageFileName}
                      </Text>
                    )}
                    {newImageFile && (
                      <img
                        src={newImageFile}
                        alt="venue preview"
                        style={{ width: "200px", height: "100px", objectFit: "cover", marginTop: "8px", borderRadius: "4px" }}
                      />
                    )}
                  </Field.Root>

                  <Button colorPalette="green" onClick={handleAddVenue}>
                    Create Venue
                  </Button>
                </Stack>
              </Card.Body>
            </Card.Root>
          )}

          {/* Venue list */}
          {venuesLoading ? (
            <Center mt={8} flexDirection="column" gap={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color="gray.500">Loading venues...</Text>
            </Center>
          ) : venues.length === 0 ? (
            <Text textAlign="center" color="gray.500">
                No venues yet — add one above!
            </Text>
          ) : (
            <Stack gap={4}>
                {venues.map((venue, index) => (
                  <Box key={index}>
                    <VendorVenueCard
                      venue={venue}
                      isSelected={selectedVenue === venue.name}
                      onToggle={() => handleToggleVenue(venue.name, venue.id)}
                      onDelete={handleDeleteVenue}
                      onUpdate={handleUpdateVenue}
                      onBlockTimeslot={handleBlockTimeslot}
                      onUnblockTimeslot={handleUnblockTimeslot}
                    />

                    {selectedVenue === venue.name && (
                      <Box mt={4} ml={8}>
                          <Button size="sm" mb={3} onClick={sortByHighestRating}>
                              Sort by Reputation Rating (<TiStar />)
                          </Button>

                          {applicantsLoading ? (
                              <Center mt={4} flexDirection="column" gap={4}>
                                  <Spinner size="xl" color="blue.500" />
                                  <Text color="gray.500">Loading applications...</Text>
                              </Center>
                          ) : applicants.length > 0 ? (
                              <Stack gap={4}>
                                  {applicants.map((applicant) => (
                                      <ApplicantCard
                                          key={applicant.id}
                                          applicant={applicant}
                                          onUpdate={handleUpdate}
                                      />
                                  ))}
                              </Stack>
                          ) : (
                              <Text color="gray.500" p={4}>
                                  No applications for this venue yet
                              </Text>
                          )}
                      </Box>
                    )}
                  </Box>
                ))}
            </Stack>
          )}

        </Container>
      </div>
      <FooterContainer />
    </div>
  );
}