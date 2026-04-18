import { Card, Text } from "@chakra-ui/react";

export interface VenueReputation {
    name: string;
    location: string;
    eventName: string;
    dateOfHire: string;
    rating: number;
}

interface ReputationCardProps {
    reputation: VenueReputation;
}

export default function ReputationCard(props: ReputationCardProps) {
  const { reputation } = props;

  return (
    <Card.Root w="full" maxW="2xl" mx="auto">
      <Card.Body>
        <Text>Location: {reputation.location}</Text>
        <Text>Event Name: {reputation.eventName}</Text>
        <Text>Date of Hire: {reputation.dateOfHire}</Text>
        <Text>Rating: {reputation.rating}</Text>
      </Card.Body>
    </Card.Root>
  );
}