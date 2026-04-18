import { Card, Text, Button, Field, Input, Stack, HStack, Box } from "@chakra-ui/react";
import { useState } from "react";

export interface Applicant {
    //applicant personal info
    id: string;
    email: string;
    name: string;
    //event info      
    eventType: string;
    eventDate: string;
    guestCount: number;
    venueRequirements: string;
    //more applicant info
    previousHires: string;
    documentName: string;
    selected: boolean;
    approved: boolean;
    rejected: boolean;
    comments: string[];
}

export interface ApplicantCardProps {
    applicant: Applicant;
    onUpdate: (updatedApplicant: Applicant) => void;
}

export default function ApplicantCard(props: ApplicantCardProps) {
  const applicant = props.applicant;
  const onUpdate = props.onUpdate;

  const [commentText, setCommentText] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleAddComment = () => {
    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }
    const updatedApplicant = {
      ...applicant,
      comments: [...applicant.comments, commentText]
    };
    onUpdate(updatedApplicant);
    setCommentText("");
  };

  const handleSelect = () => {
    const updatedApplicant = {
      ...applicant,
      selected: true
    };
    onUpdate(updatedApplicant);
  };

  const handleUnselect = () => {
    const updatedApplicant = {
      ...applicant,
      selected: false,
      comments: []
    };
    onUpdate(updatedApplicant);
  };

  const handleReject = () => {
    const updatedApplicant = {
      ...applicant,
      rejected: true
    };
    onUpdate(updatedApplicant);
    alert("Application rejected");
  };

  const handleApprove = () => {
    const updatedApplicant = {
      ...applicant,
      approved: true
    };
    onUpdate(updatedApplicant);
    alert("Booking confirmed! The applicant has been notified.");
  };

  return (
    <Card.Root width="full" mb={4}>
      <Card.Body>
        <Stack gap={3}>
          <HStack justify="space-between">
            <Box>
              <Text textStyle="xl" fontWeight="bold">{applicant.name}</Text>
              <Text color="gray.600">{applicant.email}</Text>
            </Box>
            {/* application status message */}
            <Box>
              {applicant.selected && !applicant.rejected && (
                <Text color="blue.500" fontWeight="semibold">Selected</Text>
              )}
              {applicant.approved && (
                <Text color="green.500" fontWeight="semibold">Approved</Text>
              )}
              {applicant.rejected && (
                <Text color="red.500" fontWeight="semibold">Rejected</Text>
              )}
            </Box>
          </HStack>

          {/* event details */}
          <Box>
            <Text fontWeight="semibold">Event Details:</Text>
            <Text>Type: {applicant.eventType}</Text>
            <Text>Date: {applicant.eventDate}</Text>
            <Text>Expected Guests: {applicant.guestCount}</Text>
            <Text>Requirements: {applicant.venueRequirements}</Text>
          </Box>

          {/* hire history of hirer and documents */}
          <Box>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "View"} Hire History & Documents
            </Button>
            {showDetails && (
              <Box mt={2} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold">Previous Hires:</Text>
                <Text mb={2}>{applicant.previousHires}</Text>
                <Text fontWeight="semibold">Compliance Document:</Text>
                <Text>{applicant.documentName}</Text>
              </Box>
            )}
          </Box>

          {/* applicant comments here */}
          {applicant.comments.length > 0 && (
            <Box>
              <Text fontWeight="semibold">Comments:</Text>
              {applicant.comments.map((comment, idx) => (
                <Text key={idx} p={2} bg="gray.50" borderRadius="md" mt={1}>
                  {comment}
                </Text>
              ))}
            </Box>
          )}

          {/* Add comment feature here - only shown when selected */}
          {applicant.selected && !applicant.approved && !applicant.rejected && (
            <Box>
              <Field.Root>
                <Field.Label>Add Comment</Field.Label>
                <Input
                  placeholder="Enter your comment about this applicant"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </Field.Root>
              <Button size="sm" mt={2} onClick={handleAddComment}>
                Add Comment
              </Button>
            </Box>
          )}

          {/* main buttons */}
          {!applicant.rejected && !applicant.approved && (
            <HStack gap={2}>
              {!applicant.selected && (
                <>
                  <Button colorScheme="blue" onClick={handleSelect}>
                    Select Applicant
                  </Button>
                  <Button colorScheme="red" variant="outline" onClick={handleReject}>
                    Reject Application
                  </Button>
                </>
              )}
              {applicant.selected && (
                <>
                  <Button colorScheme="green" onClick={handleApprove}>
                    Approve & Confirm Booking
                  </Button>
                  <Button colorScheme="gray" variant="outline" onClick={handleUnselect}>
                    Unselect
                  </Button>
                </>
              )}
            </HStack>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}