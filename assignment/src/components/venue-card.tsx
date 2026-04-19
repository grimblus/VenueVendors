import { Card, HStack, Text, AbsoluteCenter, Fieldset, Field, Center, Input, Button } from "@chakra-ui/react";
import Dropdown from "@/components/dropdown";
import Modal from "@/components/modal";
import { StaticImageData } from "next/image"
import { useState } from "react";

export interface Venue {
    name: string;
    location?: string;
    expectedguests: number;
    date: string;
    time: string;
    duration: number;
    image?: string | StaticImageData;
    type?: string;
    suitableEvents?: string[];
    preference?: number;
}

export interface VenueCardProps {
    venue: Venue;
    index: number;
    venues: Venue[];
    preferredVenues?: Venue[];
    onPreferenceChange?: (rank: number) => void;
}

export default function VenueCard(props: VenueCardProps) {
  const { venue, index, venues, onPreferenceChange, preferredVenues } = props;
  const [hireRequirements, setHireRequirements] = useState("");
  const [hireCapacity, setHireCapacity] = useState(1);
  const [hireDate, setHireDate] = useState("");
  const [selectedRank, setSelectedRank] = useState(1);

  const preferredRank = preferredVenues?.find((v) => v.name == venue.name)?.preference;
  const isPreferred = preferredRank != undefined;

  const handleApplySubmit = () => {
    //Validation for empty fields
    if (!hireDate || !hireRequirements || !hireCapacity) {
      const message = 'Please fill in all fields';
      alert(message);
      return;
    //Valid
    } else {
      const message = `Venue application submitted`;
      alert(message);
    }
  };

  const handlePreferenceSubmit = () => {
    onPreferenceChange?.(selectedRank);
  };

  return (
    <Card.Root w="full" mx="auto">
      <Card.Body>
        <HStack w="100%" justifyContent="space-between">
          <HStack>
            {isPreferred ? ( <Text>{preferredRank + 1}</Text> ) : (
              <>
                <Dropdown
                  items={venues.map((_, i) => ({ label: String(i + 1), value: String(i + 1) }))}
                  onSelect={(item) => setSelectedRank(Number(item.value))}
                />
                <Button size="sm" onClick={handlePreferenceSubmit}>Apply Preference</Button>
              </>
            )}
          </HStack>

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
                {venue.type && <Text>Type: {venue.type}</Text>}
                {venue.suitableEvents && venue.suitableEvents.length > 0 && (
                  <Text>Suitable Events: {venue.suitableEvents.join(", ")}</Text>
                )}
                <Card.Root w="full" mx="auto" mt={6}>
                  <Card.Body >
                    <Fieldset.Root size="lg" w="full">
                    <Center>
                      <Fieldset.HelperText>Please place your application details below.</Fieldset.HelperText>
                    </Center>
                
                    <Fieldset.Content>
                      <HStack gap = {4} w='100%'>
                        <Field.Root>    
                        <Field.Label>Reason for Hiring</Field.Label>
                        <Input name="reason" placeholder="Enter your hiring requirements" value={hireRequirements} onChange={(e) => setHireRequirements(e.target.value)}/>
                        </Field.Root>
                
                        <Field.Root>
                        <Field.Label>Hire Capacity</Field.Label>
                        <Input name="capacity" type="number" placeholder="Enter expected number of guests" value={hireCapacity} onChange={(e) => setHireCapacity(Number(e.target.value))}/>
                        </Field.Root>

                        <Field.Root>
                        <Field.Label>Hire Date</Field.Label>
                        <Input name="date" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)}/>
                        </Field.Root>
                      </HStack>
                    </Fieldset.Content>
                    </Fieldset.Root>
                  </Card.Body>
                </Card.Root>
              </>
            }
            confirmLabel="Apply"
            onConfirm={handleApplySubmit}
          />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}