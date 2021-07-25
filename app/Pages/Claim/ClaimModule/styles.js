import { StyleSheet } from "react-native";
import { BaseColor } from '@config/color';

export default StyleSheet.create({
    loadingBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    table_header: {
        textAlign: 'center',
        color: 'white',
        padding: 4,
        fontSize: 15
    },
    table_content: {
        textAlign: 'center',
        padding: 8,
    },
})