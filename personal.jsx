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
                        id поставки: ${order["id"]}<br/>
                        Поставщик: ${order["from"]}<br/>
                        Товар: ${order["name"]}<br/>
                        id товара: ${order["productId"]}<br/>
                        Цена: ${order["price"]} wei<br/>
                        Количество: ${order["count"]}<br/>
                        Время: ${time}<br/>
                        Статус: ${order["active"] ? order["confirmed"] ? "Подтверждено": "Не рассмотрено": order["confirmed"] ? "Завершено": "Отклонено" }
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

                return `<li>id покупки: ${purchase["id"]}<br/>
                        Магазин: ${purchase["from"]}<br/>
                        Товар: ${purchase["name"]}<br/>
                        id товара: ${purchase["productId"]}<br/>
                        Цена: ${purchase["price"]} wei<br/>
                        Количество: ${purchase["count"]}<br/>
                        Время: ${time}<br/>
                        Статус: ${purchase["active"] ? "Не рассмотрено": purchase["confirmed"] ? "Завершено": "Отменено/Отклонено"}</li>`
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

                return `<li>id покупки: ${refund["id"]}<br/>
                        Магазин: ${refund["from"]}<br/>
                        Товар: ${refund["name"]}<br/>
                        id товара: ${refund["productId"]}<br/>
                        Цена: ${refund["price"]} wei<br/>
                        Количество: ${refund["count"]}<br/>
                        Время: ${time}<br/>
                        Статус: ${refund["active"] ? "Не рассмотрено": refund["confirmed"] ? "Завершено": "Отменён/Отклонён"}</li>`
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
                return `<li>id покупки: ${purchase["id"]}<br/>
                        Покупатель: ${purchase["to"]}<br/>
                        Товар: ${purchase["name"]}<br/>
                        id товара: ${purchase["productId"]}<br/>
                        Цена товара: ${purchase["price"]} wei<br/>
                        Количество: ${purchase["count"]}<br/>
                        Время: ${time}</li>`
            })

            let purchasesList =  document.querySelector(".purchases")
            purchasesList.innerHTML = purchaseText.join('')
        }

        if (purchasesHistory.length  > 0) {
            setPurchasesHistory(true)
            purchasesHistory.sort((a,b) => b.time - a.time)
            let purchaseText = purchasesHistory.map((purchase)=>{
                let time = moment.unix(purchase["time"]).format('LLL')

                return `<li>id покупки: ${purchase["id"]}<br/>
                        <!--${purchase["seller"] ? `Продавец: ${purchase["seller"]}<br/>`: ""}-->
                        Покупатель: ${purchase["to"]}<br/>
                        Товар: ${purchase["name"]}<br/>
                        id товара: ${purchase["productId"]}<br/>
                        Цена: ${purchase["price"]} wei<br/>
                        Количество: ${purchase["count"]}<br/>
                        Время: ${time}<br/>
                        Статус: ${purchase["active"] ? "Подтверждено": purchase["confirmed"] ? "Завершено": "Отменено/Отклонено"}</li>`
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

                return `<li>id покупки: ${refund["id"]}<br/>
                        <!--${refund["seller"] ? `Продавец: ${refund["seller"]}<br/>`: ""}-->
                        Покупатель: ${refund["to"]}<br/>
                        Товар: ${refund["name"]}<br/>
                        id товара: ${refund["productId"]}<br/>
                        Цена: ${refund["price"]} wei<br/>
                        Количество: ${refund["count"]}<br/>
                        Время: ${time}<br/></li>`
            })

            
            let refundsList =  document.querySelector(".refunds")
            refundsList.innerHTML = refundText.join('')
        }
        
        if (refundsHistory.length > 0) {
            
            setRefundsHistory(true)
            refundsHistory.sort((a,b) => b.time - a.time)
            let refundText = refundsHistory.map((refund)=>{
                let time = moment.unix(refund["time"]).format('LLL')

                return `<li>id покупки: ${refund["id"]}<br/>
                        <!--${refund["seller"] ? `Продавец: ${refund["seller"]}<br/>`: ""}-->
                        Покупатель: ${refund["to"]}<br/>
                        Товар: ${refund["name"]}<br/>
                        id товара: ${refund["productId"]}<br/>
                        Цена: ${refund["price"]} wei<br/>
                        Количество: ${refund["count"]}<br/>
                        Время: ${time}<br/>
                        Статус: ${refund["active"] ? "Подтверждено": refund["confirmed"] ? "Завершено": "Отклонено"}</li>`
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
                return `<li>id поставки: ${order["id"]}<br/>
                        Заказчик: ${order["to"]}<br/>
                        Товар: ${order["name"]}<br/>
                        id товара: ${order["productId"]}<br/>
                        Цена товара: ${order["price"]} wei<br/>
                        Количество: ${order["count"]}<br/>
                        Время: ${time}</li>`
            })

            let ordersList =  document.querySelector(".orders")
            ordersList.innerHTML = orderText.join('')
        }

        if (ordersHistory.length  > 0) {
            setOrdersHistory(true)
            ordersHistory.sort((a,b) => b.time - a.time)
            let orderText = ordersHistory.map((order)=>{
                let time = moment.unix(order["time"]).format('LLL')
                
                return `<li>id поставки: ${order["id"]}<br/>
                        Заказчик: ${order["to"]}<br/>
                        Товар: ${order["name"]}<br/>
                        id товара: ${order["productId"]}<br/>
                        Цена: ${order["price"]} wei<br/>
                        Количество: ${order["count"]}<br/>
                        Время: ${time}<br/>
                        Статус: ${order["active"] ? "Подтверждено": order["confirmed"] ? "Завершено": "Отклонено"}</li>`
            })

            let ordersList =  document.querySelector(".ordersHistory")
            ordersList.innerHTML = orderText.join('')
        }
    }

    async function logOut() {
        let logout = document.querySelector(".logout")
        logout.textContent = "Подождите..."
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

        logout.textContent = "Выйти"
        logout.disabled = false
    }

    function back() {
        navigate('/main')
    }

    async function changeRole() {
        let changeRole = document.querySelector(".changeRole")
        changeRole.textContent = "Подождите..."
        changeRole.disabled = true

        try {
            await Contract.methods.changeRole().send({from: address})
            let seller = await Contract.methods.sellers(login).call()

            if (seller["currentRole"] === '2') {
                setCity(seller["city"])
                setShop(seller["shop"])
            }
            setCurrentRole(seller["currentRole"])
            changeRole.textContent = 'Перейти к роли ' + (seller["currentRole"] === '1' ? 'продавца': 'покупателя')
            alert('Роль изменена')
        }
        catch(e) {
            alert(e)
        }
        
        getBalance()
        changeRole.disabled = false
    }

    return(<>
        <header>
            <img src={logo} alt="Шестёрочка"/>
            <div className='buttons'>
                {currentRole ? <>
                    <button className='changeRole' onClick={changeRole}>Перейти к роли
                        {currentRole === '1' ? ' продавца': ' покупателя'}
                    </button></>: null}
                <button className='back' onClick={back}>Назад</button>
                <button className='logout' onClick={logOut}>Выйти</button>
            </div>
        </header>

        <div className='personal'>
            <h1>Личный кабинет</h1>
            <p>Логин: {login}</p>
            <p>Адрес: {address}</p>
            <p>Баланс: {balance} ETH</p>
            <p>Роль: {role === '0' ? 'Магазин': role === '1' ? 'Покупатель': role === '2' ? <>{currentRole === '2' ? 'Продавец': 'Покупатель'}</>: role === '3' ? 'Поставщик': null}</p>
            
            {role === '0' ? <>
                <p>Город: {city}</p>
                <p>Продавцы:</p>
                <ul className='sellers'></ul>

                <h3>История поставок</h3>
                {ordersHistory || "Пусто"}
                <ul className='ordersHistory'></ul>
            </>: null}

            {role === '1' | currentRole === '1' ? <>
                <p>ФИО: {FIO}</p>

                <h3>История покупок</h3>
                {purchasesHistory || "Пусто"}
                <ul className='purchasesHistory'></ul>

                <h3>История возвратов</h3>
                {refundsHistory || "Пусто"}
                <ul className='refundsHistory'></ul>
            </>: null}

            {currentRole === '2' ? <>
                <p>ФИО: {FIO}</p>
                <p>Город: {city}</p>
                <p>Магазин: {shop}</p>

                <h3>Запросы на покупку</h3>
                {purchases || "Пусто"}
                <ul className='purchases'></ul>

                <h3>История покупок</h3>
                {purchasesHistory || "Пусто"}
                <ul className='purchasesHistory'></ul>

                <h3>Запросы на возврат товара из-за брака</h3>
                {refunds || "Пусто"}
                <ul className='refunds'></ul>

                <h3>История возвратов</h3>
                {refundsHistory || "Пусто"}
                <ul className='refundsHistory'></ul>
            </>: null}

            {role === '3' ? <>
                <h3>Запросы на поставку</h3>
                {orders || "Пусто"}
                <ul className='orders'></ul>

                <h3>История поставок</h3>
                {ordersHistory || "Пусто"}
                <ul className='ordersHistory'></ul>
            </>: null}

            <h3>История действий</h3>
            <ul className='actionsHistory'></ul>
        </div>
    </>)
}

export default Personal;