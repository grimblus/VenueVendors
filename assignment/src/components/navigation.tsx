import { Link, Button } from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { Box, HStack } from "@chakra-ui/react"


const Navigation = () => {
    const router = useRouter();

    const manageSignOut = () => {
        // TODO: Add signout logic
    }

    return (
        <nav>
            <HStack>
            <Box>
                <Link
                as={NextLink}
                href="/signup"
                colorPalette="green"
            >
                Sign-up
            </Link>
            </Box>

            <Box>
            <Link
                as={NextLink}
                href="/signin"
                colorPalette="green"
            >
                Sign-in
            </Link>
            </Box>

            <Box>
            <Button
                variant="plain"
                colorPalette="green"
                onClick={manageSignOut}
            >
                Sign Out
            </Button>
            </Box>
            </HStack>
        </nav>
    )
}

export default Navigation