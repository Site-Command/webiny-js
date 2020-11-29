import { MutationActionCallable } from "@webiny/app-page-builder/editor/recoil/eventActions";
import { UiAtomType } from "@webiny/app-page-builder/editor/recoil/modules";

export const enableDraggingMutation: MutationActionCallable<UiAtomType> = state => {
    return {
        ...state,
        isDragging: true
    };
};
