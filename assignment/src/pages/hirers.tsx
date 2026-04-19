import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import {
    Container, 
    Center, 
    Stack, 
    Text,
    HStack, 
} from "@chakra-ui/react"
import { useState } from "react";
import Modal from "@/components/modal";
import placeholderImage from "../../public/placeholder_venue_image.png"
import VenueCard , { Venue } from "@/components/venue-card";
import ReputationCard, { VenueReputation } from "@/components/hirer-reputation-card";
import SearchBar from "@/components/search-bar";
import HirerProfileCard from "@/components/hirer-profile-update";

const initialVenues: Venue[] = [
    {
        name: "Melbourne Town Hall",
        expectedguests: 200,
        date: "17/04/2026",
        time: "20:00",
        duration: 2,
        image: placeholderImage,
        type: "Event Space",
        suitableEvents: ["Wedding Reception", "Conference", "Birthday Party"],
        location: "Melbourne"
    }, 
    {
        name: "Sydney Opera House",
        expectedguests: 500,
        date: "18/04/2026",
        time: "19:00",
        duration: 3,
        image: placeholderImage,
        type: "Performing Arts Centre",
        suitableEvents: ["Concert", "Theater", "Dance Performance"],
        location: "Sydney"
    },
    {
        name: "Brisbane Convention Centre",
        expectedguests: 1000,
        date: "19/04/2026",
        time: "18:00",
        duration: 4,
        image: placeholderImage,
        type: "Convention Centre",
        suitableEvents: ["Conference", "Exhibition", "Trade Show", "Birthday Party"],
        location: "Brisbane"
    }
];

const initialReputation: VenueReputation[] = [
    {
        name: "Melbourne Town Hall",
        location: "Melbourne",
        eventName: "Wedding Reception",
        dateOfHire: "17/04/2025",
        rating: 4
    },
    {
        name: "Sydney Opera House",
        location: "Sydney",
        eventName: "Concert",
        dateOfHire: "18/04/2025",
        rating: 5
    },
    {
        name: "Brisbane Convention Centre",
        location: "Brisbane",
        eventName: "Birthday Party",
        dateOfHire: "19/04/2025",
        rating: 3
    }
];

export default function HirerPage() {
    const [venues, setVenues] = useState<Venue[]>(initialVenues);
    const [venueRep, setVenueRep] = useState<VenueReputation[]>(initialReputation);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDomain, setSearchDomain] = useState("Name");

    const filteredVenues = venues.filter((venue) => {
        const query = searchQuery.toLowerCase();
            if (searchDomain == "Name") {
                console.log("Checking name for query:", query);
                return venue.name.toLowerCase().includes(query);
            } else if (searchDomain == "Location") {
                console.log("Checking location for query:", query);
                return venue.location?.toLowerCase().includes(query);
            } else if (searchDomain == "Capacity") {
                console.log("Checking capacity for query:", query);
                const capacityQuery = parseInt(query);
                return venue.expectedguests >= capacityQuery;
            } else if (searchDomain == "Type") {
                console.log("Checking type for query:", query);
                return venue.type?.toLowerCase().includes(query);
            } else if (searchDomain == "Suitable Events") {
                console.log("Checking suitable events for query:", query);
                return venue.suitableEvents?.some(event => event.toLowerCase().includes(query));
            } else {
                return false;
            }
        }
    );

    return (
        <div className="hirersPage min-h-screen flex flex-col">
            <HeaderContainer/>
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                {/* Start of hirer profile */}
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Your Profile </Text>
                    <Stack gap={2}>
                        <Center>
                            <HirerProfileCard/>
                        </Center>
                        <Center>
                            <HStack>
                            {/* Hirer Reputation Modal */}
                            <Modal
                                triggerLabel="Reputation"
                                title="Your Hirer's Reputation"
                                body={
                                    <Stack gap={4}>
                                    <>                        
                                        {venueRep.map((reputation, index) => (
                                            <ReputationCard key={index} reputation={reputation} />
                                        ))}
                                    </>
                                    </Stack>
                                }
                                hideConfirm={true}
                                cancelLabel="Close"
                            />
                            {/* Preferred Venues Modal */}
                            <Modal
                                triggerLabel="Preferred Venues"
                                title="Your Preferred Venues"
                                body={
                                    <Stack gap={4}>
                                    <>                        
                                        {venues.map((venue, index) => (
                                            <VenueCard key={index} venue={venue} index={index} venues={venues} />
                                        ))}
                                    </>
                                    </Stack>
                                }
                                hideConfirm={true}
                                cancelLabel="Close"
                            />
                            </HStack>
                        </Center>
                    </Stack>
                </Container>
                
                {/* Start of venues list */}
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Venues </Text>
                    <SearchBar 
                        placeholder="Search for venues..." 
                        onSearch={(query) => setSearchQuery(query)} 
                        onDomainChange={(domain) => setSearchDomain(domain)} 
                        hasDomain={true}/>
                    <Stack mt={6} gap={4}>
                        {filteredVenues.length > 0 ? (
                            filteredVenues.map((venue, index) => (
                                <VenueCard key={index} venue={venue} index={index} venues={venues}/>
                            ))
                        ) : (
                            <Text textAlign="center">No venues found.</Text>
                        )}
                    </Stack>
                </Container>
            </div>
            <FooterContainer/>
        </div>
    );
}