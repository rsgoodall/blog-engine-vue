
import { useToastController, type ColorVariant } from 'bootstrap-vue-next';
const {show} = useToastController();
/**
 * Toast Message
 */
export function toastMessage(type: any, message: string) {
    console.log("toastMessage");
    // show?.({props: {
    //     body: message,
    //     variant: type,
    //     bodyClass: "text-center"
    // }})
    show?.({
        props: {
            title: "Title",
            value: true,
            variant: "success" as ColorVariant,
            pos: 'bottom-center'
        }
    })
}