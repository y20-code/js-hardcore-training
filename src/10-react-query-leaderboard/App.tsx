import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import Leaderboard from './components/Leaderboard'

const queryClient = new QueryClient()

const App = () => { 
    return (
        <QueryClientProvider client={queryClient}>
            
            <Leaderboard/>
        </QueryClientProvider>
    )
}