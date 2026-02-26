import React from "react"
interface QuestCardProps {
    quest: { id: number, title: string, reward: number };
    onAccept: (id: number) => void;
}


export const QuestCard = React.memo(({quest,onAccept}:QuestCardProps) =>{



    return (
        <div style={{
                width:200,
                height:150,
                border:'1px solid black',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
        >   
            <span>任务标题:{quest.title}</span>
            <span>赏金:{quest.reward}</span>
            <button onClick={() => onAccept(quest.id)}>接取任务</button>

        </div>
    )
})

