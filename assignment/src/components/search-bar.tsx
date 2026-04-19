import { Input, InputGroup, NativeSelect } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
}

const DomainSelect = () => (
  <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
    <NativeSelect.Field defaultValue="Name" fontSize="sm">
      <option value="Name">Name</option>
      <option value="Location">Location</option>
      <option value="Capacity">Capacity</option>
      <option value="Recommended Suitability">Recommended Suitability</option>
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
)

export default function SearchBar(props: SearchBarProps) {
    const { placeholder, onSearch } = props;

    return (
        <InputGroup flex="1" endElement={<DomainSelect />} startElement={<LuSearch />}>
            <Input placeholder={placeholder} onChange={(e) => onSearch(e.target.value)}/>
        </InputGroup>
    );
}