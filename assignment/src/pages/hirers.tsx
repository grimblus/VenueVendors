import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import { AbsoluteCenter, Container, Box, Button, Center, Field, Fieldset, For, HStack, Input, NativeSelect, Stack, Card, Text } from "@chakra-ui/react"

export default function HirerPage() {
    return (
        <div className="mainpage min-h-screen flex flex-col">
            <HeaderContainer/>
            <div className="mainContent flex flex-1 flex-col items-center pt-12">
                <Container maxW="container.lg">
                    <Text textStyle="6xl" textAlign="center" marginTop={12}> Hirer Profile </Text>
                    <Center>
                        <Card.Root w="full" maxW="2xl" mx="auto" mt={6}>
                            <Card.Body >
                            <Fieldset.Root size="lg" w="full">
                            <Center>
                            <Fieldset.HelperText>Please update your hirer details below.</Fieldset.HelperText>
                            </Center>

                            <Fieldset.Content>
                                <HStack gap = {4} w='100%'>
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
                            </Card.Body>
                        </Card.Root>
                    </Center>
                </Container>  
                </div>
            <FooterContainer/>
        </div>
    );
}