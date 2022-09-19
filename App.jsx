import {useState} from 'react'
import Web3 from 'web3'
import {BrowserRouter as Router} from 'react-router-dom'
import {ABI} from './abi'
import {Context} from './context'
import Routers from './routers'

function App() {
  const [web3] = useState(new Web3('http://127.0.0.1:8545'))
  const Address = '0xF795Ed4A5d606788F8f6194de922b6caC6167Ce3'
  const [Contract] = useState(new web3.eth.Contract(ABI, Address))
  
  return(
    <Router>
      <Context.Provider value={{web3,Contract}}>
        <Routers/>
      </Context.Provider>
    </Router>
  )
}

export default App