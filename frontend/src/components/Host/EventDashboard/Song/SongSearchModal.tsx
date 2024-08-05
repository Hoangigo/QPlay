import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, Box, Flex, useColorMode } from "@chakra-ui/react";
import { SongSchema } from "../../../../Types/SongSchema";
import Song from "./Song";
import { useState } from "react";
import { fetchSongs } from "../../../../APIRoutes";

interface SongSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (song: SongSchema) => void;
}

const SongSearchModal = ({ isOpen, onClose, onSelect }: SongSearchModalProps) => {
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<SongSchema[]>([]);
    const { colorMode } = useColorMode();

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setSearch(searchTerm);

        const fetchedSongs: SongSchema[] = await fetchSongs(searchTerm, 20);

        setResults(fetchedSongs);
    };

    const onSongClick = (song: SongSchema) => {
        onSelect(song);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select a Song</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxH={"max-content"}>
                    <Input placeholder="Search songs..." _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }} value={search} onChange={handleSearch} mb={"4"} />
                    <Flex direction={"column"}>
                        {results.map((song, i) => (
                            <Box key={i} onClick={() => onSongClick(song)} cursor={"pointer"} mb={"1"}>
                                <Song {...song} isSelected={false} />
                            </Box>
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SongSearchModal;
