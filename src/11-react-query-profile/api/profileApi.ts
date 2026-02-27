import request from "../utils/request";

interface Profile{
    id:string;
    name:string;
    avatarUrl:string;
}

export interface UploadResponse {
    success: boolean;
    newAvatarUrl: string;
}

export const fetchProfile = () => {
    return request.get<any,Profile>('/profile')
}


export const uploadAvatar = (file:File, onProgress:(percent:number) => void) => {
    const fromData = new FormData()
    fromData.append('file',file)
    return request.post<any, UploadResponse>('/porfile/avatar',fromData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress:(progressEvent) => {
            if(progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                onProgress(percent);
            }
        }
    })
    
}

