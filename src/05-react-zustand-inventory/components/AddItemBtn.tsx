import { useInventoryStore } from "../store/useInventoryStore";

export const AddItemBtn = () => {
    const addItem = useInventoryStore((state) => state.addItem);

    return (
        <div>
            <button onClick={() => addItem("破败王者之刃")}>锻造一把大剑</button>
        </div>
    )
}