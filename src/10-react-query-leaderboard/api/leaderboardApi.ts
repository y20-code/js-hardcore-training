import request from "../utils/request";

export interface Player{
    id:string;
    name:string;

}

export const fetchLeaderboard = () => {
    return request.get<any,Player[]>('/leaderboard')
}