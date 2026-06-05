import { Card, HStack, Text } from "@chakra-ui/react";
import { TiStar } from "react-icons/ti";

export interface VenueReputation {
    totalStars: number;
    reviewCount: number;
}

interface ReputationCardProps {
    reputation: VenueReputation;
}

export default function ReputationCard(props: ReputationCardProps) {
  const { reputation } = props;

  const avRating = reputation.reviewCount > 0
        ? (reputation.totalStars / reputation.reviewCount).toFixed(1)
        : "No ratings yet";

  return (
    <Card.Root w="full" maxW="2xl" mx="auto">
      <Card.Body>
        <HStack color="yellow.400">
                    <TiStar />
                    <Text fontWeight="semibold">
                        Average Rating: {avRating}
                    </Text>
                </HStack>
                <Text>Total Stars: {reputation.totalStars}</Text>
                <Text>Total Reviews: {reputation.reviewCount}</Text>
      </Card.Body>
    </Card.Root>
  );
}