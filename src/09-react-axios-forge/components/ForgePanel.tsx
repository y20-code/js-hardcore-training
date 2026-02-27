import { useState,useEffect } from "react";
import {fetchMaterials,enhanceEquipment,type MaterialItem} from "../api/forgeApi"


const ForgePanel = () =>{
    const [materials,setMaterials] = useState<MaterialItem[]>([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState('')

    useEffect(() =>{
        const initData = async() => {
            try{
                const fetch = await fetchMaterials(1)
                setMaterials(fetch.list)
            }catch(err){
                if(err instanceof Error){
                    setError(err.message)
                }else{
                    setError('未知错误')
                }  
            }finally{
                setLoading(false)
            }
        }

        initData()
    },[])

    if(loading){
        return <div>🔥 熔炉预热中...</div>
    }

    if(error.length !== 0 ){
        return <div style={{color: 'red'}}>❌ 炉火熄灭：{error}</div>
    }

    return (
        <div>
            {materials.map((item) =>
                <li key={item.id}>{item.name} (数量: {item.count})</li>
            )}
        </div>
    )
}

export default ForgePanel;