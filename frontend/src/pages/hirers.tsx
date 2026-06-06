import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import {
    Container, 
    Center, 
    Stack, 
    Text,
    HStack,
    Input,
    Button,
    Field,
} from "@chakra-ui/react"
import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import VenueCard, { Venue } from "@/components/venue-card";
import ReputationCard from "@/components/hirer-reputation-card";
import SearchBar from "@/components/search-bar";
import HirerProfileCard from "@/components/hirer-profile-update";
import { useAuth } from "@/context/AuthContext";

export default function HirerPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDomain, setSearchDomain] = useState("Name");
    const [preferredVenues, setPreferredVenues] = useState<Venue[]>([]);
    const { currentUser } = useAuth();

    // compliance document states
    const [driversLicense, setDriversLicense] = useState<string | null>(null);
    const [driversLicenseFileName, setDriversLicenseFileName] = useState<string>("");
    const [publicLiabilityInsurance, setPublicLiabilityInsurance] = useState<string | null>(null);
    const [publicLiabilityFileName, setPublicLiabilityFileName] = useState<string>("");
    const [isBusinessApplication, setIsBusinessApplication] = useState(false);
    const [abnNumber, setAbnNumber] = useState("");
    const [businessRegistration, setBusinessRegistration] = useState<string | null>(null);
    const [businessRegFileName, setBusinessRegFileName] = useState<string>("");
    const [complianceScore, setComplianceScore] = useState(0);

    const venueRep = currentUser ? {
        totalStars: currentUser.totalStars || 0,
        reviewCount: currentUser.reviewCount || 0
    } : null;

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const calculateComplianceScore = (
        license: string | null,
        insurance: string | null,
        isBusiness: boolean,
        businessReg: string | null
    ): number => {
        let score = 0;
        if (license) score += 2;
        if (insurance) score += 2;
        if (isBusiness && businessReg) score += 1;
        return Math.min(score, 5);
    };

    const handleDriversLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setDriversLicense(base64);
            setDriversLicenseFileName(file.name);
            setComplianceScore(calculateComplianceScore(base64, publicLiabilityInsurance, isBusinessApplication, businessRegistration));
        }
    };

    const handleInsuranceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setPublicLiabilityInsurance(base64);
            setPublicLiabilityFileName(file.name);
            setComplianceScore(calculateComplianceScore(driversLicense, base64, isBusinessApplication, businessRegistration));
        }
    };

    const handleBusinessRegUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setBusinessRegistration(base64);
            setBusinessRegFileName(file.name);
            setComplianceScore(calculateComplianceScore(driversLicense, publicLiabilityInsurance, isBusinessApplication, base64));
        }
    };

    const handleSaveDocuments = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/users/documents/${currentUser?.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    driversLicense,
                    publicLiabilityInsurance,
                    isBusinessApplication,
                    abnNumber: isBusinessApplication ? abnNumber : null,
                    businessRegistration: isBusinessApplication ? businessRegistration : null,
                    complianceScore,
                })
            });

            if (!res.ok) {
                alert("Failed to save documents");
                return;
            }

            alert(`Documents saved! Your compliance score is ${complianceScore}/5`);
        } catch (err) {
            alert("Failed to connect to server");
        }
    };

    useEffect(() => {
        fetch("http://localhost:3001/api/venues")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch venues");
                return res.json();
            })
            .then(data => setVenues(data))
            .catch(console.error);

        if (currentUser) {
            fetch(`http://localhost:3001/api/preferred-venues/${currentUser.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch preferred venues");
                    return res.json();
                })
                .then(data => setPreferredVenues(data))
                .catch(console.error);
        }
    }, [currentUser]);
    
    const filteredVenues = venues.filter((venue) => {
        const query = searchQuery.toLowerCase();
        if (searchDomain == "Name") {
            return venue.name.toLowerCase().includes(query);
        } else if (searchDomain == "Location") {
            return venue.location?.toLowerCase().includes(query);
        } else if (searchDomain == "Capacity") {
            const capacityQuery = parseInt(query);
            return venue.expectedGuests >= capacityQuery;
        } else if (searchDomain == "Type") {
            return venue.eventType?.toLowerCase().includes(query);
        } else if (searchDomain == "Suitable Events") {
            return venue.suitableEvents?.some(event => event.toLowerCase().includes(query));
        } else {
            return false;
        }
    });

    const handleAddPreference = async (venue: Venue, rank: number) => {
        await fetch("http://localhost:3001/api/preferred-venues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hirerId: currentUser?.id,
                venueId: venue.id,
                rank
            })
        });

        const res = await fetch(`http://localhost:3001/api/preferred-venues/${currentUser?.id}`);
        const data = await res.json();
        setPreferredVenues(data);
    };

    return (
        <div className="hirersPage min-h-screen flex flex-col">
            <HeaderContainer/>
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                {/* Start of hirer profile */}
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Your Profile </Text>
                    <Stack gap={2}>
                        <Center>
                            <HirerProfileCard/>
                        </Center>
                        <Center>
                            <HStack>
                                {/* Hirer Reputation Modal */}
                                <Modal
                                    triggerLabel="Reputation"
                                    title="Your Hirer's Reputation"
                                    body={
                                        <Stack gap={4}>
                                            {venueRep ? (
                                                <ReputationCard reputation={venueRep} />
                                            ) : (
                                                <Text>No reputation data yet</Text>
                                            )}
                                        </Stack>
                                    }
                                    hideConfirm={true}
                                    cancelLabel="Close"
                                />

                                {/* Preferred Venues Modal */}
                                <Modal
                                    triggerLabel="Preferred Venues"
                                    title="Your Preferred Venues"
                                    body={
                                        <Stack gap={4}>
                                            <>                        
                                                {preferredVenues.map((venue, index) => (
                                                    <VenueCard 
                                                        key={index} 
                                                        venue={venue} 
                                                        index={index} 
                                                        venues={venues} 
                                                        preferredVenues={preferredVenues} 
                                                        onPreferenceChange={(rank) => handleAddPreference(venue, rank)} />
                                                ))}
                                            </>
                                        </Stack>
                                    }
                                    hideConfirm={true}
                                    cancelLabel="Close"
                                />

                                {/* Compliance Documents Modal */}
                                <Modal
                                    triggerLabel="Compliance Documents"
                                    title="Upload Compliance Documents"
                                    body={
                                        <Stack gap={4}>
                                            {/* Live compliance score */}
                                            <HStack>
                                                <Text fontWeight="semibold">Compliance Score: </Text>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        style={{ color: star <= complianceScore ? "gold" : "gray", fontSize: "20px" }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                                <Text>({complianceScore}/5)</Text>
                                            </HStack>

                                            {/* Drivers License */}
                                            <Stack gap={1}>
                                                <Text fontWeight="semibold">Driver's License (jpg)</Text>
                                                <input
                                                    id="driversLicenseUpload"
                                                    type="file"
                                                    accept=".jpg,.jpeg"
                                                    onChange={handleDriversLicenseUpload}
                                                    style={{ display: "none" }}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById("driversLicenseUpload")?.click()}
                                                >
                                                    Choose File
                                                </Button>
                                                {driversLicenseFileName && (
                                                    <Text fontSize="sm" color="green.500">✓ {driversLicenseFileName}</Text>
                                                )}
                                            </Stack>

                                            {/* Public Liability Insurance */}
                                            <Stack gap={1}>
                                                <Text fontWeight="semibold">Public Liability Insurance (pdf)</Text>
                                                <input
                                                    id="publicLiabilityUpload"
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleInsuranceUpload}
                                                    style={{ display: "none" }}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById("publicLiabilityUpload")?.click()}
                                                >
                                                    Choose File
                                                </Button>
                                                {publicLiabilityFileName && (
                                                    <Text fontSize="sm" color="green.500">✓ {publicLiabilityFileName}</Text>
                                                )}
                                            </Stack>

                                            {/* Business Application Checkbox */}
                                            <HStack>
                                                <input
                                                    type="checkbox"
                                                    id="isBusinessApplication"
                                                    checked={isBusinessApplication}
                                                    onChange={(e) => {
                                                        setIsBusinessApplication(e.target.checked);
                                                        setComplianceScore(calculateComplianceScore(driversLicense, publicLiabilityInsurance, e.target.checked, businessRegistration));
                                                    }}
                                                />
                                                <label htmlFor="isBusinessApplication">
                                                    Applying on behalf of a business/organisation
                                                </label>
                                            </HStack>

                                            {/* Business fields - only show if checkbox is ticked */}
                                            {isBusinessApplication && (
                                                <Stack gap={2}>
                                                    <Field.Root>
                                                        <Field.Label>ABN Number</Field.Label>
                                                        <Input
                                                            placeholder="Enter ABN number"
                                                            value={abnNumber}
                                                            onChange={(e) => setAbnNumber(e.target.value)}
                                                        />
                                                    </Field.Root>

                                                    <Stack gap={1}>
                                                        <Text fontWeight="semibold">Certificate of Registration (pdf)</Text>
                                                        <input
                                                            id="businessRegUpload"
                                                            type="file"
                                                            accept=".pdf"
                                                            onChange={handleBusinessRegUpload}
                                                            style={{ display: "none" }}
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => document.getElementById("businessRegUpload")?.click()}
                                                        >
                                                            Choose File
                                                        </Button>
                                                        {businessRegFileName && (
                                                            <Text fontSize="sm" color="green.500">✓ {businessRegFileName}</Text>
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            )}
                                        </Stack>
                                    }
                                    confirmLabel="Save Documents"
                                    onConfirm={handleSaveDocuments}
                                    cancelLabel="Close"
                                />
                            </HStack>
                        </Center>
                    </Stack>
                </Container>
                
                {/* Start of venues list */}
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Venues </Text>
                    <SearchBar 
                        placeholder="Search for venues..." 
                        onSearch={(query) => setSearchQuery(query)} 
                        onDomainChange={(domain) => setSearchDomain(domain)} 
                        hasDomain={true}/>
                    <Stack mt={6} gap={4}>
                        {filteredVenues.length > 0 ? (
                            filteredVenues.map((venue, index) => (
                                <VenueCard 
                                    key={index} 
                                    venue={venue} 
                                    index={index} 
                                    venues={venues}
                                    preferredVenues={preferredVenues} 
                                    onPreferenceChange={(rank) => handleAddPreference(venue, rank)}/>
                            ))
                        ) : (
                            <Text textAlign="center">No venues found.</Text>
                        )}
                    </Stack>
                </Container>
            </div>
            <FooterContainer/>
        </div>
    );
}