import React from "react";
import { useToast, useDisclosure } from "@chakra-ui/react";
import { Text, Heading, Image, Tag, Box, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import "../style.css";
import { useState, useRef } from "react";
import AlertBox from "../components/AlertBox";
import EditEventModal from "../components/EditEventModal";
import moment from "moment";

export const loader = async ({ params }) => {
  const eventUrl = `http://localhost:3000/events/${params.eventId}`;
  const usersUrl = "http://localhost:3000/users";
  const categoriesUrl = "http://localhost:3000/categories";

  const [eventResponse, usersResponse, categoriesResponse] = await Promise.all([
    fetch(eventUrl),
    fetch(usersUrl),
    fetch(categoriesUrl),
  ]);

  const event = await eventResponse.json();
  const users = await usersResponse.json();
  const categories = await categoriesResponse.json();

  return { event, users, categories };
};

export const EventPage = () => {
  const { event, users, categories } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await fetch(`http://localhost:3000/events/${params.eventId}`, {
      method: "DELETE",
    });

    navigate("/");
    onClose();
    toast({
      title: "Event was Successfully Deleted.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const handleSave = async (values) => {
    try {
      const { categoryIds, ...rest } = values;
      await fetch(`http://localhost:3000/events/${params.eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          categoryIds: categoryIds,
          createdBy: parseInt(values.createdBy),
        }),
      });
      navigate("/");
      toast({
        title: "Event Updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error occurred.",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div className="event-page-container">
      <Box>
        <div className="event-page-hero">
          <Image src={event.image} alt={event.title} />
        </div>
        <div className="event-hero-text">
          <div className="event-page-hero-card-top"></div>
          <div className="event-hero-text-a">
            <Heading color="orange.500">{event.title}</Heading>

            <Text mb="1rem">{event.description}</Text>

            <Text mt=".5rem">
              {categories
                .filter(
                  (category) =>
                    event.categoryIds && event.categoryIds.includes(category.id)
                )
                .map((category, index, arr) => {
                  const isLast = index === arr.length - 1;
                  const color = isLast ? "green" : "blue";
                  return (
                    <Tag
                      size="lg"
                      colorScheme={color}
                      variant="outline"
                      key={category.id}
                      mr=".5rem"
                    >
                      {category.name}
                    </Tag>
                  );
                })}
            </Text>
          </div>
          <div className="event-page-text-sections">
            <div>
              <Text fontSize="xl" as="b">
                Start Time:
              </Text>
              <Text>
                {moment(event.startTime).format("MMM Do YYYY, h:mm a")}
              </Text>
              <Text fontSize="xl" as="b">
                End Time:
              </Text>
              <Text>
                {moment(event.startTime).format("MMM Do YYYY, h:mm a")}
              </Text>
            </div>
            <div>
              <div className="event-page-creator">
                <Text color="gray.500">Creator:</Text>
                {users.map((user) => {
                  if (user.id === event.createdBy) {
                    return (
                      <React.Fragment key={user.id}>
                        <Image
                          boxSize="110px"
                          borderRadius={"full"}
                          src={user.image}
                          alt={user.name}
                        />
                        <Text>{user.name}</Text>
                      </React.Fragment>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <div className="event-page-icons">
            <IconButton
              mt="1rem"
              aria-label="Edit"
              size="md"
              icon={<EditIcon />}
              colorScheme="green"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            ></IconButton>

            <IconButton
              mt="1rem"
              mb="1rem"
              colorScheme="red"
              variant="outline"
              onClick={onOpen}
              aria-label="Delete"
              size="md"
              icon={<DeleteIcon />}
            ></IconButton>

            <IconButton
              as={Link}
              to="/"
              colorScheme="teal"
              aria-label="Go Back"
              size="md"
              icon={<ArrowBackIcon />}
              variant="outline"
            />
          </div>
        </div>
        <AlertBox
          isOpen={isOpen}
          handleDelete={handleDelete}
          cancelRef={cancelRef}
          onClose={onClose}
        />
      </Box>
      <EditEventModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSave={handleSave}
        event={event}
      />
    </div>
  );
};
