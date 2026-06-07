import { Box, Text, Stack, Card, HStack, Spinner, Center } from "@chakra-ui/react";
import { TiStar } from "react-icons/ti";
import { Applicant } from "./applicant-card";

interface ApplicantStatsProps {
    applicants: Applicant[];
    loading?: boolean;
}

export default function ApplicantStats({ applicants, loading }: ApplicantStatsProps) {
    if (loading) {
        return (
            <Center mt={8} flexDirection="column" gap={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color="gray.500">Loading applicant stats...</Text>
            </Center>
        );
    }

    if (applicants.length === 0) {
        return <Text color="gray.500" mt={6}>No applicants to display stats for.</Text>;
    }

    const selected = applicants.filter(a => a.selected || a.approved);

    const selectedHirerIds = new Set(
        applicants
            .filter(applicant => applicant.selected || applicant.approved)
            .map(applicant => applicant.hirerId)
    );

    const neverSelected = applicants.filter((applicant, index, self) =>
        !selectedHirerIds.has(applicant.hirerId) &&
        !applicant.rejected &&
        index === self.findIndex(t => t.hirerId === applicant.hirerId)
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
                        Unselected Applicants
                    </Text>
                    {neverSelected.length > 0 ? (
                        <Stack gap={2}>
                            {neverSelected.map((applicant, i) => (
                                <HStack key={i} justify="space-between">
                                    <Box>
                                        <Text fontWeight="bold">{applicant.name}</Text>
                                        <Text color="gray.500">{applicant.email}</Text>
                                    </Box>
                                </HStack>
                            ))}
                        </Stack>
                    ) : (
                        <Text color="gray.500">All applicants have been selected</Text>
                    )}
                </Card.Body>
            </Card.Root>
        </Stack>
    );
}