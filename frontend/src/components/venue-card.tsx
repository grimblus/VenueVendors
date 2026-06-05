import { Card, HStack, Text, AbsoluteCenter, Fieldset, Field, Center, Input, Button } from "@chakra-ui/react";
import Dropdown from "@/components/dropdown";
import Modal from "@/components/modal";
import { StaticImageData } from "next/image"
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface Venue {
    id: number;
    name: string;
    location?: string;
    expectedGuests: number;
    dateHeld: string;
    time: string;
    duration: number;
    image?: string | StaticImageData; // kept for backwards compatibility
    imageUrl?: string;
    eventType?: string;
    suitableEvents?: string[];
    preference?: number;
    vendor?: {
        id: number;
        firstName: string;
        lastName: string;
    };
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
  const { currentUser } = useAuth();
  const [hireDuration, setHireDuration] = useState(1);
  const [hireTime, setHireTime] = useState("");

  const preferredRank = preferredVenues?.find((v) => v.name == venue.name)?.preference;
  const isPreferred = preferredRank != undefined;

  const handleApplySubmit = async () => {
    console.log("hireDate:", hireDate);
    console.log("hireRequirements:", hireRequirements);
    console.log("hireCapacity:", hireCapacity);

    // Validation check
    if (!hireDate || !hireRequirements || !hireCapacity) {
        alert('Please fill in all fields');
        return;
    }
    if (!hireDate) {
    alert("Please enter a hire date");
    return;
    }
    if (!hireRequirements.trim()) {
        alert("Please enter a reason for hiring");
        return;
    }
    if (!hireCapacity || hireCapacity <= 0 || isNaN(hireCapacity)) {
        alert("Please enter a valid capacity");
        return;
    }
    if (!hireTime) {
        alert("Please enter a hire time");
        return;
    }
    if (!hireDuration || hireDuration <= 0 || isNaN(hireDuration)) {
        alert("Please enter a valid duration");
        return;
    }



    try {
        const res = await fetch("http://localhost:3001/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              hirerId: currentUser?.id,
              venueId: venue.id,
              eventName: hireRequirements,
              date: hireDate,
              time: hireTime,
              duration: hireDuration,
              capacity: hireCapacity,
          })
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.error || "Booking failed");
            return;
        }

        // Only alert success AFTER API confirms
        alert("Venue application submitted successfully!");
    } catch (err) {
        alert("Failed to connect to server");
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
            <Text>{preferredRank}</Text>
                <Dropdown
                  items={venues.map((_, i) => ({ label: String(i + 1), value: String(i + 1) }))}
                  onSelect={(item) => setSelectedRank(Number(item.value))}
                />
                <Button size="sm" onClick={handlePreferenceSubmit}>Apply Preference</Button>
          </HStack>

          <AbsoluteCenter>
            <Text textStyle="4xl">{venue.name}</Text>
          </AbsoluteCenter>

          <Modal
            triggerLabel="Apply"
            title={venue.name}
            image={venue.imageUrl || venue.image}
            body={
              <>
                {venue.eventType && <Text>Event Type: {venue.eventType}</Text>}
                {venue.suitableEvents && venue.suitableEvents.length > 0 && (
                  <Text>Suitable Events: {venue.suitableEvents.join(", ")}</Text>
                )}
                {venue.location && <Text>Location: {venue.location}</Text>}
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
                        <Field.Root>
                          <Field.Label>Hire Time</Field.Label>
                          <Input 
                              name="time" 
                              type="time" 
                              value={hireTime} 
                              onChange={(e) => setHireTime(e.target.value)}
                          />
                      </Field.Root>

                      <Field.Root>
                          <Field.Label>Duration (hours)</Field.Label>
                          <Input 
                              name="duration" 
                              type="number" 
                              placeholder="Enter duration in hours" 
                              value={hireDuration} 
                              onChange={(e) => setHireDuration(Number(e.target.value))}
                          />
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