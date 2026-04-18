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

export interface Venue {
    name: string;
    expectedguests: number;
    date: string;
    time: string;
    duration: number;
    image?: string | StaticImageData;
}

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

export interface VenueReputation {
    name: string;
    location: string;
    eventName: string;
    dateOfHire: string;
    rating: number;
}

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
    //For the update hirer profile
    const [usersName, setUsersName] = useState("");
    const [usersPhone, setUsersPhone] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [venues, setVenues] = useState<Venue[]>(initialVenues);
    const [venueRep, setVenueRep] = useState<VenueReputation[]>(initialReputation);

    //For the update hirer profile
    useEffect(() => {
        const storedUsers = localStorage.getItem("users");
        const currentUserEmail = localStorage.getItem("currentUser");
        if (storedUsers && currentUserEmail) {
            const users: User[] = JSON.parse(storedUsers);
            const user = users.find((u) => u.email === currentUserEmail);
            if (user) {
                setCurrentUser(user);
                setUsersName(user.name ?? "");
                setUsersPhone(user.phone ?? "");
            }
        }
    }, []);

    //For the hirer profile
    const handleSubmit = () => {
        const currentUserEmail = localStorage.getItem("currentUser");
        if (!currentUserEmail || !currentUser) return;

        //Validation for empty fields and phone number(just making sure its all numbers)
        if (!usersName || !usersPhone) {
            const message = 'Please fill in all fields';
            alert(message);
            return;
        } else if (!/^\d+$/.test(usersPhone)) {
            const message = 'Please enter a valid phone number';
            alert(message);
            return;
        } else {
            //Valid
            const storedUsers = localStorage.getItem("users");
            if (!storedUsers) return;
            const users: User[] = JSON.parse(storedUsers);
            const updatedUsers = users.map((u) =>
                u.email === currentUser.email ? { ...u, name: usersName, phone: usersPhone } : u
            );

            localStorage.setItem("users", JSON.stringify(updatedUsers));
            const message = `Profile updated!\nName: ${usersName}\nPhone: ${usersPhone}`;
            alert(message);
        }

    };

    return (
        <div className="mainpage min-h-screen flex flex-col">
            <HeaderContainer/>
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                {/* Start of hirer profile */}
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Hirer Profile </Text>
                    <Stack gap={2}>
                    <Center>
                        <Card.Root w="full" maxW="2xl" mx="auto" mt={6}>
                            <Card.Body >
                            <Fieldset.Root size="lg" w="full">
                            <Center>
                            <Fieldset.HelperText>Please update your hirer details below.</Fieldset.HelperText>
                            </Center>

                            <Fieldset.Content>
                                <HStack gap = {4} w='100%'>
                                    <Field.Root>
                                    <Field.Label>Name</Field.Label>
                                    <Input name="name" value={usersName} onChange={(e) => setUsersName(e.target.value)}/>
                                    </Field.Root>

                                    <Field.Root>
                                    <Field.Label>Phone Number</Field.Label>
                                    <Input name="pnumber" type="tel" value={usersPhone} onChange={(e) => setUsersPhone(e.target.value)}/>
                                    </Field.Root>
                                </HStack>
                            </Fieldset.Content>

                            <Center>
                            <Button alignSelf="flex-start" onClick={handleSubmit}>
                                Submit
                            </Button>
                            </Center>
                            </Fieldset.Root>
                            </Card.Body>
                        </Card.Root>
                    </Center>
                    <Center>
                        {/* Hirer Reputation */}
                        <Modal
                            triggerLabel="Reputation"
                            title="Your Hirer's Reputation"
                            body={
                                <Stack gap={4}>
                                <>                        
                                    {venueRep.map((venue, index) => (
                                        <Card.Root key={index} w="full" maxW="2xl" mx="auto">
                                            <Card.Body>
                                                <Text>Location: {venue.location}</Text>
                                                <Text>Event Name: {venue.eventName}</Text>
                                                <Text>Date of Hire: {venue.dateOfHire}</Text>
                                                <Text>Rating: {venue.rating}</Text>
                                            </Card.Body>
                                        </Card.Root>
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
                    <Stack mt={6} gap={4}>
                        {venues.map((venue, index) => (
                            <Card.Root key={index} w="full" maxW="2xl" mx="auto">
                                <Card.Body>
                                    <HStack w="100%" justifyContent="space-between">
                                    {/* Dropdown for preference list */}
                                    <Dropdown items={venues.map((place, i) => ({ label: String(i + 1), value: String(i + 1) }))} 
                                    onSelect={(item) => console.log("Preference:", item.value)}/>

                                    <AbsoluteCenter>
                                    <Text textStyle="4xl">{venue.name}</Text>
                                    </AbsoluteCenter>

                                    {/* Modal for applying and viewing */}
                                    <Modal
                                        triggerLabel="Apply"
                                        title={venue.name}
                                        image={venue.image}
                                        body={
                                            <>
                                                <Text>Expected Guests: {venue.expectedguests}</Text>
                                                <Text>Date: {venue.date}</Text>
                                                <Text>Time: {venue.time}</Text>
                                                <Text>Duration: {venue.duration} hours</Text>
                                            </>
                                        }
                                        confirmLabel="Apply"
                                        onConfirm={() => alert(`Applied to ${venue.name}!`)}
                                    />
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </Stack>
                </Container>
                </div>
            <FooterContainer/>
        </div>
    );
}