import React from "react"

interface BlueprintProps{
    blueprint: { id: number, name: string, type: string, price: number }
    onForge: (price: number) => void
}

export const BlueprintCard = React.memo(({blueprint,onForge} :BlueprintProps) => {



    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px'}}>
                <span>装备名称{blueprint.name}</span>
                <span>装备{blueprint.type}</span>
                <span>锻造价格{blueprint.price}💰</span>
            </div>
            <button onClick={() => onForge(blueprint.price)}>锻造</button>
        </div>
    )
})