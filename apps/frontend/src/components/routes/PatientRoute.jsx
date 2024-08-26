// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FIREBASE
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

// COMPONENTS
import { Outlet } from "react-router-dom";
import PatientHeader from "../header/PatientHeader";

// STYLE
import { Box, Spinner } from "@chakra-ui/react";

const PatientRoute = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.loggedInUser);
  const [isLoading, setIsLoading] = useState(true);

  // redirect if user is not logged in
  useEffect(() => {
    onAuthStateChanged(auth, async (authUser) => {
      console.log("user", authUser);

      if (!authUser) {
        navigate("/login");
      }
      setIsLoading(false);
    });
  }, []);

  // redirect if user is not a patient
  useEffect(() => {
    console.log("user", user);

    if (user && user?.role !== "patient") {
      navigate("/login");
    }
  }, [user]);

  return isLoading ? (
    <Spinner
      pos="absolute"
      top="50%"
      right="50%"
      thickness="4px"
      emptyColor="gray.200"
      color="primary.500"
      size="xl"
    />
  ) : (
    <Box h="100vh" overflowX="hidden">
      <PatientHeader />
      <Outlet />
    </Box>
  );
};

export default PatientRoute;
