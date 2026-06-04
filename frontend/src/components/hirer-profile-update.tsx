import { Card, Fieldset, Field, Input, Button, HStack, Center, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function HirerProfileCard() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const {currentUser, setCurrentUser} = useAuth();
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFirstName(currentUser.firstName || "");
            setLastName(currentUser.lastName || "");
            setPhone(currentUser.phone || "");
            setIsUpdated(!!(currentUser.firstName && currentUser.lastName && currentUser.phone));
        }
    }, [currentUser]);

    //If the profile already has name and phone number, card won't show.
    if (isUpdated) {
        return null;
    }

    const handleSubmit = async () => {
        //If no current user is logged in, nothing happens,
        if (!currentUser) {
            const message = 'Please log in to update your profile';
            alert(message);
            return;
        }
        //Validation for empty fields
        if (!firstName || !lastName || !phone) {
            const message = 'Please fill in all fields';
            alert(message);
            return;
        //Validation for phone number (only digits)
        } else if (!/^\d+$/.test(phone)) {
            const message = 'Please enter a valid phone number';
            alert(message);
            return;
        //Validation for name (only letters, at least 2 characters)
        } else if (!/^[a-zA-Z]{2,40}$/.test(firstName) || !/^[a-zA-Z]{2,40}$/.test(lastName)) {
            const message = 'Please enter a valid name (only letters, at least 2 characters)';
            alert(message);
            return;
        //Valid
        }

        try {
            const response = await fetch(`http://localhost:3001/api/users/profile/${currentUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update profile");
                return;
            }

            // Update user in AuthContext and localStorage
            const updatedUser = { ...currentUser, firstName: firstName, lastName: lastName, phone: phone };
            setCurrentUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setIsUpdated(true);
            alert("Profile updated successfully!");

        } catch (error) {
            console.log(error); 
            alert("An error occurred while updating your profile. Please try again.");
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
                        <Field.Label>First Name</Field.Label>
                        <Input name="firstName" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                        </Field.Root>

                        <Field.Root>
                        <Field.Label>Last Name</Field.Label>
                        <Input name="lastName" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        </Field.Root>

                        <Field.Root>
                        <Field.Label>Phone Number</Field.Label>
                        <Input name="phone" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)}/>
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