import { useEffect, useRef, useState } from "react"
import { Button, useFilter, useListCollection, useListbox, Popover, Listbox, Portal } from "@chakra-ui/react"
import { LuChevronDown } from "react-icons/lu"

interface DropdownItem {
    label: string;
    value: string;
}

interface DropdownProps {
    items: DropdownItem[];
    onSelect?: (item: DropdownItem) => void;
}

const dropdown = ({ items, onSelect }: DropdownProps) => {
    const [inputValue, setInputValue] = useState("")
    const [open, setOpen] = useState(false)
    const { contains } = useFilter({ sensitivity: "base" })
    const triggerRef = useRef<HTMLButtonElement | null>(null)

    const { collection, filter } = useListCollection({
        initialItems: items,
        filter: contains,
    })

    const listbox = useListbox({
        collection,
        onValueChange() {
            setOpen(false)
            setInputValue("")
            triggerRef.current?.focus()
        },
    })

    const selectedItem = listbox.selectedItems[0]

    const setInputValueFn = (value: string) => {
        setInputValue(value)
        filter(value)
    }

    return (
        <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Popover.Trigger asChild>
                <Button size="sm" ref={triggerRef} variant="outline">
                    {selectedItem ? selectedItem.label : "Select"} <LuChevronDown />
                </Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content _closed={{ animation: "none" }}>
                        <Popover.Body p="0">
                            <Listbox.RootProvider value={listbox} gap="0" overflow="hidden">
                                <Listbox.Input
                                    minH="10" px="3" roundedTop="l2" bg="transparent" outline="0"
                                    value={inputValue}
                                    onChange={(e) => setInputValueFn(e.currentTarget.value)}
                                />
                                <Listbox.Content borderWidth="0" borderTopWidth="1px" roundedTop="0" gap="0">
                                    {collection.items.map((item) => (
                                        <Listbox.Item item={item} key={item.value}>
                                            <Listbox.ItemText>{item.label}</Listbox.ItemText>
                                            <Listbox.ItemIndicator />
                                        </Listbox.Item>
                                    ))}
                                </Listbox.Content>
                            </Listbox.RootProvider>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

export default dropdown