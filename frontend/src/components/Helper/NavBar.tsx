import { Box, Flex, useBreakpointValue, IconButton, Menu, MenuButton, MenuList, MenuItem, Tooltip } from '@chakra-ui/react';
import { ArrowLeft, LogOut as FiLogOut } from 'react-feather';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";
import { useEffect } from 'react';
import axios from 'axios';

export const HOST_TAB_INDEX = 1; // 0: Host data, 1: Create event, 2: Show events
const NavBar = () => {
    const isMobileMenu = useBreakpointValue({ base: true, lg: false });
    const navigate = useNavigate();
    const cookies = new Cookies();
    const location = useLocation();

    useEffect(() => {
        if (cookies.get('jwt_token') != undefined) {

            axios.defaults.headers.common = { 'Authorization': `Bearer ${cookies.get('jwt_token')}` }
        }
    }, []);


    const handleButtonClick = (route: string) => {
        navigate(route);
    };

    const handleLogout = () => {
        cookies.remove('jwt_token', { path: '/' });
        cookies.remove('email', { path: '/' });


        handleButtonClick("/login");
    };

    const areCookiesSet = cookies.get('jwt_token') && cookies.get('email')

    return (
        areCookiesSet && (
            <Flex m={8} justifyContent={"flex-end"} alignItems={"center"}>
                <Box>
                    {isMobileMenu ? (
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={isMobileMenu ? <HamburgerIcon /> : <CloseIcon />}
                                variant="outline"
                            />
                            <MenuList>
                                <MenuItem onClick={() => handleButtonClick(`/host-dashboard/${HOST_TAB_INDEX}`)}>Host Dashboard</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Flex >
                            {
                                location.pathname.startsWith("/event-dashboard/") &&
                                <Flex left={0} position={"absolute"} ml={"4"}>
                                    <Tooltip label="Back to host dashboard" aria-label="Back to host dashboard" bg={'purple.500'} color={"white"} fontSize={"lg"}>
                                        <IconButton aria-label="Back to dasboard" icon={<ArrowLeft />} colorScheme='purple' mr={6} onClick={() => handleButtonClick(`/host-dashboard/${HOST_TAB_INDEX}`)} />
                                    </Tooltip>
                                </Flex>
                            }
                            <Flex right={0} position={"absolute"} ml={"4"}>
                                <Tooltip label="Logout" aria-label="Logout" bg={'red.300'} color={"white"} fontSize={"lg"}>
                                    <IconButton aria-label="Logout" icon={<FiLogOut />} colorScheme='red' mr={6} onClick={handleLogout} />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    )}
                </Box>
            </Flex>
        )
    );
};

export default NavBar;
