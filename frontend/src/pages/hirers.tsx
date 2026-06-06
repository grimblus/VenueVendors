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
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function HirerPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    // const [venueRep, setVenueRep] = useState<VenueReputation[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDomain, setSearchDomain] = useState("Name");
    const [preferredVenues, setPreferredVenues] = useState<Venue[]>([]);
    const [userRep, setUserRep] = useState<{ totalStars: number; reviewCount: number }>({ totalStars: 0, reviewCount: 0 });
    const { currentUser } = useAuth();

    const venueRep = currentUser ? {
        totalStars: currentUser.totalStars || 0,
        reviewCount: currentUser.reviewCount || 0
    } : null;

    useEffect(() => {
        // fetch venues
        fetch("http://localhost:3001/api/venues")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch venues");
                return res.json();
            })
            .then(data => setVenues(data))
            .catch(console.error);

        if (currentUser) {
            // fetch preferred venues
            fetch(`http://localhost:3001/api/preferred-venues/${currentUser.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch preferred venues");
                    return res.json();
                })
                .then(data => setPreferredVenues(data))
                .catch(console.error);
        }

        if (currentUser) {
            // fetch user rep
            fetch(`http://localhost:3001/api/users/profile/${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    setUserRep({
                        totalStars: data.totalStars || 0,
                        reviewCount: data.reviewCount || 0
                    });
                })
                .catch(console.error);
        }
    }, [currentUser]);
    
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
                return venue.expectedGuests >= capacityQuery;
            } else if (searchDomain == "Type") {
                console.log("Checking type for query:", query);
                return venue.eventType?.toLowerCase().includes(query);
            } else if (searchDomain == "Suitable Events") {
                console.log("Checking suitable events for query:", query);
                return venue.suitableEvents?.some(event => event.toLowerCase().includes(query));
            } else {
                return false;
            }
        }
    );

    const handleAddPreference = async (venue: Venue, rank: number) => {
        await fetch("http://localhost:3001/api/preferred-venues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hirerId: currentUser?.id,
                venueId: venue.id,
                rank
            })
        });

        const res = await fetch(`http://localhost:3001/api/preferred-venues/${currentUser?.id}`);
        const data = await res.json();
        setPreferredVenues(data);
    };


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
                                        {userRep ? (
                                            <ReputationCard reputation={userRep} />
                                        ) : (
                                            <Text>No reputation data yet</Text>
                                        )}
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
                                        {preferredVenues.map((venue, index) => (
                                            <VenueCard 
                                                key={index} 
                                                venue={venue} 
                                                index={index} 
                                                venues={venues} 
                                                preferredVenues={preferredVenues} 
                                                onPreferenceChange={(rank) => handleAddPreference(venue, rank)} />
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
                    <Center mt={4}>
                        Currently searching for: {searchQuery} in: {searchDomain}
                    </Center>                        
                    <Stack mt={6} gap={4}>
                        {filteredVenues.length > 0 ? (
                            filteredVenues.map((venue, index) => (
                                <VenueCard 
                                    key={index} 
                                    venue={venue} 
                                    index={index} 
                                    venues={venues}
                                    preferredVenues={preferredVenues} 
                                    onPreferenceChange={(rank) => handleAddPreference(venue, rank)}/>
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