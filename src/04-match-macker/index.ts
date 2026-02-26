class MatchMaker {

    static serverStatus: string = "运行中"; 
    
    playerQueue: string[];

    constructor(initialPlayers: string[] = []) {
        this.playerQueue = initialPlayers;
    }

    joinQueue(playerName: string): void {
        this.playerQueue.push(playerName);
    }

    startMatch(): [string, string] | null {
        if(this.playerQueue.length<2){
            console.log("匹配失败:人数不足")
            return null
        }

        const player1 = this.playerQueue.shift()!;
        const player2 = this.playerQueue.shift()!;

        return [player1, player2];
    }
}