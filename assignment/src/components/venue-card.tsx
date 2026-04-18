import { Card, HStack, Text, AbsoluteCenter } from "@chakra-ui/react";
import Dropdown from "@/components/dropdown";
import Modal from "@/components/modal";
import { StaticImageData } from "next/image"

export interface Venue {
    name: string;
    expectedguests: number;
    date: string;
    time: string;
    duration: number;
    image?: string | StaticImageData;
}

export interface VenueCardProps {
    venue: Venue;
    index: number;
    venues: Venue[];
}

export default function VenueCard(props: VenueCardProps) {
  const { venue, index, venues } = props;

  return (
    <Card.Root w="full" maxW="2xl" mx="auto">
      <Card.Body>
        <HStack w="100%" justifyContent="space-between">
          <Dropdown
            items={venues.map((_, i) => ({ label: String(i + 1), value: String(i + 1) }))}
            onSelect={(item) => console.log("Preference:", item.value)}
          />

          <AbsoluteCenter>
            <Text textStyle="4xl">{venue.name}</Text>
          </AbsoluteCenter>

          <Modal
            triggerLabel="Apply"
            title={venue.name}
            image={venue.image}
            body={
              <>
                <Text>Expected Guests: {venue.expectedguests}</Text>
                <Text>Date: {venue.date}</Text>
                <Text>Time: {venue.time}</Text>
                <Text>Duration: {venue.duration} hours</Text>
              </>
            }
            confirmLabel="Apply"
            onConfirm={() => alert(`Applied to ${venue.name}!`)}
          />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}