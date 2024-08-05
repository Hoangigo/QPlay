import React from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from "@chakra-ui/react"

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    cancelRef: React.RefObject<HTMLButtonElement>;
    topic: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ isOpen, onClose, onDelete, cancelRef, topic }) => (
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
    >
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete {topic}
                </AlertDialogHeader>

                <AlertDialogBody>
                    Are you sure to proceed? You can't undo this action afterwards. Your {topic} will be deleted permanently.
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="red" onClick={onDelete} ml={3}>
                        Delete {topic} permanently
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
);

export default DeleteConfirmationDialog;
