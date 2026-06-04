import { useState, useEffect } from "react";
import { Container, Text, Stack, Box } from "@chakra-ui/react";
import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import ApplicantCard, { type Applicant } from "@/components/applicant-card";
import VendorVenueCard from "@/components/minimal-venue-card";
import { Venue } from "@/components/venue-card";
import hallImage from "../../public/melbhall.png";
import { HStack, Button } from "@chakra-ui/react"
import { TiStar } from "react-icons/ti";
import { useAuth } from "@/context/AuthContext";

export default function VendorsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => { 
    //getting venues
    if (currentUser) {
      fetch(`http://localhost:3001/api/venues/vendor/${currentUser.id}`)
        .then(res => res.json())
        .then(data => setVenues(data))
        .catch(console.error);
    }
  }, [currentUser]);

  const handleToggleVenue = (venueName: string, venueId: number) => {
    //getting bookings
    if (selectedVenue === venueName) {
      setSelectedVenue(null); // close if already open
      setApplicants([]); // clear applicants when closing venue
    } else {
      setSelectedVenue(venueName);
      //get bookings
      fetch(`http://localhost:3001/api/bookings/venue/${venueId}`)
        .then(res => res.json())
        .then(data => setApplicants(data))
        .catch(console.error);
    }
  };

  const sortByHighestRating = () => {
      const sorted = [...applicants].sort((a, b) => {
        const avgA = a.ratingCount ? a.totalStars / a.ratingCount : 0;
        const avgB = b.ratingCount ? b.totalStars / b.ratingCount : 0;
        return avgB - avgA;
      });

      setApplicants(sorted);
      alert("Applicants have been sorted!")
    };

  //updating application
  const handleUpdate = async (updatedApplicant: Applicant) => {
    await fetch(`http://localhost:3001/api/bookings/${updatedApplicant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedApplicant)
    });

    setApplicants((prev) => prev.map((app) => app.id === updatedApplicant.id ? updatedApplicant : app));
  };

  // filter applicants by selected venue
  const filteredApplicants = selectedVenue
    ? applicants.filter((app) => app.venueName === selectedVenue)
    : [];

  return (
    <div className="vendorsPage min-h-screen flex flex-col">
      <HeaderContainer />
      <div className="mainContent flex flex-1 flex-col items-center pt-12">
        <Container maxW="container.lg">
          <Text textStyle="6xl" textAlign="center" mb={8}>
            My Venues
          </Text>

          <Stack gap={4}>
            {venues.map((venue, index) => (
              <Box key={index}>
                <VendorVenueCard
                  venue={venue}
                  isSelected={selectedVenue === venue.name}
                  onToggle={() => handleToggleVenue(venue.name, venue.id)}
                />
                
                {/* show applicants when venue is selected */}
                {selectedVenue === venue.name && (
                  <Box mt={4} ml={8}>
                    <Button size="sm" mb={3} onClick={sortByHighestRating}>
                      Sort by Reputation Rating (<TiStar />)
                    </Button>
                    {filteredApplicants.length > 0 ? (
                      <Stack gap={4}>
                        {filteredApplicants.map((applicant) => (
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
        </Container>
      </div>
      <FooterContainer />
    </div>
  );
}