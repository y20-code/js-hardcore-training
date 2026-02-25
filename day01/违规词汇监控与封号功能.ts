interface ChatMonitor {
    systemName: string;         // 系统名称
    bannedWord: string;         // 重点监控的违规词
    scanMessages: (replaceChar?: string, ...messages: string[]) => { threatCount: number, safeMessages: string[] };
    startPatrol: () => void;
}

const chatMonitor:ChatMonitor ={
    systemName:"天网监控",
    bannedWord:"挂机",
    scanMessages:function(replaceChar="*",...message:string[]){
        const safeMessages = message.filter(item => !item.includes(this.bannedWord))
                                .map((item) => `[${this.systemName}]审核通过:${item}`)

        
        const threatCount = message.length - safeMessages.length

        return {
            threatCount,safeMessages
        }
    },
    startPatrol:function(){
        setTimeout(() =>{
            console.log(`[${this.systemName}]启动完毕，正在严厉打击包含 [${this.bannedWord}] 的发言！”`)
        },1000)
    }
}