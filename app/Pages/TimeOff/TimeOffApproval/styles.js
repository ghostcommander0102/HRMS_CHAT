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
        borderWidth: 0.5,
        padding: 5
    },
    table_content: {
        textAlign: 'center',
        borderWidth: 0.5,
        padding: 5
    },
    btnStyles: {
        backgroundColor: BaseColor.btnColor,
        textAlign: 'center',
        padding: 10,
        margin: 3,
        borderRadius: 5,
        fontWeight: 'bold',
        color: 'white'
    }
})