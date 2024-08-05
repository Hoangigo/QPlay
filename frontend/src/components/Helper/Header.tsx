import { Flex, Image } from "@chakra-ui/react";
import logo from "../../assets/qplay-logo.png"

const Header = () => {
    return (
        <Flex>
            <Flex justifyContent="center" flex="25" mt={"10"} mb={"6"}>
                <Image src={logo} alt="logo" width="xl" />
            </Flex>
        </Flex >
    );
};

export default Header;