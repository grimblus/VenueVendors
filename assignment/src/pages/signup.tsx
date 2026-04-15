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

interface User {
  email: string;
  password: string;
}

const initialUsers: User[] = [
  {email: "rhys@test.com", password: "rhys-admin"}, //intialising stored users for test purposes
];

export default function Signup(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
        
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
      let updatedUsers;
      if(!selectedUser.email || !password1 || !password2){
        const message = 'Please fill in all fields'
        alert(message);
        return
      }
      if (password1 != password2) {
        const message = `Error: Passwords do not match`;
        alert(message);
        return
      }
      else{
        const currUser: User = {
          email: selectedUser.email,
          password: password1,
        };
        updatedUsers = [...users, currUser];
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        router.push("/hirers")
      }
      setSelectedUser({ email: "", password: "" });
      setPassword1("");
      setPassword2("");
    };

    return (
      <div className='signupPage'>
        <HeaderContainer />
          <Fieldset.Root size="lg" maxW="md">
            <Stack>
              <Fieldset.Legend>Enter</Fieldset.Legend>
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

              <Field.Root>
                <Field.Label>Confirm Password</Field.Label>
                <Field.RequiredIndicator />
                <Input name="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
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
