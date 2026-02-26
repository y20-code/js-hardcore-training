import { useInventoryStore } from "../store/useInventoryStore";

export const BackpackList = () =>{
    const items = useInventoryStore((state) => state.items)
    const clearAll = useInventoryStore(state => state.clearAll)

    return (
        <div>
            {items.length === 0 ? (
                <div>背包空空如也...</div>
            ):(
                <>
                    <ul>
                        {items.map((item,index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <button onClick={clearAll}> 一键丢弃</button>
                </>
            )}
        </div>

    )
}