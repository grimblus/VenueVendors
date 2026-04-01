import { Link } from "@chakra-ui/react"

const HeaderContainer = () => {
    return ( 
        <header>
            <h1>Venue Vendors</h1>
            <nav>
                <Link
                    variant="underline"
                    href="../file path for sign-up page"
                    colorPalette="green"
                >
                    Sign-up
                </Link>

                <Link
                    variant="underline"
                    href="../file path for sign-in page"
                    colorPalette="green"
                >
                    Sign-in
                </Link>

                <Link
                    variant="underline"
                    href="../file path for sign-in page"
                    colorPalette="green"
                >
                    Sign-out
                </Link>
            </nav>

        </header>
    )
}

export default HeaderContainer()