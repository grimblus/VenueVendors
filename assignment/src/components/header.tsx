import Navigation from "./navigation"
import Image from "next/image"
import { Box } from "@chakra-ui/react"
import image from "../../public/stadium.png"

const HeaderContainer = () => {
    return ( 
        <Box bg="bg.panel" w="100%" p="4" color="yellow.solid">
            <header>
                <Image src={image} alt="logo" quality={100}/>
                <h1 color="white">Venue Vendors</h1>
                <Navigation />
            </header>
        </Box>
    )
}

export default HeaderContainer