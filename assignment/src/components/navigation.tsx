import { Link, Button } from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

const Navigation = () => {
    const router = useRouter();

    const manageSignOut = () => {
        // TODO: Add signout logic
    }

    return (
        <nav style={{ display: "flex", gap: "1rem" }}>
            <Link
                as={NextLink}
                href="/signup"
                colorPalette="green"
            >
                Sign-up
            </Link>

            <Link
                as={NextLink}
                href="/signin"
                colorPalette="green"
            >
                Sign-in
            </Link>

            <Button
                variant="plain"
                colorPalette="green"
                onClick={manageSignOut}
            >
                Sign Out
            </Button>
        </nav>
    )
}

export default Navigation