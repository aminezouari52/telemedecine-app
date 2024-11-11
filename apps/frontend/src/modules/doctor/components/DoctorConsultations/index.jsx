// HOOKS
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";

// FUNCTIONS
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";
import { DateTime } from "luxon";

// STYLE
import {
  Box,
  Button,
  Heading,
  ListItem,
  Card,
  CardBody,
  Flex,
  Text,
  Icon,
  Divider,
  UnorderedList,
  Stack,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";

// ASSETS
import AllConsultationsModal from "./AllConsultationsModal";
import ConsultationCard from "./ConsultationCard";

const DoctorConsultations = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  const loadConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    setConsultations(consultationsData.filter((c) => c.status === "pending"));
  };

  useEffect(() => {
    if (user) {
      loadConsultations();
    }
  }, [user]);

  const sortedUpcomingConsultations = () => {
    return consultations?.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  return (
    <>
      <AllConsultationsModal
        consultations={consultations}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Flex justifyContent="space-around" p={12}>
        <Box w="40%">
          <Flex alignItems="center" justifyContent="space-between" py={5}>
            <Heading size="md">Consultations à venir</Heading>
            {!(consultations?.length > 2) && (
              <Button
                size="xs"
                colorScheme="secondary"
                _hover={{ opacity: "0.8" }}
                onClick={onOpen}
              >
                Voir tous
              </Button>
            )}
          </Flex>
          {!sortedUpcomingConsultations()?.length && (
            <div>vous n'avez pas de consultations</div>
          )}

          <Stack spacing={6}>
            {sortedUpcomingConsultations()
              ?.slice(0, 2)
              .map((consultation) => (
                <ConsultationCard consultation={consultation} />
              ))}
          </Stack>
        </Box>

        <Box w="50%">
          <Flex alignItems="center" justifyContent="space-between" py={5}>
            <Heading size="md">Prôchaine consultation</Heading>
          </Flex>
          <Card>
            <CardBody>
              <Flex justifyContent="space-between" pb={4} gap={4}>
                <Flex flexDirection="column" gap={2}>
                  <Text fontWeight="bold">
                    {sortedUpcomingConsultations()[0]?.patient?.firstName}{" "}
                    {sortedUpcomingConsultations()[0]?.patient?.lastName}
                  </Text>
                  <Flex alignItems="center" gap={2}>
                    <Icon as={FaMapPin} color="red.500" />
                    <Text>
                      {sortedUpcomingConsultations()[0]?.patient?.address}
                    </Text>
                  </Flex>
                </Flex>
                <Divider ml={6} orientation="vertical" />
                <Flex alignItems="center" gap="20px">
                  <Flex fontSize="12px" flexDirection="column">
                    <Flex>
                      <Text mr={2} color="gray">
                        Date:{" "}
                      </Text>

                      <Text>
                        {DateTime.fromJSDate(
                          new Date(sortedUpcomingConsultations()[0]?.date)
                        ).toFormat("dd-MM-yyyy")}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text mr={2} color="gray">
                        Heure:{" "}
                      </Text>
                      <Text>
                        {DateTime.fromJSDate(
                          new Date(sortedUpcomingConsultations()[0]?.date)
                        ).toFormat("HH:mm")}
                      </Text>
                    </Flex>
                  </Flex>
                  <Icon as={CalendarIcon} color="gray.500" />
                </Flex>
              </Flex>
              <Box>
                <Text color="gray" fontWeight="bold">
                  Details
                </Text>
                <UnorderedList fontSize="smaller" p={2}>
                  <ListItem>
                    <strong>Téléphone:</strong>{" "}
                    {sortedUpcomingConsultations()[0]?.patient?.phone}
                  </ListItem>
                  <ListItem>
                    <strong>Age:</strong>{" "}
                    {sortedUpcomingConsultations()[0]?.patient?.age}
                  </ListItem>
                  <ListItem>
                    <strong>Poids: </strong>
                    {sortedUpcomingConsultations()[0]?.patient?.weight}kg
                  </ListItem>
                </UnorderedList>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </>
  );
};

export default DoctorConsultations;