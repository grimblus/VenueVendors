import { HStack, Input, InputGroup, NativeSelect } from "@chakra-ui/react"
import { useState } from "react";
import { LuSearch } from "react-icons/lu"

const SUITABLE_EVENT_KEYWORDS = [
    "Tennis",
    "Dining",
    "Classical Music",
    "Rock Concert",
    "Birthday",
    "Wedding Reception",
    "Music",
    "Presentation"
];

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    onDomainChange?: (domain: string) => void;
    hasDomain?: boolean;
}

interface DomainSelectProps {
    onDomainChange?: (domain: string) => void;
    onSearchChange?: (query: string) => void;
    selectedDomain?: string;
}

const DomainSelect = ( props : DomainSelectProps) => (
  
  <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
    <NativeSelect.Field defaultValue="Name" fontSize="sm" onChange={(e) => props.onDomainChange?.(e.target.value)}>
      <option value="Name">Name</option>
      <option value="Location">Location</option>
      <option value="Type">Type</option>
      <option value="Suitable Events">Suitable Events</option>
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
)

const SuitableEventsSelect = (props: { onSelect: (keyword: string) => void }) => (
    <NativeSelect.Root size="xs" variant="plain" width="auto">
        <NativeSelect.Field
            fontSize="sm"
            onChange={(e) => props.onSelect(e.target.value)}
            defaultValue=""
        >
            <option value="">Select event type...</option>
            {SUITABLE_EVENT_KEYWORDS.map(keyword => (
                <option key={keyword} value={keyword}>{keyword}</option>
            ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
    </NativeSelect.Root>
);

export default function SearchBar(props: SearchBarProps) {
    const { placeholder, onSearch, hasDomain, onDomainChange } = props;
    const [selectedDomain, setSelectedDomain] = useState("Name");

    const handleDomainChange = (domain: string) => {
        setSelectedDomain(domain);
        onDomainChange?.(domain);
        onSearch("");
    };

    return (
        <HStack w="full" justifyContent="center">
            <InputGroup flex="1" endElement={hasDomain ? <DomainSelect onDomainChange={handleDomainChange}/> : undefined} startElement={<LuSearch />}>
                {/* user cant type if suitable events selected */}
                <Input placeholder={
                    selectedDomain === "Suitable Events"
                        ? "Select from dropdown on the right"
                        : placeholder
                    }
                    readOnly={selectedDomain === "Suitable Events"}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </InputGroup>
            
            {/* shows suitable event dropdown when suitable event clicked */}
            {selectedDomain === "Suitable Events" && hasDomain && (
                <SuitableEventsSelect onSelect={(keyword) => onSearch(keyword)} />
            )}
        </HStack>
        
    );
}