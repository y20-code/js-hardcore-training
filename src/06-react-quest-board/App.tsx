import { useEffect, useState } from "react";
import { useQuestStore } from "./store/useQuestStore";
import { QuestCard } from "./components/QuestCard";

const App = () =>{
    const quests = useQuestStore(state => state.quests);
    const setQuests = useQuestStore(state => state.setQuests);
    const removeQuest = useQuestStore((state => state.removeQuest));

    const [searchInput,setSearchInput] = useState('')

    useEffect(() =>{
        const a = setTimeout(() =>{
            setQuests([{id: 1, title: "击杀史莱姆", reward: 100}, 
                        {id: 2, title: "护送商人", reward: 500}, 
                        {id: 3, title: "清理地精营地", reward: 300}])

        },1000)

        return () => clearTimeout(a)
    },[])

    const filteredQuests = quests.filter(item => item.title.includes(searchInput))

    return (
        <div>
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            
            <div>
                {
                    filteredQuests.map((item) => (
                        <QuestCard 
                            key={item.id}
                            quest={item}
                            onAccept={removeQuest}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default App;