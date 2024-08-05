import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { QRCode } from 'react-qrcode-logo';
import logo from "../../assets/qplay-logo.png"
interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

const QRModal = ({ isOpen, onClose, url }: QRCodeModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
            <ModalOverlay />
            <ModalContent>
                <QRCode value={url}
                    fgColor="#A000DE"
                    bgColor="#E1C744"
                    quietZone={25}
                    qrStyle="dots"
                    size={700}
                    ecLevel="H"
                    logoImage={logo}
                    logoWidth={266}
                    logoHeight={96}
                    removeQrCodeBehindLogo={true}
                    logoPadding={10}
                    eyeRadius={10}
                />
            </ModalContent>
        </Modal>
    );
};

export default QRModal;
