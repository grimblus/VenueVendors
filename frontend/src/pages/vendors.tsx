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


//initialising dummy data for venues
const initialVenues: Venue[] = [
  {
    name: "Melbourne Hall",
    expectedguests: 200,
    date: "17/04/2026",
    time: "20:00",
    duration: 2,
    image: hallImage
  }
];

//initialising dummy data for applications
const initialApplicants: Applicant[] = [
  {
    id: "1",
    email: "sarah.jones@example.com",
    name: "Sarah Jones",
    venueName: "Melbourne Hall",
    eventType: "Corporate Event",
    eventDate: "15/06/2026",
    guestCount: 150,
    venueRequirements: "Large conference room with AV equipment, catering facilities, parking for 100 vehicles",
    previousHires: "Avondale Acoustic's Centre, Hamer Hall",
    documentName: "Public Liability Insurance - Valid until Dec 2026",
    selected: false,
    approved: false,
    rejected: false,
    comments: [],
    totalStars: 0,
    ratingCount: 0,
  },
  {
    id: "2",
    email: "michael.tan@example.com",
    name: "Michael Tan",
    venueName: "Melbourne Hall",
    eventType: "Wedding Reception",
    eventDate: "22/08/2026",
    guestCount: 120,
    venueRequirements: "Elegant ballroom with outdoor garden area, full catering kitchen, accommodation for bridal party",
    previousHires: "The Comic's Lounge, Crown Expo Building",
    documentName: "Event Permit & Insurance Certificate - Valid",
    selected: false,
    approved: false,
    rejected: false,
    comments: [],
    totalStars: 0,
    ratingCount: 0,
  },
  {
    id: "3",
    email: "emma.wilson@example.com",
    name: "Emma Wilson",
    venueName: "Melbourne Hall",
    eventType: "Birthday Party",
    eventDate: "10/05/2026",
    guestCount: 80,
    venueRequirements: "Indoor/outdoor space with entertainment area, sound system, bar facilities",
    previousHires: "Sydney Lighthouse, The Ritz",
    documentName: "Public Liability Insurance & ID Verification",
    selected: false,
    approved: false,
    rejected: false,
    comments: [],
    totalStars: 0,
    ratingCount: 0,
  },
];

export default function VendorsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);

  //getting applicants from localStorage
  useEffect(() => { 
    const storedApplicants = localStorage.getItem("applicants");
    if (storedApplicants) {
      setApplicants(JSON.parse(storedApplicants));
    } else {
      setApplicants(initialApplicants);
      localStorage.setItem("applicants", JSON.stringify(initialApplicants));
    }

    //getting venues from localStorage
    const storedVenues = localStorage.getItem("venues");
    if (storedVenues) {
      setVenues(JSON.parse(storedVenues));
    } else {
      setVenues(initialVenues);
      localStorage.setItem("venues", JSON.stringify(initialVenues));
    }
  }, []);


  const sortByHighestRating = () => {
      const sorted = [...applicants].sort((a, b) => {
        const avgA = a.ratingCount ? a.totalStars / a.ratingCount : 0;
        const avgB = b.ratingCount ? b.totalStars / b.ratingCount : 0;
        return avgB - avgA;
      });

      setApplicants(sorted);
      localStorage.setItem("applicants", JSON.stringify(sorted));
      alert("Applicants have been sorted!")
    };

  //updating application
  const handleUpdate = (updatedApplicant: Applicant) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === updatedApplicant.id ? updatedApplicant : app
    );
    setApplicants(updatedApplicants);
    localStorage.setItem("applicants", JSON.stringify(updatedApplicants));
  };

  //boolean for toggling if venue is selected or not
  const handleToggleVenue = (venueName: string) => {
    if (selectedVenue === venueName) {
      setSelectedVenue(null); // close if already open
    } else {
      setSelectedVenue(venueName); // open this venue
    }
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
                  onToggle={() => handleToggleVenue(venue.name)}
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