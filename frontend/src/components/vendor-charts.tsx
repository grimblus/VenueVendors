import { Box, Text, Stack, Card, HStack, Badge } from "@chakra-ui/react";
import { TiStar } from "react-icons/ti";
import { Applicant } from "./applicant-card";

interface VendorChartsProps {
    applicants: Applicant[];
}

export default function VendorCharts({ applicants }: VendorChartsProps) {
    if (applicants.length === 0) {
        return <Text color="gray.500" mt={6}>No applicants to display statistics for.</Text>;
    }

    const allHirerIds = [...new Set(applicants.map(a => a.hirerId))];

    const selected = applicants.filter(a => a.selected || a.approved);

    const selectedHirerIds = new Set(
        applicants
            .filter(a => a.selected || a.approved)
            .map(a => a.hirerId)
    );

    const neverSelected = applicants.filter(a => 
        !selectedHirerIds.has(a.hirerId) && !a.rejected
    );

    const uniqueNeverSelected = applicants.filter((a, index, self) =>
        !selectedHirerIds.has(a.hirerId) &&
        !a.rejected &&
        index === self.findIndex(t => t.hirerId === a.hirerId)
    );

    const mostChosen = selected.length > 0
        ? selected.reduce((prev, curr) => 
            curr.ratingCount > prev.ratingCount ? curr : prev)
        : null;

    const leastChosen = selected.length > 1
        ? selected.reduce((prev, curr) => 
            curr.ratingCount < prev.ratingCount ? curr : prev)
        : null;

    return (
        <Stack gap={4} mt={6}>
            <Card.Root>
                <Card.Body>
                    <Text fontWeight="semibold" color="green.500" mb={2}>
                        Most Chosen Applicant
                    </Text>
                    {mostChosen ? (
                        <HStack justify="space-between">
                            <Box>
                                <Text fontWeight="bold">{mostChosen.name}</Text>
                                <Text color="gray.500">{mostChosen.email}</Text>
                            </Box>
                            <HStack color="yellow.400">
                                <TiStar />
                                <Text>
                                    {mostChosen.ratingCount > 0
                                        ? (mostChosen.totalStars / mostChosen.ratingCount).toFixed(1)
                                        : "No rating"}
                                </Text>
                            </HStack>
                        </HStack>
                    ) : (
                        <Text color="gray.500">No selected applicants yet</Text>
                    )}
                </Card.Body>
            </Card.Root>

            <Card.Root>
                <Card.Body>
                    <Text fontWeight="semibold" color="orange.500" mb={2}>
                        Least Chosen Applicant
                    </Text>
                    {leastChosen ? (
                        <HStack justify="space-between">
                            <Box>
                                <Text fontWeight="bold">{leastChosen.name}</Text>
                                <Text color="gray.500">{leastChosen.email}</Text>
                            </Box>
                            <HStack color="yellow.400">
                                <TiStar />
                                <Text>
                                    {leastChosen.ratingCount > 0
                                        ? (leastChosen.totalStars / leastChosen.ratingCount).toFixed(1)
                                        : "No rating"}
                                </Text>
                            </HStack>
                        </HStack>
                    ) : (
                        <Text color="gray.500">Not enough applicants to compare</Text>
                    )}
                </Card.Body>
            </Card.Root>

            <Card.Root>
                <Card.Body>
                    <Text fontWeight="semibold" color="gray.500" mb={2}>
                        Applicants Not Yet Selected ({uniqueNeverSelected.length})
                    </Text>
                    {uniqueNeverSelected.length > 0 ? (
                        <Stack gap={2}>
                            {uniqueNeverSelected.map((a, i) => (
                                <HStack key={i} justify="space-between">
                                    <Box>
                                        <Text fontWeight="bold">{a.name}</Text>
                                        <Text color="gray.500">{a.email}</Text>
                                    </Box>
                                    <Badge colorPalette="gray">Pending</Badge>
                                </HStack>
                            ))}
                        </Stack>
                    ) : (
                        <Text color="gray.500">All applicants have been processed</Text>
                    )}
                </Card.Body>
            </Card.Root>
        </Stack>
    );
}