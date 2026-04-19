import { Input, InputGroup } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
    const { placeholder, onSearch } = props;

    return (
        <InputGroup flex="1" startElement={<LuSearch />}>
            <Input placeholder={placeholder} onChange={(e) => onSearch(e.target.value)}/>
        </InputGroup>
    );
}