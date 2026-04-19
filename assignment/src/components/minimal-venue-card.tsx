import { Card, HStack, Text, Button } from "@chakra-ui/react";
import Venue from "@/components/venue-card";

export interface VendorVenueCardProps {
  venue: Venue;
  isSelected: boolean;
  onToggle: () => void;
}

//minimalised version of venue card from venue-card.tsx, for vendor's page
export default function VendorVenueCard(props: VendorVenueCardProps) {
  const venue = props.venue;
  const isSelected = props.isSelected;
  const onToggle = props.onToggle;

  return (
    <Card.Root w="full" maxW="2xl" mx="auto">
      <Card.Body>
        <HStack w="100%" justifyContent="space-between">
          <Text textStyle="3xl" fontWeight="semibold">{venue.name}</Text>
          
          <Button variant="outline" size="sm" onClick={onToggle}>
            {isSelected ? "Hide Applications" : "View Applications"}
          </Button>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}