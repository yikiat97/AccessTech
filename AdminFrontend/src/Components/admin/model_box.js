import { 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from '@chakra-ui/react';

export default function TransitionExample({ isOpen, onClose, title, message, secondaryAction }) {
    return (
        <>
            <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {message}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {secondaryAction && <Button variant='ghost'>{secondaryAction}</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
