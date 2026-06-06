import { Card, Text, Button, Field, Input, Stack, HStack, Box } from "@chakra-ui/react";
import { useState } from "react";
import { TiStar } from "react-icons/ti";

export interface Applicant {
    id: string;
    hirerId?: number;
    venueId?: number;
    email: string;
    name: string;
    venueName: string;
    eventType: string;
    eventDate: string;
    guestCount: number;
    venueRequirements: string;
    previousHires: string;
    documentName: string;
    selected: boolean;
    approved: boolean;
    rejected: boolean;
    comments: string[];
    totalStars: number;
    ratingCount: number;
    complianceScore: number;
    driversLicense?: string;
    publicLiabilityInsurance?: string;
    businessRegistration?: string;
    isBusinessApplication?: boolean;
    abnNumber?: string;
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
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // getting average rating
  const averageRating = applicant.ratingCount > 0 
    ? (applicant.totalStars / applicant.ratingCount).toFixed(1) 
    : "No ratings yet";

  const handleAddComment = () => {
    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }
    const updatedApplicant = {
      ...applicant,
      comments: [...(applicant.comments || []), commentText]
    };
    onUpdate(updatedApplicant);
    setCommentText("");
  };

  const handleSelectWithRating = async () => {
    if (selectedRating === 0) {
      alert("Please select a rating (1-5 stars)");
      return;
    }

    // save rating to user in database
    if (applicant.hirerId) {
      try {
        const res = await fetch(`http://localhost:3001/api/users/rating/${applicant.hirerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: selectedRating })
        });

        if (!res.ok) {
          console.error("Failed to save rating");
        }
      } catch (err) {
        console.error("Failed to save rating:", err);
      }
    }

    const updatedApplicant = {
      ...applicant,
      selected: true,
      totalStars: applicant.totalStars + selectedRating,
      ratingCount: applicant.ratingCount + 1
    };
    onUpdate(updatedApplicant);
    setShowRating(false);
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
              
              {/* reputation rating */}
              <HStack fontWeight="semibold">
                <TiStar/>
                <Text>
                  Rating: {averageRating} {applicant.ratingCount > 0 && `(${applicant.ratingCount} reviews)`}
                </Text>
              </HStack>

              {/* compliance score */}
              <HStack fontWeight="semibold">
                <Text>Compliance Score: </Text>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TiStar
                    key={star}
                    color={star <= applicant.complianceScore ? "gold" : "gray"}
                  />
                ))}
                <Text>({applicant.complianceScore}/5)</Text>
              </HStack>
            </Box>
            <Box>
              {applicant.selected && !applicant.rejected && (
                <Text color="blue.500" fontWeight="semibold">✓ Selected</Text>
              )}
              {applicant.approved && (
                <Text color="green.500" fontWeight="semibold">✓ Approved</Text>
              )}
              {applicant.rejected && (
                <Text color="red.500" fontWeight="semibold">✗ Rejected</Text>
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

          {/* hire history and documents */}
          <Box>
            <Button 
              size="sm"
              colorPalette="cyan.solid" 
              variant="outline" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "View"} Hire History & Documents
            </Button>
            {showDetails && (
              <Box mt={2} p={3} bg="bg.panel" borderRadius="md">
                <Text fontWeight="semibold" mb={2}>Compliance Documents:</Text>

                {/* license */}
                {applicant.driversLicense ? (
                  <Box mb={3}>
                    <Text fontWeight="semibold" fontSize="sm">Driver's License:</Text>
                    <img
                      src={applicant.driversLicense}
                      alt="Driver's License"
                      style={{ maxWidth: "300px", maxHeight: "200px", objectFit: "contain", marginTop: "4px", borderRadius: "4px" }}
                    />
                  </Box>
                ) : (
                  <Text fontSize="sm" color="red.500" mb={2}>✗ No driver's license uploaded</Text>
                )}

                {/* Public Liability Insurance */}
                {applicant.publicLiabilityInsurance ? (
                  <Box mb={3}>
                    <Text fontWeight="semibold" fontSize="sm">Public Liability Insurance:</Text>
                    <Button
                      size="sm"
                      variant="outline"
                      mt={1}
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = applicant.publicLiabilityInsurance!;
                        link.download = "public_liability_insurance.pdf";
                        link.click();
                      }}
                    >
                      Download PDF
                    </Button>
                  </Box>
                ) : (
                  <Text fontSize="sm" color="red.500" mb={2}>✗ No insurance document uploaded</Text>
                )}

                {/* business Documents */}
                {applicant.isBusinessApplication && (
                  <Box mb={3}>
                    <Text fontWeight="semibold" fontSize="sm">Business Application</Text>
                    <Text fontSize="sm">ABN: {applicant.abnNumber || "Not provided"}</Text>
                    {applicant.businessRegistration ? (
                      <Button
                        size="sm"
                        variant="outline"
                        mt={1}
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = applicant.businessRegistration!;
                          link.download = "business_registration.pdf";
                          link.click();
                        }}
                      >
                        Download Business Registration PDF
                      </Button>
                    ) : (
                      <Text fontSize="sm" color="red.500">✗ No business registration uploaded</Text>
                    )}
                  </Box>
                )}

                {/* no documents at all */}
                {!applicant.driversLicense && !applicant.publicLiabilityInsurance && !applicant.isBusinessApplication && (
                  <Text fontSize="sm" color="gray.500">No documents uploaded by this applicant</Text>
                )}
              </Box>
            )}
          </Box>

          {/* applicant comments displayed here */}
          {applicant.comments && applicant.comments.length > 0 && (
            <Box>
              <Text fontWeight="semibold">Comments:</Text>
              {applicant.comments.map((comment, idx) => (
                <Text key={idx} p={2} bg="bg.panel" borderRadius="md" mt={1}>
                  {comment}
                </Text>
              ))}
            </Box>
          )}

          {/* feature for adding comments here */}
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

          {/* rating option that shows when application is selected */}
          {showRating && (
            <Box p={3} bg="bg.muted" borderRadius="md">
              <Text fontWeight="semibold" mb={2}>Rate this applicant (1-5 stars):</Text>
              <HStack gap={2}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    size="sm"
                    colorPalette={selectedRating >= star ? "orange" : "gray"}
                    onClick={() => setSelectedRating(star)}
                  >
                    {star}<TiStar />
                  </Button>
                ))}
              </HStack>
              <HStack gap={2} mt={3}>
                <Button size="sm" colorPalette="blue" onClick={handleSelectWithRating}>
                  Confirm Selection
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowRating(false)}>
                  Cancel
                </Button>
              </HStack>
            </Box>
          )}

          {/* action buttons - don't show if rejected or approved */}
          {!applicant.rejected && !applicant.approved && (
            <HStack gap={2}>
              {!applicant.selected && (
                <>
                  <Button colorPalette="blue" onClick={() => setShowRating(true)}>
                    Select Applicant
                  </Button>
                  <Button colorPalette="red" variant="outline" onClick={handleReject}>
                    Reject Application
                  </Button>
                </>
              )}
              {applicant.selected && (
                <>
                  <Button colorPalette="green" onClick={handleApprove}>
                    Approve & Confirm Booking
                  </Button>
                  <Button colorPalette="gray" variant="outline" onClick={handleUnselect}>
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