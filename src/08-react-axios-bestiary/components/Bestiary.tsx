import { useState,useEffect } from "react";
import { fetchMonster } from "../api/monsterApi";

interface Monster {
    id: number;
    name: string;
    hp: number;
}

const Beatiary = () => {
    const [monsters,setMonsters] = useState<Monster[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(() => {
        const loadData = async () =>{
            try{
                const res =  await fetchMonster('森林')
                setMonsters(res)
            }catch(err){
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    // 如果后端直接抛了个字符串或者数字，我们给个兜底
                    setError("发生了未知网络错误");
                }
            }finally{
                setLoading(false)
            }
        };

        loadData()
    },[])

    if (loading) {
        return <div>⏳ 正在翻阅图鉴...</div>;
    }


    if (error) {
        return <div style={{color: 'red'}}>❌ 糟糕：{error}</div>;
    }

    return (
        <ul>
            {monsters.map((item) => (
                <li key={item.id}>{item.name} - HP: {item.hp}</li>
            ))}
        </ul>
    );
}