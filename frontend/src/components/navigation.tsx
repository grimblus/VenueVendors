import { Link, Button, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
    const router = useRouter();
    // const [currentUser, setCurrentUser] = useState<any>(null);
    const { currentUser, logout } = useAuth();

    // useEffect(() => {
    //     const stored = localStorage.getItem("currentUser");
    //     if (stored) {
    //         setCurrentUser(JSON.parse(stored));
    //     }
    // }, []);

    // const handleLogout = () => {
    //     localStorage.removeItem("currentUser");
    //     setCurrentUser(null);
    //     router.push("/signin");
    // };

    const handleLogout = () => {
        logout();
        router.push("/signin");
    }

    return (
        <HStack gap={4}>
            <Link as={NextLink} href="/">Home</Link>

            {/* for both hirer and vendor */}
            {currentUser && (
                <Link as={NextLink} href="/hirers">Hirer</Link>
            )}

            {/* for vendor only */}
            {currentUser?.role === "vendor" && (
                <Link as={NextLink} href="/vendors">Vendor</Link>
            )}

            {/* <Link as={NextLink} href="/hirers">Hirer</Link>
            <Link as={NextLink} href="/vendors">Vendor</Link> */}

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