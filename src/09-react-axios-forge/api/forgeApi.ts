import request from '../utils/request'

export interface MaterialItem {
    id:string;
    name:string;
    count:number;
    rarity:string;
}

interface FetchMaterialsResponse{
    total:number;
    list:MaterialItem[]
}

interface EnhanceRequestPayload{
    equipmentId:string;
    materialIds:string[];
    safeMode:boolean;
}

interface EnhanceResponse{
    success:boolean;
    newLevel:number;
    currentDurability:number;
}

export const fetchMaterials = (page:number,rarity?:string) =>{
    return request.get<any,FetchMaterialsResponse>('/forge/materials',{
        params:{
            page,
            rarity
            
        }
    })
}

export const enhanceEquipment = (data:EnhanceRequestPayload) => {
    return request.post<any,EnhanceResponse>('/forge/enhance',data)
}