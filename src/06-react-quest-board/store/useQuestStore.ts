import {create} from 'zustand'
interface Quest {
    id:number;
    title:string;
    reward:number;
}

interface QuestState {
    quests: Quest[];
    setQuests: (newQuests: Quest[]) => void; // 动作：初始化/覆盖任务列表
    removeQuest: (id: number) => void;       // 动作：玩家接取后，从列表中剔除该任务
}

export const useQuestStore = create<QuestState>((set) => ({
    quests:[],
    setQuests:(newQuests:Quest[]) => {
        set({quests:newQuests})
    },
    removeQuest:(id:number) => {
        set((state) => ({
            quests: state.quests.filter((item) => item.id !== id)
        }))
    }

}))

