import { extendTheme } from '@chakra-ui/react';
import "@fontsource/orbitron/400.css";
import "@fontsource/montserrat/400.css";

export const theme = extendTheme({
    colors: {
        purple: {
            50: "#EADBF7",
            100: "#D5B6EF",
            200: "#C090E6",
            300: "#AB6BDE",
            400: "#9605D5",
            500: "#A000DE",
            600: "#8800B8",
            700: "#6F0092",
            800: "#56006D",
            900: "#3D0047"
        },
        yellow: {
            50: "#FEF7D4",
            100: "#FEEBA9",
            200: "#FEDF7E",
            300: "#FED353",
            400: "#FEC728",
            500: "#D7B200",
            600: "#B19300",
            700: "#8B7400",
            800: "#655500",
            900: "#3F3600"
        },
    },
    fonts: {
        heading: 'Orbitron',
        body: 'Montserrat',
    },
});