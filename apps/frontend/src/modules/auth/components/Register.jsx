// REACT
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

// REDUX
import { useDispatch } from "react-redux";

// FIREBASE
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { validateEmail } from "@/utils";

// FUNCTIONS
import { registerUser } from "@/modules/auth/functions/auth";

//  COMPONENTS
import Logo from "@/components/Logo";
import { NavLink } from "react-router-dom";

// STYLE
import {
  Flex,
  Input,
  Button,
  Heading,
  Text,
  Link,
  Select,
} from "@chakra-ui/react";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateEmail(email)) {
        throw new Error("Invalid Email");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await sendEmailVerification(user);

      toast({
        title: "Verification email sent! Please check your inbox.",
        status: "info",
        duration: null,
        isClosable: true,
      });

      await registerUser({
        role,
        email,
      });

      setLoading(false);
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Flex
      as="form"
      w="325px"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={12}
      onSubmit={handleSubmit}
    >
      <Flex cursor="pointer" onClick={() => navigate("/")}>
        <Logo w="280px" />
      </Flex>
      <Flex
        gap="6px"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="lg">Join Us Now!</Heading>
        <Text color="darkgray">Welcome! Please create your account</Text>
      </Flex>
      <Flex w="100%" direction="column" gap={2}>
        <Input
          focusBorderColor="primary.500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          autoFocus
          size="md"
          mt={2}
        />

        <Input
          focusBorderColor="primary.500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password"
          size="md"
        />
        <Flex w="100%" gap={4} alignItems="center">
          <Text flexWrap="nowrap" whiteSpace="nowrap">
            You are a{" "}
          </Text>
          <Select
            size="sm"
            focusBorderColor="primary.500"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </Select>
        </Flex>
        <Flex direction="column" gap={2} w="100%">
          <Button
            type="submit"
            isDisabled={!email || password.length < 6}
            isLoading={loading}
            colorScheme="primary"
            size="sm"
            _hover={{
              opacity: email && password.length >= 6 && "0.8",
            }}
          >
            Register
          </Button>
        </Flex>
      </Flex>

      <Flex fontSize="sm">
        <Text color="gray" mr={1}>
          Already have an account?
        </Text>
        <Link
          as={NavLink}
          to="/auth/login"
          color="primary.500"
          fontWeight="semibold"
          _hover={{ textDecoration: "underline" }}
        >
          Login
        </Link>
      </Flex>
    </Flex>
  );
};

export default Register;
