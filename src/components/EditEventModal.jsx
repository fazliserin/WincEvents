import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EventForm } from "../components/EventForm";

export default function EditEventModal({
  isModalOpen,
  setIsModalOpen,
  handleSave,
  event,
}) {
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ height: "auto" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EventForm initialValues={event} onSubmit={handleSave} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
