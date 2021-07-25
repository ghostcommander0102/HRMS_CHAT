import { StyleSheet } from "react-native";
import { BaseColor } from '@config/color';
export default StyleSheet.create({
    receiver: {
        justifyContent: 'flex-start',
        margin: 5
    },
    sender: {
        justifyContent: 'flex-end',
        margin: 5
    },
    text_send: {
        color: 'black', 
        backgroundColor: BaseColor.colorChatSend, 
        borderRadius: 10, 
        borderTopRightRadius: 0,
        marginRight: 5,
        padding: 5,
        fontSize: 16,
    },
    text_receive : {
        color: 'black', 
        backgroundColor: BaseColor.colorChatReceive, 
        borderRadius: 10,
        borderTopLeftRadius: 0,
        paddingRight: 10,
        paddingLeft: 10,
        fontSize: 16
    },
    avatar_send: {
        width: 50, 
        height: 50, 
        borderRadius: 50,
    },
    avatar_receive: {
        width: 50, 
        height: 50, 
        borderRadius: 50, 
        marginRight: 5,
    },
    loadingBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    msg_photo: {
        width: 200, 
        height: 150,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white'
    }
})