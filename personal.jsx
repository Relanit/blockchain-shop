import {useState, useEffect} from 'react'
import {UseContext} from './context'
import {useNavigate} from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/ru'
import './personal.css'
import logo from './6.png';

function Personal() {
    const {web3, Contract} = UseContext()
    const navigate = useNavigate()

    const address = sessionStorage.getItem("address")
    const login = sessionStorage.getItem("login")

    const [role, setRole] = useState()
    const [balance, setBalance] = useState()
    const [currentRole, setCurrentRole] = useState()
    const [FIO, setFIO] = useState()
    const [city, setCity] = useState()
    const [shop, setShop] = useState()

    const [orders, setOrders] = useState()
    const [ordersHistory, setOrdersHistory] = useState()

    const [purchases, setPurchases] = useState()
    const [purchasesHistory, setPurchasesHistory] = useState()

    const [refunds, setRefunds] = useState()
    const [refundsHistory, setRefundsHistory] = useState()

    moment.locale('ru')

    useEffect(() => {
        getRole()
        getBalance()
    })

    async function getRole() {
        const user = await Contract.methods.users(login).call()
        setRole(user["role"])

        let currentRole = user["role"]

        if (user["role"] === '2') {
            let seller = await Contract.methods.sellers(login).call()
            currentRole = seller["currentRole"]
            setCurrentRole(seller["currentRole"])
        }

        if (user["role"] === '0') {
           await prepareShop()
        }
        else if (user["role"] === '1') {
            let FIO = await Contract.methods.buyersFIO(login).call()
            setFIO(FIO)
            await prepareBuyer()
        }
        else if (currentRole === '1') {
            let seller = await Contract.methods.sellers(login).call()
            setFIO(seller["FIO"])
            await prepareBuyer()
        }
        else if (user["role"] === '2') {
            await prepareSeller()
        }
        else if (user["role"] === '3') {
            await prepareProvider()
        }

        await prepareActionsHistory()
    }

    async function getBalance() {
        let balance = await Contract.methods.getBalance(login).call()/10**18
        setBalance(balance)
    }

    async function prepareActionsHistory() {
        let actionsHistory = [...await Contract.methods.getUserActions(login).call()]
        actionsHistory.sort((a,b) => b.time - a.time)

        actionsHistory = actionsHistory.map((action)=>{
            let time = moment.unix(action["time"]).format('LLL')

            return `<li>
                    ${action["description"]}<br>
                    ${time}
                    </li>`
        })

        let actionsList =  document.querySelector(".actionsHistory")
        actionsList.innerHTML = actionsHistory.join('')
    }

    async function prepareShop() {
        let shopCity = await Contract.methods.shopCity(login).call()
        setCity(shopCity)

        const sellers = await Contract.methods.getSellers(login).call()


        let logins = sellers.map((login)=>{
            return `<li>${login}</li>`
        })

        let sellersList =  document.querySelector(".sellers")
        sellersList.innerHTML = logins.join('')

        let ordersIds = await Contract.methods.getShopOrdersIds(login).call()
        let ordersHistory = []
        for (let i = 0; i < ordersIds.length; i++) {
            let order = await Contract.methods.orders(ordersIds[i]).call()
            order.id = ordersIds[i]
            
            ordersHistory.push(order)
        }
        
        if (ordersHistory.length  > 0) {
            setOrdersHistory(true)
            ordersHistory.sort((a,b) => b.time - a.time)
            let orderText = ordersHistory.map((order)=>{
                let time = moment.unix(order["time"]).format('LLL')

                return `<li>
                        id ????????????????: ${order["id"]}<br/>
                        ??????????????????: ${order["from"]}<br/>
                        ??????????: ${order["name"]}<br/>
                        id ????????????: ${order["productId"]}<br/>
                        ????????: ${order["price"]} wei<br/>
                        ????????????????????: ${order["count"]}<br/>
                        ??????????: ${time}<br/>
                        ????????????: ${order["active"] ? order["confirmed"] ? "????????????????????????": "???? ??????????????????????": order["confirmed"] ? "??????????????????": "??????????????????" }
                        </li>`
            })

            
            let ordersList =  document.querySelector(".ordersHistory")
            ordersList.innerHTML = orderText.join('')
        }
    }



    async function prepareBuyer() {
        let purchasesIds = await Contract.methods.getBuyerPurchasesIds(login).call()
        let purchasesHistory = []
        for (let i = 0; i < purchasesIds.length; i++) {
            let purchase = await Contract.methods.purchases(purchasesIds[i]).call()
            purchase.id = purchasesIds[i]
            
            purchasesHistory.push(purchase)
        }
        
        if (purchasesHistory.length  > 0) {
            setPurchasesHistory(true)
            purchasesHistory.sort((a,b) => b.time - a.time)
            let purchaseText = purchasesHistory.map((purchase)=>{
                let time = moment.unix(purchase["time"]).format('LLL')

                return `<li>id ??????????????: ${purchase["id"]}<br/>
                        ??????????????: ${purchase["from"]}<br/>
                        ??????????: ${purchase["name"]}<br/>
                        id ????????????: ${purchase["productId"]}<br/>
                        ????????: ${purchase["price"]} wei<br/>
                        ????????????????????: ${purchase["count"]}<br/>
                        ??????????: ${time}<br/>
                        ????????????: ${purchase["active"] ? "???? ??????????????????????": purchase["confirmed"] ? "??????????????????": "????????????????/??????????????????"}</li>`
            })

            
            let purchasesList =  document.querySelector(".purchasesHistory")
            purchasesList.innerHTML = purchaseText.join('')
        }

        purchasesIds = await Contract.methods.getBuyerPurchaseRefundsIds(login).call()
        let refundsHistory = []
        for (let i = 0; i < purchasesIds.length; i++) {
            let refundId = await Contract.methods.purchaseRefundIds(purchasesIds[i], 1).call()
            let refund = await Contract.methods.refunds(refundId).call()
            refund.id = purchasesIds[i]
            
            refundsHistory.push(refund)
        }
        
        if (refundsHistory.length  > 0) {
            setRefundsHistory(true)
            refundsHistory.sort((a,b) => b.time - a.time)
            let refundText = refundsHistory.map((refund)=>{
                let time = moment.unix(refund["time"]).format('LLL')

                return `<li>id ??????????????: ${refund["id"]}<br/>
                        ??????????????: ${refund["from"]}<br/>
                        ??????????: ${refund["name"]}<br/>
                        id ????????????: ${refund["productId"]}<br/>
                        ????????: ${refund["price"]} wei<br/>
                        ????????????????????: ${refund["count"]}<br/>
                        ??????????: ${time}<br/>
                        ????????????: ${refund["active"] ? "???? ??????????????????????": refund["confirmed"] ? "??????????????????": "??????????????/????????????????"}</li>`
            })

            
            let refundsList =  document.querySelector(".refundsHistory")
            refundsList.innerHTML = refundText.join('')
        }
    }



    async function prepareSeller() {
        let seller = await Contract.methods.sellers(login).call()
        setFIO(seller["FIO"])
        setCity(seller["city"])
        setShop(seller["shop"])

        let purchasesIds = await Contract.methods.getShopPurchasesIds(seller["shop"]).call()
        let purchases = []
        let purchasesHistory = []
        for (let i = 0; i < purchasesIds.length; i++) {
            let purchase = await Contract.methods.purchases(purchasesIds[i]).call()
            purchase.id = purchasesIds[i]
            
            if (!purchase["confirmed"] && purchase["active"]) {
                purchases.push(purchase)
            }
            else if (purchase["seller"] === login) {
                purchasesHistory.push(purchase)
            }
        }
        
        if (purchases.length > 0) {
            setPurchases(true)
            
            let purchaseText = purchases.map((purchase)=>{
                let time = moment.unix(purchase["time"]).format('LLL')
                return `<li>id ??????????????: ${purchase["id"]}<br/>
                        ????????????????????: ${purchase["to"]}<br/>
                        ??????????: ${purchase["name"]}<br/>
                        id ????????????: ${purchase["productId"]}<br/>
                        ???????? ????????????: ${purchase["price"]} wei<br/>
                        ????????????????????: ${purchase["count"]}<br/>
                        ??????????: ${time}</li>`
            })

            let purchasesList =  document.querySelector(".purchases")
            purchasesList.innerHTML = purchaseText.join('')
        }

        if (purchasesHistory.length  > 0) {
            setPurchasesHistory(true)
            purchasesHistory.sort((a,b) => b.time - a.time)
            let purchaseText = purchasesHistory.map((purchase)=>{
                let time = moment.unix(purchase["time"]).format('LLL')

                return `<li>id ??????????????: ${purchase["id"]}<br/>
                        <!--${purchase["seller"] ? `????????????????: ${purchase["seller"]}<br/>`: ""}-->
                        ????????????????????: ${purchase["to"]}<br/>
                        ??????????: ${purchase["name"]}<br/>
                        id ????????????: ${purchase["productId"]}<br/>
                        ????????: ${purchase["price"]} wei<br/>
                        ????????????????????: ${purchase["count"]}<br/>
                        ??????????: ${time}<br/>
                        ????????????: ${purchase["active"] ? "????????????????????????": purchase["confirmed"] ? "??????????????????": "????????????????/??????????????????"}</li>`
            })

            
            let purchasesList =  document.querySelector(".purchasesHistory")
            purchasesList.innerHTML = purchaseText.join('')
        }

        purchasesIds = await Contract.methods.getShopPurchaseRefundsIds(seller["shop"]).call() 
        let refunds = []
        let refundsHistory = []
        for (let i = 0; i < purchasesIds.length; i++) {
            let refundId = await Contract.methods.purchaseRefundIds(purchasesIds[i], 1).call()
            let refund = await Contract.methods.refunds(refundId).call()
            refund.id = purchasesIds[i]
            
            if (!refund["confirmed"] && refund["active"]) {
                refunds.push(refund)
            }
            else if (refund["seller"] === login) {
                refundsHistory.push(refund)
            }
        }

        if (refunds.length > 0) {
            setRefunds(true)
            let refundText = refunds.map((refund)=>{
                let time = moment.unix(refund["time"]).format('LLL')

                return `<li>id ??????????????: ${refund["id"]}<br/>
                        <!--${refund["seller"] ? `????????????????: ${refund["seller"]}<br/>`: ""}-->
                        ????????????????????: ${refund["to"]}<br/>
                        ??????????: ${refund["name"]}<br/>
                        id ????????????: ${refund["productId"]}<br/>
                        ????????: ${refund["price"]} wei<br/>
                        ????????????????????: ${refund["count"]}<br/>
                        ??????????: ${time}<br/></li>`
            })

            
            let refundsList =  document.querySelector(".refunds")
            refundsList.innerHTML = refundText.join('')
        }
        
        if (refundsHistory.length > 0) {
            
            setRefundsHistory(true)
            refundsHistory.sort((a,b) => b.time - a.time)
            let refundText = refundsHistory.map((refund)=>{
                let time = moment.unix(refund["time"]).format('LLL')

                return `<li>id ??????????????: ${refund["id"]}<br/>
                        <!--${refund["seller"] ? `????????????????: ${refund["seller"]}<br/>`: ""}-->
                        ????????????????????: ${refund["to"]}<br/>
                        ??????????: ${refund["name"]}<br/>
                        id ????????????: ${refund["productId"]}<br/>
                        ????????: ${refund["price"]} wei<br/>
                        ????????????????????: ${refund["count"]}<br/>
                        ??????????: ${time}<br/>
                        ????????????: ${refund["active"] ? "????????????????????????": refund["confirmed"] ? "??????????????????": "??????????????????"}</li>`
            })

            
            let refundsList =  document.querySelector(".refundsHistory")
            refundsList.innerHTML = refundText.join('')
        }
    }



    async function prepareProvider() {
        let ordersIds = await Contract.methods.getProviderOrdersIds(login).call()
        let orders = []
        let ordersHistory = []
        for (let i = 0; i < ordersIds.length; i++) {
            let order = await Contract.methods.orders(ordersIds[i]).call()
            order.id = ordersIds[i]
            
            if (!order["confirmed"] && order["active"]) {
                orders.push(order)
            }
            else {
                ordersHistory.push(order)
            }
        }
        
        if (orders.length > 0) {
            setOrders(true)

            let orderText = orders.map((order)=>{
                let time = moment.unix(order["time"]).format('LLL')
                return `<li>id ????????????????: ${order["id"]}<br/>
                        ????????????????: ${order["to"]}<br/>
                        ??????????: ${order["name"]}<br/>
                        id ????????????: ${order["productId"]}<br/>
                        ???????? ????????????: ${order["price"]} wei<br/>
                        ????????????????????: ${order["count"]}<br/>
                        ??????????: ${time}</li>`
            })

            let ordersList =  document.querySelector(".orders")
            ordersList.innerHTML = orderText.join('')
        }

        if (ordersHistory.length  > 0) {
            setOrdersHistory(true)
            ordersHistory.sort((a,b) => b.time - a.time)
            let orderText = ordersHistory.map((order)=>{
                let time = moment.unix(order["time"]).format('LLL')
                
                return `<li>id ????????????????: ${order["id"]}<br/>
                        ????????????????: ${order["to"]}<br/>
                        ??????????: ${order["name"]}<br/>
                        id ????????????: ${order["productId"]}<br/>
                        ????????: ${order["price"]} wei<br/>
                        ????????????????????: ${order["count"]}<br/>
                        ??????????: ${time}<br/>
                        ????????????: ${order["active"] ? "????????????????????????": order["confirmed"] ? "??????????????????": "??????????????????"}</li>`
            })

            let ordersList =  document.querySelector(".ordersHistory")
            ordersList.innerHTML = orderText.join('')
        }
    }

    async function logOut() {
        let logout = document.querySelector(".logout")
        logout.textContent = "??????????????????..."
        logout.disabled = true

        const accounts = await web3.eth.getAccounts()
        await web3.eth.personal.unlockAccount(accounts[0], "123")
        try {
            console.log(1)
            await Contract.methods.logOut(login).send({from: accounts[0]})
            web3.eth.personal.lockAccount(address)
            navigate('/login')
        }
        catch(e) {
            alert(e)
        }

        logout.textContent = "??????????"
        logout.disabled = false
    }

    function back() {
        navigate('/main')
    }

    async function changeRole() {
        let changeRole = document.querySelector(".changeRole")
        changeRole.textContent = "??????????????????..."
        changeRole.disabled = true

        try {
            await Contract.methods.changeRole().send({from: address})
            let seller = await Contract.methods.sellers(login).call()

            if (seller["currentRole"] === '2') {
                setCity(seller["city"])
                setShop(seller["shop"])
            }
            setCurrentRole(seller["currentRole"])
            changeRole.textContent = '?????????????? ?? ???????? ' + (seller["currentRole"] === '1' ? '????????????????': '????????????????????')
            alert('???????? ????????????????')
        }
        catch(e) {
            alert(e)
        }
        
        getBalance()
        changeRole.disabled = false
    }

    return(<>
        <header>
            <img src={logo} alt="????????????????????"/>
            <div className='buttons'>
                {currentRole ? <>
                    <button className='changeRole' onClick={changeRole}>?????????????? ?? ????????
                        {currentRole === '1' ? ' ????????????????': ' ????????????????????'}
                    </button></>: null}
                <button className='back' onClick={back}>??????????</button>
                <button className='logout' onClick={logOut}>??????????</button>
            </div>
        </header>

        <div className='personal'>
            <h1>???????????? ??????????????</h1>
            <p>??????????: {login}</p>
            <p>??????????: {address}</p>
            <p>????????????: {balance} ETH</p>
            <p>????????: {role === '0' ? '??????????????': role === '1' ? '????????????????????': role === '2' ? <>{currentRole === '2' ? '????????????????': '????????????????????'}</>: role === '3' ? '??????????????????': null}</p>
            
            {role === '0' ? <>
                <p>??????????: {city}</p>
                <p>????????????????:</p>
                <ul className='sellers'></ul>

                <h3>?????????????? ????????????????</h3>
                {ordersHistory || "??????????"}
                <ul className='ordersHistory'></ul>
            </>: null}

            {role === '1' | currentRole === '1' ? <>
                <p>??????: {FIO}</p>

                <h3>?????????????? ??????????????</h3>
                {purchasesHistory || "??????????"}
                <ul className='purchasesHistory'></ul>

                <h3>?????????????? ??????????????????</h3>
                {refundsHistory || "??????????"}
                <ul className='refundsHistory'></ul>
            </>: null}

            {currentRole === '2' ? <>
                <p>??????: {FIO}</p>
                <p>??????????: {city}</p>
                <p>??????????????: {shop}</p>

                <h3>?????????????? ???? ??????????????</h3>
                {purchases || "??????????"}
                <ul className='purchases'></ul>

                <h3>?????????????? ??????????????</h3>
                {purchasesHistory || "??????????"}
                <ul className='purchasesHistory'></ul>

                <h3>?????????????? ???? ?????????????? ???????????? ????-???? ??????????</h3>
                {refunds || "??????????"}
                <ul className='refunds'></ul>

                <h3>?????????????? ??????????????????</h3>
                {refundsHistory || "??????????"}
                <ul className='refundsHistory'></ul>
            </>: null}

            {role === '3' ? <>
                <h3>?????????????? ???? ????????????????</h3>
                {orders || "??????????"}
                <ul className='orders'></ul>

                <h3>?????????????? ????????????????</h3>
                {ordersHistory || "??????????"}
                <ul className='ordersHistory'></ul>
            </>: null}

            <h3>?????????????? ????????????????</h3>
            <ul className='actionsHistory'></ul>
        </div>
    </>)
}

export default Personal;