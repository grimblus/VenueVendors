import { Card, Fieldset, Field, Input, Button, HStack, Center, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "../pages/signin";

export default function HirerProfileCard() {
    const [usersName, setUsersName] = useState("");
    const [usersPhone, setUsersPhone] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    <Card.Root w="full" mx="auto" mt={6}>
        <Card.Body >
            <Fieldset.Root size="lg" w="full">
            <Center>
                <Fieldset.HelperText>Please update your hirer details below.</Fieldset.HelperText>
            </Center>

            <Fieldset.Content>
                <HStack gap = {4} w='100%'>
                    <Field.Root>    
                    <Field.Label>Name</Field.Label>
                    <Input name="name" placeholder="Enter your name" value={usersName} onChange={(e) => setUsersName(e.target.value)}/>
                    </Field.Root>

                    <Field.Root>
                    <Field.Label>Phone Number</Field.Label>
                    <Input name="pnumber" type="tel" placeholder="Enter your phone number" value={usersPhone} onChange={(e) => setUsersPhone(e.target.value)}/>
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
    );
}