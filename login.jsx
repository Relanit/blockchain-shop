import {useState} from 'react'
import {UseContext} from './context'
import {useNavigate} from 'react-router-dom'
import Web3 from 'web3'
import './login.css'

function Login() {
    const navigate = useNavigate()
    const {web3, Contract} = UseContext()
    const [login, setLogin] = useState()
    const [FIO, setFIO] = useState()
    const [password, setPassword] = useState()

    async function signUp(e) {
        e.preventDefault()
        let signupButon = document.querySelector(".login__signup__button")
        signupButon.textContent = "Подождите..."
        signupButon.disabled = true

        const address = await web3.eth.personal.newAccount(password)
        const accounts = await web3.eth.getAccounts()
        try {
            await web3.eth.personal.unlockAccount(accounts[0], "123")
            const passwordHash = Web3.utils.keccak256(password)
            await Contract.methods.signUp(address, passwordHash, login, FIO).send({from: accounts[0]})
            await web3.eth.sendTransaction({
                from: accounts[0],
                to: address,
                value: 50*10**18
            });
            alert(`Регистрация прошла успешно.`)
            toLogin()
        }
        catch(e) {
            alert(e)
        }

        signupButon.disabled = false
        signupButon.textContent = "Зарегистрироваться"
        e.target.reset()
    }

    async function logIn(e) {
        e.preventDefault()
        let loginButton = document.querySelector(".login__login__button")
        loginButton.textContent = "Подождите..."
        loginButton.disabled = true

        const accounts = await web3.eth.getAccounts()
        await web3.eth.personal.unlockAccount(accounts[0], "123")
        try {
            const passwordHash = Web3.utils.keccak256(password)
            await Contract.methods.logIn(login, passwordHash).send({from: accounts[0]})
            let user = await Contract.methods.users(login).call()
            let address = user['addr']
            await web3.eth.personal.unlockAccount(address, password, 9999)
            web3.eth.defaultAccount = address
            sessionStorage.setItem("address", address)
            sessionStorage.setItem("login", login)
            navigate('/main')
        }
        catch(e) {
            alert(e)
        }

        let pass = document.querySelector(".password")
        pass.value = null

        loginButton.disabled = false
        loginButton.textContent = "Войти"
    }

    async function toLogin() {
        let signup = document.querySelector(".login__signup")
        signup.style.display = 'none'
        let login = document.querySelector(".login__login")
        login.style.display = 'block'

        let signupTab = document.querySelector('.login__tabs__signup');
        signupTab.classList.remove('checked')
        let loginTab = document.querySelector('.login__tabs__login');
        loginTab.classList.add('checked')
    }

    async function toSignup() {
        let login = document.querySelector(".login__login")
        login.style.display = 'none'
        let signup = document.querySelector(".login__signup")
        signup.style.display = 'block'

        let loginTab = document.querySelector('.login__tabs__login');
        loginTab.classList.remove('checked')
        let signupTab = document.querySelector('.login__tabs__signup');
        signupTab.classList.add('checked')
    }

    return(<>
        <div className='login'>
            <div className='login__tabs'>
                <div className='login__tabs__signup' onClick={toSignup}>Регистрация</div>
                <div className='login__tabs__login checked' onClick={toLogin}>Вход</div>
            </div>
            <form onSubmit={signUp} className='login__signup' style={{"display": "none"}}>
                <input required placeholder="Логин" onChange={(e)=>setLogin(e.target.value.toLowerCase())}/><br/>
                <input required placeholder="ФИО" onChange={(e)=>setFIO(e.target.value)}/><br/>
                <input required type="password" placeholder="Пароль" onChange={(e)=>setPassword(e.target.value)}/><br/>
                <button className='login__signup__button'>Зарегистрироваться</button>
            </form>
            <form onSubmit={logIn} className='login__login'>
                <input required placeholder="Логин" onChange={(e)=>setLogin(e.target.value.toLowerCase())}/><br/>
                <input required className='password' type="password" placeholder="Пароль" onChange={(e)=>setPassword(e.target.value)}/><br/>
                <button className='login__login__button'>Войти</button>
            </form>
        </div>
    </>);
}

export default Login;