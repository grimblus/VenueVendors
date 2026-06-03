import { Link, Button, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Navigation = () => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
            setCurrentUser(JSON.parse(stored));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        router.push("/signin");
    };

    return (
        <HStack gap={4}>
            <Link as={NextLink} href="/">Home</Link>
            <Link as={NextLink} href="/hirers">Hirer</Link>
            <Link as={NextLink} href="/vendors">Vendor</Link>

            {currentUser ? (
                <>
                    <Text fontWeight="semibold" color="green.400">
                        Welcome, {currentUser.firstName} {currentUser.lastName}!
                    </Text>
                    <Link as={NextLink} href="/profile">Profile</Link>
                    <Button variant="plain" colorPalette="red" onClick={handleLogout}>
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Link as={NextLink} href="/signup">Sign-up</Link>
                    <Link as={NextLink} href="/signin">Sign-in</Link>
                </>
            )}
        </HStack>
    );
};

export default Navigation;