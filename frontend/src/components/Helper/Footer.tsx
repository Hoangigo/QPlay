import { Box, Link, Stack, Text } from '@chakra-ui/react';
import ThemeToggler from './ThemeToggler';

const Footer = () => {
    return (
        <Box as="footer" role="contentinfo" mx="auto" m="4" px={{ base: '4', md: '8' }}>
            <Stack>
                <Text fontSize="sm" align="center">
                    © 2023 Qplay. All rights reserved.
                </Text>
                <Stack direction="row" spacing="4" align="center" justify="center">
                    <Link href="/terms" fontSize="sm">
                        Terms
                    </Link>
                    <Link href="/privacy" fontSize="sm">
                        Privacy
                    </Link>
                    <Link href="/about" fontSize="sm">
                        About
                    </Link>
                    <ThemeToggler />
                </Stack>

            </Stack>
        </Box>
    );
};

export default Footer;
