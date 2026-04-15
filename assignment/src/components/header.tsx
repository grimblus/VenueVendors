import Navigation from "./navigation"
import Image from "next/image"
import { Box } from "@chakra-ui/react"
import image from "../../public/stadium.png"
import { HStack } from "@chakra-ui/react"

const HeaderContainer = () => {
    return ( 
        <Box bg="bg.panel" w="100%" p="4" color="yellow.solid">
            <HStack justify="space-between" w="100%" align="center">
                <Box><Image src={image} alt="logo" quality={100}/></Box>
                <Box><h1 color="white">Venue Vendors</h1></Box>
                <Navigation />
            </HStack>
        </Box>
    )
}

export default HeaderContainer