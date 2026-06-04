import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
} from "@chakra-ui/react"
import { useState, EventHandler, useEffect } from "react"
import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header"
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

// validates email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// strong password check here
const isStrongPassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const length = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && length;
}

export default function Signin(){
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { setCurrentUser } = useAuth();

    const handleSubmit = async () => {
    //Validation checks occur here
      if(!email || !password){
        const message = 'Please fill in all fields'
        alert(message);
        return
      }

      // validating email and password here
      if (!isValidEmail(email)) {
      alert("Please enter a valid email address (e.g. name@example.com)");
      return;
    }

    if (!isStrongPassword(password)) {
      alert(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, and a number"
      );
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password");
        return;
      }

      // save user to AuthContext and localStorage
      setCurrentUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      alert("Login successful!");

      // page based on role
      if (data.user.role === "vendor") {
        router.push("/vendors");
      } else {
        router.push("/hirers");
      }

      } catch (err) {
        alert("Failed to connect to server. Please try again.");
      }
      
    };

    return (
      <div className='signinPage'>
        <HeaderContainer />
          <Fieldset.Root size="lg" maxW="md">
            <Stack>
              <Fieldset.Legend>Enter your login credentials</Fieldset.Legend>
            </Stack>

            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Email Address</Field.Label>
                <Field.RequiredIndicator />
                <Input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </Field.Root>

              <Field.Root>
                <Field.Label>Password</Field.Label>
                <Field.RequiredIndicator />
                <Input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </Field.Root>
            </Fieldset.Content>

            <Button alignSelf="flex-start" onClick={handleSubmit}>
              Submit
            </Button>
          </Fieldset.Root>
          <FooterContainer />
        </div>
  )
}