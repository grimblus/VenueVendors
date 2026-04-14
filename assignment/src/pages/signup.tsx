import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
} from "@chakra-ui/react"
import { useState, EventHandler, useEffect } from "react"

interface User {
  email: string;
  password: string;
}

const initialUsers: User[] = [
  {email: "rhys@test.com", password: "rhys-admin"}, //intialising stored users for test purposes
];

const signup = () => {
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
        
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>({
        email: "",
        password: "",
    });

    useEffect(() => {
    // Load pets from localStorage on component mount
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with default data if nothing in localStorage
      setUsers(initialUsers);
      localStorage.setItem("pets", JSON.stringify(initialUsers));
    }
  }, []);

    

    const onClick = () =>{
    //Validation checks occur here
    let updatedUsers;
      if (password1 != password2) {
        const message = `Error: Passwords do not match`;
        alert(message);
      }
      else{
        setSelectedUser({ ...selectedUser, password: password1 })
        updatedUsers = [...users, selectedUser];
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
    };

    return (
    <Fieldset.Root size="lg" maxW="md">
      <Stack>
        <Fieldset.Legend>Enter</Fieldset.Legend>
      </Stack>

      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Email Address</Field.Label>
          <Input name="email" value={selectedUser.email || ""} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })
              }/>
        </Field.Root>

        <Field.Root>
          <Field.Label>Password</Field.Label>
          <Input name="password" type="password" value={password1} onChange={(e) => setPassword1(e.target.value)}/>
        </Field.Root>

        <Field.Root>
          <Field.Label>Confirm Password</Field.Label>
          <Input name="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
        </Field.Root>

      </Fieldset.Content>

      <Button type="submit" alignSelf="flex-start">
        Submit
      </Button>
    </Fieldset.Root>
  )
}
