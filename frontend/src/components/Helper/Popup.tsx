import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text
} from '@chakra-ui/react'

interface PopupProps {
    title: string;
    text: string;
    buttonText: string;
}

const Popup = ({ title, text, buttonText }: PopupProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>{text}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost' colorScheme='purple'>{buttonText}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Popup;