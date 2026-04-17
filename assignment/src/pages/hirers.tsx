import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import { AbsoluteCenter, Container, Box, Button, Center, Field, Fieldset, For, HStack, Input, NativeSelect, Stack, Card, Text } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { User } from "./signin";

export interface Venue {
    name: string;
    expectedguests: number;
    date: string;
    time: string;
    duration: number;
}

const initialVenues: Venue[] = [
  {
    name: "Place1",
    expectedguests: 200,
    date: "17/04/2026",
    time: "20:00",
    duration: 2,
  }, 
  {
    name: "Place2",
    expectedguests: 500,
    date: "18/04/2026",
    time: "19:00",
    duration: 3,
  }
];

export default function HirerPage() {

    const [usersName, setUsersName] = useState("");
    const [usersPhone, setUsersPhone] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [venues, setVenues] = useState<Venue[]>(initialVenues);
    
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

    const handleSubmit = () => {
        const currentUserEmail = localStorage.getItem("currentUser");
        if (!currentUserEmail || !currentUser) return;

        if (!usersName || !usersPhone) {
            alert("Please fill in all fields");
            return;
        } else if (!/^\d+$/.test(usersPhone)) {
            alert("Please enter a valid phone number");
            return;
        } else {
            const storedUsers = localStorage.getItem("users");
            if (!storedUsers) return;
            const users: User[] = JSON.parse(storedUsers);
            const updatedUsers = users.map((u) =>
                u.email === currentUser.email ? { ...u, name: usersName, phone: usersPhone } : u
            );

            localStorage.setItem("users", JSON.stringify(updatedUsers));
            alert(`Profile updated!\nName: ${usersName}\nPhone: ${usersPhone}`);
        }

    };

    return (
        <div className="mainpage min-h-screen flex flex-col">
            <HeaderContainer/>
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Hirer Profile </Text>
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
                </Container>  
                </div>
            <FooterContainer/>
        </div>
    );
}