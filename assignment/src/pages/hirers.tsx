import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import {
    AbsoluteCenter,
    Box,
  Button,
  Center,
  Field,
  Fieldset,
  For,
  HStack,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react"

export default function HirerPage() {
    return (
        <div className="mainpage min-h-screen flex flex-col">
            <HeaderContainer/>
            <div className="mainContent flex flex-1 flex-col items-center justify-center">
                <Center>
                    <Fieldset.Root size="lg" maxW="md">
                    <Stack>
                        <Center>
                        <Fieldset.Legend>Hirer profile</Fieldset.Legend>
                        </Center>
                        <Center>
                        <Fieldset.HelperText>
                        Please update your hirer details below.
                        </Fieldset.HelperText>
                        </Center>
                    </Stack>

                    <Fieldset.Content>
                        <HStack>
                        <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input name="name" />
                        </Field.Root>

                        <Field.Root>
                        <Field.Label>Phone Number</Field.Label>
                        <Input name="pnumber" type="tel" />
                        </Field.Root>
                        </HStack>
                    </Fieldset.Content>

                    <Center>
                    <Button type="submit" alignSelf="flex-start">
                        Submit
                    </Button>
                    </Center>
                    </Fieldset.Root>
                </Center>
                </div>
            <FooterContainer/>
        </div>
    );
}