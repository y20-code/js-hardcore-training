import request from "../utils/request";

export interface Monster {
    id: number;
    name: string;
    hp: number;
}

export const fetchMonster = (region:string) => {
    return request.get<any,Monster[]>('/monsters',{
        params:{
            region
        }
    })
}

export const reportMonster = (monsterData:string) => {
    return request.post('/monsters/report',monsterData)
}

