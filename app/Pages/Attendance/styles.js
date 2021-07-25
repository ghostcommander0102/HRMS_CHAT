import { StyleSheet } from "react-native";
import { BaseColor } from '../../config/color';
export default StyleSheet.create({
    text_title: {
        fontWeight: 'bold',
        padding: 3,
    },
    text_monthly: {
        backgroundColor: BaseColor.colorBlueLight, 
        width: "100%", 
        textAlign: 'center',
        margin: 1,
        fontSize: 13,
        height: 22,
        padding:3,
    },
    loadingBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    }
})