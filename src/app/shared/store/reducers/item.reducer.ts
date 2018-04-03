import { Item } from '../../models/eav/item';
import * as fromItems from './../actions/item.actions';
import { AppState } from '../../models/app-state';
import { EavHeader } from '../../models/eav';
import { AttributesState } from './attribute.reducer';

// export interface ItemState {
//     items: Array<{
//         header: EavHeader,
//         entity: {
//             id: number,
//             version: string,
//             guid: string,
//             type: string,
//             attributes: AttributesState,
//             owner: string,
//             metadata: any[],
//         }
//     }>;
// }

// export const initialState: ItemState = {
//     items: []
// };

export interface ItemState {
    items: Item[];
}

export const initialState: ItemState = {
    items: []
};

export function itemReducer(state = initialState, action: fromItems.Actions): ItemState {
    switch (action.type) {
        case fromItems.LOAD_ITEM_SUCCESS: {
            console.log('loadsucess item: ', action.newItem);
            return {
                ...state,
                ...{ items: [...state.items, action.newItem] }
            };
        }
        case fromItems.UPDATE_ITEM: {
            console.log('action.attributes', action.attributes);
            return {
                ...state,
                ...{
                    items: state.items.map(item => {
                        return item.entity.id === action.id
                            ? {
                                ...item,
                                // header: { ...item.header },
                                entity: {
                                    ...item.entity,
                                    // id: item.entity.id,
                                    // version: item.entity.version,
                                    // guid: item.entity.guid,
                                    // type: { ...item.entity.type },
                                    attributes: { ...action.attributes },
                                    // owner: item.entity.owner,
                                    // metadata: [...item.entity.metadata],
                                }
                            }
                            : item;
                    })
                }
            };
        }
        case fromItems.DELETE_ITEM:
            return {
                ...state,
                ...{
                    items: state.items.filter(item => item.entity.id !== action.item.entity.id)
                }
            };
        default: {
            return state;
        }
    }
}

export const getItems = (state: ItemState) => state.items;
