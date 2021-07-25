import { StyleSheet } from "react-native";
import { BaseColor } from '../../config/color';
export default StyleSheet.create({
    home_items: {
        backgroundColor: BaseColor.whiteColor,
        flex: 0.4,
        borderColor: BaseColor.colorBlue,
        borderWidth: 2,
        borderRadius: 5,
        alignItems: 'center',
        margin: 5,
        padding: 10
    },
    item_image : {
        flex: 1, justifyContent: 'flex-end'
    },
    item_text: {
        flex: 1, justifyContent: 'center'
    }
})