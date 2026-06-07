import { Link, Button, HStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
    const router = useRouter();
    // const [currentUser, setCurrentUser] = useState<any>(null);
    const { currentUser, logout } = useAuth();
    const [mounted, setMounted] = useState(false);

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

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/signin");
    }

    if (!mounted) {
        return (
            <HStack gap={4}>
                <Link as={NextLink} href="/">Home</Link>
            </HStack>
        );
    }

    return (
        <HStack gap={4}>
            <Link as={NextLink} href="/" color="white">Home</Link>

            {/* for hirer only */}
            {currentUser?.role === "hirer" && (
                <Link as={NextLink} href="/hirers" color="white">Hirer</Link>
            )}

            {/* for vendor only */}
            {currentUser?.role === "vendor" && (
                <>
                    <Link as={NextLink} href="/vendors" color="white">Vendor</Link>
                    <Link as={NextLink} href="/applicantcharts" color="white">Applicant Charts</Link>
                </>
            )}

            {/* for admin only */}
            {currentUser?.role === "admin" && (
                <>
                    <Link as={NextLink} href="/hirers" color="white">Hirer</Link>
                    <Link as={NextLink} href="/vendors" color="white">Vendor</Link>
                    <Link as={NextLink} href="/applicantcharts" color="white">Applicant Charts</Link>
                </>
            )}

            {currentUser ? (
                <>
                    <Text fontWeight="semibold" color="green.400">
                        Welcome, {currentUser.firstName} {currentUser.lastName}!
                    </Text>
                    <Link as={NextLink} href="/profile" color="white">Profile</Link>
                    <Button variant="plain" colorPalette="red" onClick={handleLogout}>
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Link as={NextLink} href="/signup" color="white">Sign-up</Link>
                    <Link as={NextLink} href="/signin" color="white">Sign-in</Link>
                </>
            )}
        </HStack>
    );
};

export default Navigation;