import Navigation from "./navigation"
import Image from "next/image"
import { Box } from "@chakra-ui/react"
import image from "../../public/stadium.png"
import { HStack } from "@chakra-ui/react"
import NextLink from "next/link"

const HeaderContainer = () => {
    return ( 
        <Box bg="gray.800" color="white" w="full" p="3">
            <HStack w="100%" align="center">
                <NextLink href="/">
                    <HStack gap={2}>
                        <Image src={image} alt="logo" width={40} height={40}/>
                        <h1 style={{ color: 'yellow' }}>Venue Vendors</h1>
                    </HStack>
                </NextLink>
                
                <Box flex="1" />
                
                <Navigation />
            </HStack>
        </Box>
    )
}

export default HeaderContainer