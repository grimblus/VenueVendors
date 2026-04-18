import { useState, useEffect } from "react";
import { Container, Text, Stack } from "@chakra-ui/react";
import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import ApplicantCard from "@/components/applicant-card";
import Applicant from "@/components/applicant-card";


//initialising dummy data
const initialApplicants: Applicant[] = [
  {
    id: "1",
    email: "sarah.jones@example.com",
    name: "Sarah Jones",
    eventType: "Corporate Event",
    eventDate: "15/06/2026",
    guestCount: 150,
    venueRequirements: "Large conference room with AV equipment, catering facilities, parking for 100 vehicles",
    previousHires: "Successfully organized 5 corporate events in the past 2 years including annual conferences and team building events. All events received positive feedback.",
    documentName: "Public Liability Insurance - Valid until Dec 2026",
    selected: false,
    approved: false,
    rejected: false,
    comments: [],
  },
  {
    id: "2",
    email: "michael.tan@example.com",
    name: "Michael Tan",
    eventType: "Wedding Reception",
    eventDate: "22/08/2026",
    guestCount: 120,
    venueRequirements: "Elegant ballroom with outdoor garden area, full catering kitchen, accommodation for bridal party",
    previousHires: "First time organizing a major event. Have reference letters from 2 previous small family gatherings at hired venues.",
    documentName: "Event Permit & Insurance Certificate - Valid",
    selected: false,
    approved: false,
    rejected: false,
    comments: [],
  },
  {
    id: "3",
    email: "emma.wilson@example.com",
    name: "Emma Wilson",
    eventType: "Birthday Party",
    eventDate: "10/05/2026",
    guestCount: 80,
    venueRequirements: "Indoor/outdoor space with entertainment area, sound system, bar facilities",
    previousHires: "Organized 3 birthday celebrations and 1 anniversary party in past year. All venues reported no issues and would recommend as a hirer.",
    documentName: "Public Liability Insurance & ID Verification",
    selected: false,
    approved: false,
    rejected:false,
    comments: [],
  },
];

export default function VendorsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    const storedApplicants = localStorage.getItem("applicants");
    if (storedApplicants) {
      setApplicants(JSON.parse(storedApplicants));
    } else {
      setApplicants(initialApplicants);
      localStorage.setItem("applicants", JSON.stringify(initialApplicants));
    }
  }, []);

  const handleUpdate = (updatedApplicant: Applicant) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === updatedApplicant.id ? updatedApplicant : app
    );
    setApplicants(updatedApplicants);
    localStorage.setItem("applicants", JSON.stringify(updatedApplicants));
  };

  return (
    <div className="vendorsPage min-h-screen flex flex-col">
      <HeaderContainer />
      <div className="mainContent flex flex-1 flex-col items-center pt-12">
        <Container maxW="container.lg">
          <Text textStyle="6xl" textAlign="center" mb={8}>
            Applicant Management
          </Text>
          <Stack gap={4}>
            {applicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onUpdate={handleUpdate}
              />
            ))}
          </Stack>
        </Container>
      </div>
      <FooterContainer />
    </div>
  );
}