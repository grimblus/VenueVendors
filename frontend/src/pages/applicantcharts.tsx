import HeaderContainer from "@/components/header";
import FooterContainer from "@/components/footer";
import { Container, Text, HStack, Button } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Applicant } from "@/components/applicant-card";
import { useEffect } from "react";
import ApplicantStats from "@/components/applicant-stats";
import VendorCharts from "@/components/vendor-charts";
import { TfiViewListAlt } from "react-icons/tfi";

export default function ApplicantChartsPage() {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const { currentUser } = useAuth();
    const [allHirers, setAllHirers] = useState(false);

     useEffect(() => {
        if (currentUser) {
            const url = allHirers 
                ? "http://localhost:3001/api/bookings/all"
                : `http://localhost:3001/api/bookings/vendor-stats/${currentUser.id}`;            

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const mapped = data.map((booking: any) => ({
                        id: booking.id,
                        hirerId: booking.hirer?.id,
                        name: `${booking.hirer?.firstName} ${booking.hirer?.lastName}`,
                        email: booking.hirer?.email || "",
                        venueName: booking.venue?.name || "",
                        eventType: booking.eventName,
                        eventDate: booking.date,
                        guestCount: Number(booking.expectedGuests) || 0,
                        venueRequirements: booking.eventName,
                        previousHires: "",
                        documentName: "",
                        selected: booking.bookingStatus === "accepted",
                        approved: booking.bookingStatus === "approved",
                        rejected: booking.bookingStatus === "rejected",
                        comments: [],
                        totalStars: booking.hirer?.totalStars || 0,
                        ratingCount: booking.hirer?.reviewCount || 0,
                    }));
                    setApplicants(mapped);
                })
                .catch(console.error);
        }
    }, [currentUser, allHirers]);

    return (
        <div className="vendorsPage min-h-screen flex flex-col">
            <HeaderContainer />
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" mb={8}>
                        Applicant Stats
                    </Text>

                    <HStack gap={2} mb={4}>
                        <Button 
                            size="sm"
                            colorPalette={!allHirers ? "blue" : "gray"}
                            onClick={() => setAllHirers(false)}
                        >
                            My Venues Only
                        </Button>
                        <Button
                            size="sm"
                            colorPalette={allHirers ? "blue" : "gray"}
                            onClick={() => setAllHirers(true)}
                        >
                            All Venues
                        </Button>
                    </HStack>

                    <ApplicantStats applicants={applicants} />
                    {currentUser && <VendorCharts vendorId={currentUser.id}/>}
                </Container>
            </div>
            <FooterContainer />
        </div>
    );
}