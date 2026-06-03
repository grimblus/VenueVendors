import { useEffect } from "react";
import { useRouter } from "next/router";
import HeaderContainer from "@/components/header";
import FooterContainer from "@/components/footer";
import { useAuth } from "@/context/AuthContext";
import { Box, Card, Container, Text, Stack } from "@chakra-ui/react";

export default function Profile() {
    const router = useRouter();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            router.push("/signin");
        }
    }, [currentUser]);

    if (!currentUser) return null;

    return (
        <div className="profilePage min-h-screen flex flex-col">
            <HeaderContainer />
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" mb={8}>
                        My Profile
                    </Text>

                    <Card.Root w="full" maxW="2xl" mx="auto">
                        <Card.Body>
                            <Stack gap={4}>
                                <Text fontSize="2xl" fontWeight="bold">
                                    Welcome, {currentUser.firstName} {currentUser.lastName}!
                                </Text>

                                <Box>
                                    <Text fontWeight="semibold" color="gray.500">Email</Text>
                                    <Text>{currentUser.email}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="semibold" color="gray.500">First Name</Text>
                                    <Text>{currentUser.firstName}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="semibold" color="gray.500">Last Name</Text>
                                    <Text>{currentUser.lastName}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="semibold" color="gray.500">Phone</Text>
                                    <Text>{currentUser.phone || "Not set"}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="semibold" color="gray.500">Role</Text>
                                    <Text>{currentUser.role}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="semibold" color="gray.500">Member Since</Text>
                                    <Text>
                                        {new Date(currentUser.dateCreated).toLocaleDateString("en-AU", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </Text>
                                </Box>
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                </Container>
            </div>
            <FooterContainer />
        </div>
    );
}