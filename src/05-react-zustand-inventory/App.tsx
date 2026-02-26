import { AddItemBtn } from "./components/AddItemBtn";
import { BackpackList } from "./components/BackpackList";

const App = () =>{
    return (
        <div style={{ 
                width:'100vh',
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                marginTop: "50px",
                height:'100vh',
                gap: "20px"
                }}>
            <AddItemBtn/>
            <BackpackList/>
        </div>

    )
}

export default App