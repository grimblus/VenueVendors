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

 export interface User {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

const initialUsers: User[] = [
  {email: "rhys@test.com", password: "Rhys-admin1", name: "", phone: ""}, //intialising stored users for test purposes
];

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
    const [password1, setPassword1] = useState("");
        
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>({
        email: "",
        password: "",
    });

    useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with default data if nothing in localStorage
      setUsers(initialUsers);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }, []);

    

    const handleSubmit = () =>{
    //Validation checks occur here
      if(!selectedUser.email || !password1){
        const message = 'Please fill in all fields'
        alert(message);
        return
      }

      // validating email and password here
      if (!isValidEmail(selectedUser.email)) {
      alert("Please enter a valid email address (e.g. name@example.com)");
      return;
    }

    if (!isStrongPassword(password1)) {
      alert(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, and a number"
      );
      return;
    }
      // checking if entered credentials exist within local storage
      const existingUser = users.find(
        (user) => user.email === selectedUser.email
        && user.password == password1);

      if(existingUser){
        localStorage.setItem("currentUser", existingUser.email);
        alert("Login successful!")
        router.push("/vendors")
      }
      else{
        alert("Username and/ or password is incorrect. Please try again")
        setSelectedUser({ email: "", password: "" });
        setPassword1("");
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
                <Input name="email" value={selectedUser.email || ""} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })
                    }/>
              </Field.Root>

              <Field.Root>
                <Field.Label>Password</Field.Label>
                <Field.RequiredIndicator />
                <Input name="password" type="password" value={password1} onChange={(e) => setPassword1(e.target.value)}/>
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