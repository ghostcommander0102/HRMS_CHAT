import { StyleSheet } from "react-native";
import { BaseColor } from '@config/color';
export default StyleSheet.create({
    textinput: {
        padding: 0,
        paddingLeft: 5,
        paddingRight: 5,
        width: "100%",
        marginRight: 20,
        marginLeft: 20,
        marginTop: 15,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 17,
        backgroundColor: "white"
    },
    footer: {
        flex: 1,
        alignItems: 'center',
    },
    txtLogin: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    btnLogin: {
        backgroundColor: BaseColor.btnColor,
        height: 50,
        width: "100%",
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    loadingView: {
        position: 'absolute',
        width: "100%",
        height: "120%",
        opacity: 0.5,
        backgroundColor: 'white',
        zIndex: 100
    },
    loadingBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    }
});
