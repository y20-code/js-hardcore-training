import {create} from 'zustand'

interface InventoryState{
    items:string[];
    addItem:(newItem:string) => void;
    clearAll:() => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
    items:[],
    addItem:(newItem:string) => {
        set((state) => ({items:[...state.items,newItem]}))
    },
    clearAll:()=>{
        set({ items: [] });
    }
}))