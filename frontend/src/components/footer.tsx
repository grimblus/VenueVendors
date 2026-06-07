import React from "react";
import { Box, Flex, Text, HStack } from "@chakra-ui/react";

const FooterContainer = () => {
  return (
    <Box bg="gray.800" color="white" p={4} w="full">
      <Flex justify="space-between" align="center" w="full">
        <Text>© 2026 Vendor Venues. All rights reserved.</Text>

        <HStack gap={4}>
          <Text >
            Privacy Policy
          </Text>

          <Text >
            Terms of Service
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};

export default FooterContainer;