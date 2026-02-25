interface ForgeSystem{
    smithName:string;
    shopLevel:number;
    upgradeWeapon:(atack:number,cost?:number,...energy:number[]) => {finalAttack:number,cost:number};
    broadcastAd: () => void;
}

const forgeSystem:ForgeSystem = {
    smithName:"欧冶子",
    shopLevel:1,
    upgradeWeapon:function(atack:number,cost=50,...energy:number[]){

        const totalEnergy = energy.reduce((sum,item) => sum + item,0)
        const finalAttack =  atack + totalEnergy + (this.shopLevel * 10)
        return  {
            finalAttack,
            cost
        }
    },
    broadcastAd:function(){
        setTimeout(() =>{
            console.log(`我是${this.smithName},我的铁匠铺目前是${this.shopLevel}级,欢迎来打造神器`)
        },2000)
    }
} 


// 测试 1：玩家拿一把 100 攻击的剑，没传手续费，放了三块材料（10, 20, 30 能量）
const weaponCard = forgeSystem.upgradeWeapon(100, undefined, 10, 20, 30);
console.log("锻造结果：", weaponCard);

// 测试 2：触发打广告
forgeSystem.broadcastAd();
// 预期：安静 2 秒后，突然打印：“我是 欧冶子，我的铁匠铺目前是 1 级，欢迎来打造神器！”