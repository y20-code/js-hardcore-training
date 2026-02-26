import {useEffect,useState} from "react"

import { BlueprintCard } from "./components/BlueprintCard"
import { useShopStore } from "./store/useShopStore"

interface BlueprintItem {
    id:number;
    name:string;
    type:string;
    price:number;
}
const Blacsmith = () =>{    

    const [blueprints,setBlueprints] = useState<BlueprintItem[]>([])
    const [filterType, setFilterType] = useState<string>('全部')

    const gold = useShopStore(state => state.gold);
    const spendGold = useShopStore(state => state.spendGold);


    useEffect(() => {
        const a = setTimeout(() =>{
            setBlueprints([{id: 1, name: "铁剑", type: "武器", price: 200}, {id: 2, name: "皮甲", type: "防具", price: 150}, {id: 3, name: "斩骨刀", type: "武器", price: 800}])
        },1500)

        return () => clearTimeout(a)
    },[])

    
    const filteredBlueprints = filterType === '全部' 
        ? blueprints
        :blueprints.filter(item => item.type === filterType)

    return(
        <div>

            <div>当前金币:💰{gold}</div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setFilterType('全部')}>显示全部</button>
                <button onClick={() => setFilterType('武器')}>只看武器</button>
                <button onClick={() => setFilterType('防具')}>只看防具</button>
            </div>
            {blueprints.length === 0 ? (
                <div>店主正在进货中...(加载中)</div> 
            ) : (
                filteredBlueprints.map(item => 
                    <BlueprintCard 
                        key={item.id} 
                        blueprint={item}
                        onForge={spendGold} 
                    />
                )
            )}
        </div>
    )
}

export default Blacsmith