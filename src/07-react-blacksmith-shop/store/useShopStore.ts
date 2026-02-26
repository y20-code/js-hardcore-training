import {create} from 'zustand';

interface ShopStore {
    gold:number;
    spendGold:(cost:number) =>void;

}

export const useShopStore = create<ShopStore>((set,get) => ({
    gold:1000,
    spendGold:(cost) => {
        if(cost <= get().gold){
            set(state => ({gold:state.gold - cost}))
        }else{
            alert("金币不足！")
        }
        
    }
}))