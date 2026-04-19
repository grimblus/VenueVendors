import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import { 
    AbsoluteCenter, 
    Container, 
    Box, 
    Button, 
    Center, 
    Field, 
    Fieldset, 
    For, 
    HStack, 
    Input, 
    NativeSelect, 
    Stack, 
    Card, 
    Text, 
    Dialog,
} from "@chakra-ui/react"
import { useState, useEffect, useRef } from "react";
import { User } from "./signin";
import Dropdown from "@/components/dropdown";
import Modal from "@/components/modal";
import placeholderImage from "../../public/placeholder_venue_image.png"
import Image, { StaticImageData } from "next/image";
import VenueCard , { Venue } from "@/components/venue-card";
import ReputationCard, { VenueReputation } from "@/components/hirer-reputation-card";
import SearchBar from "@/components/search-bar";
import HirerProfileCard from "@/components/hirer-profile-update";

const initialVenues: Venue[] = [
    {
        name: "Place1",
        expectedguests: 200,
        date: "17/04/2026",
        time: "20:00",
        duration: 2,
        image: placeholderImage
    }, 
    {
        name: "Place2",
        expectedguests: 500,
        date: "18/04/2026",
        time: "19:00",
        duration: 3,
        image: placeholderImage
    },
    {
        name: "Place3",
        expectedguests: 1000,
        date: "19/04/2026",
        time: "18:00",
        duration: 4,
        image: placeholderImage
    }
];

const initialReputation: VenueReputation[] = [
    {
        name: "Place1",
        location: "Sydney",
        eventName: "Wedding",
        dateOfHire: "17/04/2025",
        rating: 4
    },
    {
        name: "Place2",
        location: "Melbourne",
        eventName: "Conference",
        dateOfHire: "18/04/2025",
        rating: 5
    },
    {
        name: "Place3",
        location: "Brisbane",
        eventName: "Birthday Party",
        dateOfHire: "19/04/2025",
        rating: 3
    }
];

export default function HirerPage() {
    const [venues, setVenues] = useState<Venue[]>(initialVenues);
    const [venueRep, setVenueRep] = useState<VenueReputation[]>(initialReputation);

    return (
        <div className="hirersPage min-h-screen flex flex-col">
            <HeaderContainer/>
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                {/* Start of hirer profile */}
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Hirer Profile </Text>
                    <Stack gap={2}>
                    <Center>
                        <HirerProfileCard/>
                    </Center>
                    <Center>
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
                    </Center>
                    </Stack>
                </Container>
                
                {/* Start of venues list */}
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Venues </Text>
                    <SearchBar placeholder="Search for venues..." onSearch={(query) => console.log("Search query:", query)} />
                    <Stack mt={6} gap={4}>
                        {venues.map((venue, index) => (
                            <VenueCard key={index} venue={venue} index={index} venues={venues}/>
                        ))}
                    </Stack>
                </Container>
                </div>
            <FooterContainer/>
        </div>
    );
}