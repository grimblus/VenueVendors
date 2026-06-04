import { useState } from "react";
import { useRouter } from "next/router";
import HeaderContainer from "@/components/header";
import FooterContainer from "@/components/footer";
import { Button, Field, Fieldset, Input, Stack, Text } from "@chakra-ui/react";

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isStrongPassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&^#\-_]).{6,}$/;
    return strongPasswordRegex.test(password);
};

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");

    const handleSubmit = async () => {
        setError("");

        if (!email || !password || !confirmPassword || !firstName || !lastName || !role) {
            setError("Please fill in all fields");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!isStrongPassword(password)) {
            setError("Password must be at least 6 characters and contain uppercase, lowercase, and special character");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, firstName, lastName, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            alert("Sign up successful! Please sign in.");
            router.push("/signin");
        } catch (err) {
            setError("Failed to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signupPage min-h-screen flex flex-col">
            <HeaderContainer />
            <div className="mainContent flex flex-1 flex-col items-center justify-center">
                <Fieldset.Root size="lg" maxW="md">
                    <Stack>
                        <Fieldset.Legend>Create an account</Fieldset.Legend>
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root>
                            <Field.Label>First Name</Field.Label>
                            <Input
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Last Name</Field.Label>
                            <Input
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Role</Field.Label>
                            <select
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    fontFamily: "Arial",
                                    fontSize: "14px",
                                    backgroundColor: "white",
                                    color: "black",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="" disabled>Select a role...</option>
                                <option value="hirer">Hirer</option>
                                <option value="vendor">Vendor</option>
                            </select>
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Email Address</Field.Label>
                            <Input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Password</Field.Label>
                            <Input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Confirm Password</Field.Label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Field.Root>

                        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                    </Fieldset.Content>

                    <Button
                        alignSelf="flex-start"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </Fieldset.Root>
            </div>
            <FooterContainer />
        </div>
    );
}