import {Routes, Route} from "react-router-dom"
import Login from "./login"
import Main from "./main"
import Personal from "./personal"

function Routers() {
    return(
        <Routes>
            <Route path="/login" element={<Login/>} exact/>
            <Route path="/main" element={<Main/>} exact/>
            <Route path="/personal" element={<Personal/>} exact/>
            <Route path="/" element={<Login/>} exact/>
        </Routes>
    );
}

export default Routers