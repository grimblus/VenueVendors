import { Input, InputGroup, NativeSelect } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    onDomainChange?: (domain: string) => void;
    hasDomain?: boolean;
}

interface DomainSelectProps {
    onDomainChange?: (domain: string) => void;
}

const DomainSelect = ( props : DomainSelectProps) => (
  
  <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
    <NativeSelect.Field defaultValue="Name" fontSize="sm" onChange={(e) => props.onDomainChange?.(e.target.value)}>
      <option value="Name">Name</option>
      <option value="Location">Location</option>
      <option value="Capacity">Capacity</option>
      <option value="Type">Type</option>
      <option value="Suitable Events">Suitable Events</option>
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
)

export default function SearchBar(props: SearchBarProps) {
    const { placeholder, onSearch, hasDomain, onDomainChange } = props;

    return (
        <InputGroup flex="1" endElement={hasDomain ? <DomainSelect onDomainChange={onDomainChange}/> : undefined} startElement={<LuSearch />}>
            <Input placeholder={placeholder} onChange={(e) => onSearch(e.target.value)}/>
        </InputGroup>
    );
}