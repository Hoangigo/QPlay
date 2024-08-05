import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import HostChangePasswordForm from "./HostChangePasswordForm";

interface HostChangePasswordProps {
    isOpen: boolean,
    onClose: () => void,
};

const HostChangePassword = ({ isOpen, onClose }: HostChangePasswordProps) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Change password</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxH={"max-content"}>
                    <Flex direction="column" width="full" align="center" justifyContent="center">
                        <HostChangePasswordForm onClose={onClose} />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default HostChangePassword;