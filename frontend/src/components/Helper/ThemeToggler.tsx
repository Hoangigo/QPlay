import { useColorMode, IconButton, HStack } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const ThemeToggler = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <HStack display={"flex"} justifyContent={"center"}>
            <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
            />
        </HStack>
    );
}

export default ThemeToggler;
