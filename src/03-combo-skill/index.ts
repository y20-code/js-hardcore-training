interface ComboSkill {
    skillName: string;         // 技能名字
    damageList: number[];      // 记录每一次连击的伤害值数组
    addHits: (...hits: number[]) => void;         // 动作：追加连击伤害
    calculateTotal: (baseDamage?: number) => number; // 动作：计算总伤害
}

const  createCombo = (name:string):ComboSkill => {
    return {
        skillName:name,
        damageList:[],
        addHits:function(...hits:number[]){
            this.damageList.push(...hits)
        },
        calculateTotal:function(baseDamage=50){
            return this.damageList.reduce((sum,item) => sum+item,0) + baseDamage
        }
    }
}