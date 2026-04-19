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
}

export interface VenueCardProps {
    venue: Venue;
    index: number;
    venues: Venue[];
    preference?: number;
    usedPreference?: string[];
    onPreferenceChange?: (value: string) => void;
}

export default function VenueCard(props: VenueCardProps) {
  const { venue, index, venues, preference, usedPreference } = props;
  const [hireReason, setHireReason] = useState("");
  const [hireDuration, setHireDuration] = useState(1);
  const [hireDate, setHireDate] = useState("");

 const handleSubmit = () => {
        //Validation for empty fields
        if (!hireDate || !hireReason || !hireDuration) {
            const message = 'Please fill in all fields';
            alert(message);
            return;
        //Valid
        } else {
            const message = `Reservation submitted!\nDate: ${hireDate}\nReason: ${hireReason}\nDuration: ${hireDuration} hours`;
            alert(message);
        }
    };

  return (
    <Card.Root w="full" mx="auto">
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
                        <Input name="reason" placeholder="Enter your reason for hiring" value={hireReason} onChange={(e) => setHireReason(e.target.value)}/>
                        </Field.Root>
                
                        <Field.Root>
                        <Field.Label>Hire Duration</Field.Label>
                        <Input name="duration" type="number" placeholder="Enter hire duration in hours" value={hireDuration} onChange={(e) => setHireDuration(Number(e.target.value))}/>
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
            onConfirm={handleSubmit}
          />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}