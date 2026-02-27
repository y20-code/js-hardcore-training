import {useQuery} from '@tanstack/react-query'
import {fetchLeaderboard,type Player} from '../api/leaderboardApi'

const Leaderboard = () => {
    const {data,isLoading,isError,error} = useQuery({
        queryKey:['leaderboard'],
        queryFn:fetchLeaderboard
    })

    if(isLoading) return <div>🏆 正在拉取全服榜单...</div>
    if(isError)  return <div style={{color: 'red'}}>❌ 榜单加载失败：{error.message}</div>

    return (
        <div>
            {data?.map((item) =>(
                <li key={item.id}>{item.name}</li>
            ))}
        </div>
    )
}

export default Leaderboard