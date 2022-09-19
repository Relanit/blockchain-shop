import {useState, useEffect} from 'react'
import {UseContext} from './context'
import {useNavigate} from 'react-router-dom'
import './main.css'
import logo from './6.png';

function Main() {
    const {Contract} = UseContext()
    const navigate = useNavigate()

    const login = sessionStorage.getItem("login")
    const address = sessionStorage.getItem("address")

    const [role, setRole] = useState()
    const [currentRole, setCurrentRole] = useState()

    const [shopLogin, setShopLogin] = useState()
    const [shopProductId, setShopProductId] = useState()

    const [productName, setProductName] = useState()
    const [productPrice, setProductPrice] = useState()
    const [productCount, setProductCount] = useState()
    const [products, setProducts] = useState()

    const [orderId, setOrderId] = useState()
    const [purchaseId, setPurchaseId] = useState()
    const [refundId, setRefundId] = useState()

    const [providerLogin, setProviderLogin] = useState()
    const [providerProductId, setProviderProductId] = useState()

    useEffect(() => {
        getRole()
    })

    async function getRole() {
        const user = await Contract.methods.users(login).call()
        setRole(user["role"])
        if (user["role"] === '2') {
            let seller = await Contract.methods.sellers(login).call()
            setCurrentRole(seller["currentRole"])
        }
    }

    async function toPersonal() {
        navigate('/personal')
    }

    // Функции для всех

    async function getShopInfo(e) {
        e.preventDefault()

        

        try {
            let rating = await Contract.methods.getRating(shopLogin).call()
            rating = `<p>Рейтинг магазина ${shopLogin}: ${rating}</p>`
            let shopRating = document.querySelector(".shopRating")
            shopRating.innerHTML = rating

            let products = await Contract.methods.getShopProducts(shopLogin).call()
            let productsText = products.map((product, index) => {
                if (product.count !== '0') {
                    return `
                    <li key = ${index}>
                        <div className='Product' >
                            <div className= "BlockForProduct">
                                id: ${index} <br/>
                                Название: ${product.name} <br/>
                                Цена: ${product.price} wei  <br/>
                                Количество: ${product.count} <br/>
                            </div>
                        </div>
                    </li>
                    `
                }
            })
            let productsList =  document.querySelector(".productsList")
            productsList.innerHTML = productsText.join('')
            if (productsText.join('') !== '') {
                setProducts(true)
            }
        }
        catch(e) {
            alert(e)
        }

        e.target.reset()
    }

    // Функции магазина

    async function getProviderProduct(e) {
        e.preventDefault()

        try {
            let product = await Contract.methods.providerProducts(providerLogin, providerProductId).call()
            product = `Название: ${product["name"]}\nЦена: ${product["price"]} wei\nВ наличии: ${product["count"]}`
            alert(product)
        }
        catch(e) {
            alert('Неверный логин поставщика или id товара')
        }

        e.target.reset()
    }

    async function orderProduct(e) {
        e.preventDefault()
        let orderProduct = document.querySelector(".orderProduct")
        orderProduct.textContent = "Подождите..."
        orderProduct.disabled = true

        try {
            const product = await Contract.methods.providerProducts(providerLogin, providerProductId).call()
            await Contract.methods.orderProduct(providerLogin, providerProductId, productCount).send({from: address, value: product["price"] * productCount})
            alert('Запрос отправлен')
        }
        catch(e) {
            alert(e)
        }

        orderProduct.textContent = "Создать"
        orderProduct.disabled = false
        e.target.reset()
    }

    async function confirmReceipt(e) {
        e.preventDefault()
        let confirmReceipt = document.querySelector(".confirmReceipt")
        confirmReceipt.textContent = "Подождите..."
        confirmReceipt.disabled = true

        try {
            await Contract.methods.confirmReceipt(orderId).send({from: address})
            alert('Получение подтверждено')
        }
        catch(e) {
            alert(e)
        }

        confirmReceipt.textContent = "Подтвердить"
        confirmReceipt.disabled = false
        e.target.reset()
    }

    // Функции покупателя

    async function createPurchase(e) {
        e.preventDefault()
        let createPurchase = document.querySelector(".createPurchase")
        createPurchase.textContent = "Подождите..."
        createPurchase.disabled = true

        try {
            let product = await Contract.methods.shopProducts(shopLogin, shopProductId).call()
            await Contract.methods.createPurchase(shopLogin, shopProductId, productCount).send({from: address, value: product["price"] * productCount})
            alert('Запрос создан')
        }
        catch(e) {
            alert(e)
        }

        createPurchase.textContent = "Купить"
        createPurchase.disabled = false
        e.target.reset()
    }

    async function cancelPurchase(e) {
        e.preventDefault()
        let cancelPurchase = document.querySelector(".cancelPurchase")
        cancelPurchase.textContent = "Подождите..."
        cancelPurchase.disabled = true

        try {
            let count = productCount
            if (!e.target.count.value) {
                try {
                    let purchase = await Contract.methods.purchases(purchaseId).call()
                    count = purchase["count"]
                }
                catch(exception) {
                    alert('Неверный id')
                    cancelPurchase.textContent = "Отменить"
                    cancelPurchase.disabled = false
                    e.target.reset()
                    return
                }
            }
            await Contract.methods.cancelPurchase(purchaseId, count).send({from: address})
            alert('Покупка отменена')
        }
        catch(e) {
            alert(e)
        }

        cancelPurchase.textContent = "Отменить"
        cancelPurchase.disabled = false
        e.target.reset()
    }

    async function refundPurchase(e) {
        e.preventDefault()
        let refundPurchase = document.querySelector(".refundPurchase")
        refundPurchase.textContent = "Подождите..."
        refundPurchase.disabled = true

        try {
            let count = productCount
            if (!e.target.count.value) {
                try {
                    let purchase = await Contract.methods.purchases(purchaseId).call()
                    count = purchase["count"]
                }
                catch(exception) {
                    alert('Неверный id')
                    refundPurchase.textContent = "Вернуть"
                    refundPurchase.disabled = false
                    e.target.reset()
                    return
                }
            }
            await Contract.methods.refundPurchase(purchaseId, count).send({from: address})
            alert('Запрос отправлен')
        }
        catch(e) {
            alert(e)
        }

        refundPurchase.textContent = "Вернуть"
        refundPurchase.disabled = false
        e.target.reset()
    }

    // Функции продавца

    async function confirmPurchase(e) {
        e.preventDefault()
        let confirmPurchase = document.querySelector(".confirmPurchase")
        confirmPurchase.textContent = "Подождите..."
        confirmPurchase.disabled = true

        try {
            await Contract.methods.confirmPurchase(purchaseId).send({from: address})
            alert('Покупка подтверждена')
        }
        catch(e) {
            alert(e)
        }

        confirmPurchase.textContent = "Подтвердить"
        confirmPurchase.disabled = false
        e.target.reset()
    }

    async function rejectPurchase(e) {
        e.preventDefault()
        let rejectPurchase = document.querySelector(".rejectPurchase")
        rejectPurchase.textContent = "Подождите..."
        rejectPurchase.disabled = true

        try {
            await Contract.methods.rejectPurchase(purchaseId).send({from: address})
            alert('Покупка отклонена')
        }
        catch(e) {
            alert(e)
        }

        rejectPurchase.textContent = "Отклонить"
        rejectPurchase.disabled = false
        e.target.reset()
    }

    async function confirmRefund(e) {
        e.preventDefault()
        let confirmRefund = document.querySelector(".confirmRefund")
        confirmRefund.textContent = "Подождите..."
        confirmRefund.disabled = true

        try {
            let id = await Contract.methods.purchaseRefundIds(refundId, 1).call()
            let refund = await Contract.methods.refunds(id).call()
            await Contract.methods.confirmRefund(refundId).send({from: address, value: refund["price"] * refund["count"]})
            alert('Возврат подтверждён')
        }
        catch(e) {
            alert(e)
        }

        confirmRefund.textContent = "Подтвердить"
        confirmRefund.disabled = false
        e.target.reset()
    }

    async function rejectRefund(e) {
        e.preventDefault()
        let rejectRefund = document.querySelector(".rejectRefund")
        rejectRefund.textContent = "Подождите..."
        rejectRefund.disabled = true

        try {
            await Contract.methods.rejectRefund(refundId).send({from: address})
            alert('Возврат отклонён')
        }
        catch(e) {
            alert(e)
        }

        rejectRefund.textContent = "Отклонить"
        rejectRefund.disabled = false
        e.target.reset()
    }

    // Функции поставщика

    async function createProduct(e) {
        e.preventDefault()
        let createProduct = document.querySelector(".createProduct")
        createProduct.textContent = "Подождите..."
        createProduct.disabled = true

        try {
            await Contract.methods.createProduct(productName, productPrice, productCount).send({from: address})
            alert('Товар создан')
        }
        catch(e) {
            alert(e)
        }

        createProduct.textContent = "Создать"
        createProduct.disabled = false
        e.target.reset()
    }

    async function confirmOrder(e) {
        e.preventDefault()
        let confirmOrder = document.querySelector(".confirmOrder")
        confirmOrder.textContent = "Подождите..."
        confirmOrder.disabled = true

        try {
            await Contract.methods.confirmOrder(orderId).send({from: address})
            alert('Поставка подтверждена')
        }
        catch(e) {
            alert(e)
        }

        confirmOrder.textContent = "Подтвердить"
        confirmOrder.disabled = false
        e.target.reset()
    }

    async function rejectOrder(e) {
        e.preventDefault()
        let rejectOrder = document.querySelector(".rejectOrder")
        rejectOrder.textContent = "Подождите..."
        rejectOrder.disabled = true

        try {
            await Contract.methods.rejectOrder(orderId).send({from: address})
            alert('Поставка отклонена')
        }
        catch(e) {
            alert(e)
        }

        rejectOrder.textContent = "Отклонить"
        rejectOrder.disabled = false
        e.target.reset()
    } 

    return(<>
        <header>
            <img src={logo} alt="Шестёрочка"/>
            <button className='toPersonal' onClick={toPersonal}>Личный кабинет</button>
        </header>

        <div className='shop'>
            <h3>Просмотр информации магазина</h3>
            <form className='one_input' onSubmit={getShopInfo}>
                <button>Просмотреть</button>
                <input required placeholder='Логин магазина' onChange={(e)=>setShopLogin(e.target.value.toLowerCase())}/><br/>
            </form>
            <div className='shopRating'></div>
            {products ? <><h3>Товары</h3></>: null}
            <div className='productsList'></div>
        </div>

        <div className='main'>
            {/* Функции магазина */}
            {role === '0' ? <>
                <h3>Просмотр товаров поставщика</h3>
                <form className='many_input' onSubmit={getProviderProduct}>
                    <input required placeholder='Логин поставщика' onChange={(e)=>setProviderLogin(e.target.value.toLowerCase())}/><br/>
                    <input required placeholder='id товара' onChange={(e)=>setProviderProductId(e.target.value)}/><br/>
                    <button>Просмотреть</button>
                </form>

                <h3>Оформить поставку товара</h3>
                <form className='many_input' onSubmit={orderProduct}>
                    <input required placeholder='Логин поставщика' onChange={(e)=>setProviderLogin(e.target.value.toLowerCase())}/><br/>
                    <input required placeholder='id товара'  onChange={(e)=>setProviderProductId(e.target.value)}/><br/>
                    <input required placeholder='Количество' onChange={(e)=>setProductCount(e.target.value)}/><br/>
                    <button className='orderProduct'>Оформить</button>
                </form>

                <h3>Подтвердить получение товара</h3>
                <form className='one_input' onSubmit={confirmReceipt}>
                    <button className='confirmReceipt'>Подтвердить</button>
                    <input required placeholder='id поставки' onChange={(e)=>setOrderId(e.target.value)}/>
                </form>
            </>: null}

            {/* Функции покупателя */}
            {role === '1' || currentRole === '1' ? <>
                <h3>Сделать покупку</h3>
                <form className='many_input' onSubmit={createPurchase}>
                    <input required placeholder='Логин магазина' onChange={(e)=>setShopLogin(e.target.value.toLowerCase())}/><br/>
                    <input required placeholder='id товара' onChange={(e)=>setShopProductId(e.target.value)}/><br/>
                    <input required  placeholder='количество' onChange={(e)=>setProductCount(e.target.value)}/><br/>
                    <button className='createPurchase'>Купить</button>
                </form>

                <h3>Отменить покупку</h3>
                <form className='many_input' onSubmit={cancelPurchase}>
                    <input required placeholder='id покупки' onChange={(e)=>setPurchaseId(e.target.value)}/><br/>
                    <input name="count" placeholder='количество товара' onChange={(e)=>setProductCount(e.target.value)}/><br/>
                    <button className='cancelPurchase'>Отменить</button>
                </form>

                <h3>Вернуть товар из-за брака</h3>
                <form className='many_input' onSubmit={refundPurchase}>
                    <input required placeholder='id покупки' onChange={(e)=>setPurchaseId(e.target.value)}/><br/>
                    <input name="count" placeholder='количество товара' onChange={(e)=>setProductCount(e.target.value)}/><br/>
                    <button className='refundPurchase'>Вернуть</button>
                </form>
            </>: null}

            {/* Функции продавца */}
            {currentRole === '2' ? <>
                <h3>Подтвердить покупку</h3>
                <form className='one_input' onSubmit={confirmPurchase}>
                    <button className='confirmPurchase'>Подтвердить</button>
                    <input required placeholder='id покупки' onChange={(e)=>setPurchaseId(e.target.value)}/><br/>
                </form>

                <h3>Отклонить покупку</h3>
                <form className='one_input' onSubmit={rejectPurchase}>
                    <button className='rejectPurchase'>Отклонить</button>
                    <input required placeholder='id покупки' onChange={(e)=>setPurchaseId(e.target.value)}/><br/>
                </form>

                <h3>Подтвердить возврат товара</h3>
                <form className='one_input' onSubmit={confirmRefund}>
                    <button className='confirmRefund'>Подтвердить</button>
                    <input required placeholder='id покупки' onChange={(e)=>setRefundId(e.target.value)}/><br/>
                </form>

                <h3>Отклонить возврат товара</h3>
                <form className='one_input' onSubmit={rejectRefund}>
                    <button className='rejectRefund'>Отклонить</button>
                    <input required placeholder='id покупки' onChange={(e)=>setRefundId(e.target.value)}/><br/>
                </form>
            </>: null}

            {/* Функции поставщика */}
            {role === '3' ? <>
                <h3>Создать товар</h3>
                <form className='many_input' onSubmit={createProduct}>
                    <input required placeholder='Название' onChange={(e)=>setProductName(e.target.value)}/><br/>
                    <input required placeholder='Цена'  onChange={(e)=>setProductPrice(e.target.value)}/><br/>
                    <input required placeholder='Количество' onChange={(e)=>setProductCount(e.target.value)}/><br/>
                    <button className='createProduct'>Создать</button>
                </form>

                <h3>Подтвердить поставку товара</h3>
                <form className='one_input' onSubmit={confirmOrder}>
                    <button className='confirmOrder'>Подтвердить</button>
                    <input required placeholder='id поставки' onChange={(e)=>setOrderId(e.target.value)}/>
                </form>

                <h3>Отклонить поставку товара</h3>
                <form className='one_input' onSubmit={rejectOrder}>
                    <button className='rejectOrder'>Подтвердить</button>
                    <input required placeholder='id поставки' onChange={(e)=>setOrderId(e.target.value)}/>
                </form>
            </>: null}
        </div>
    </>)
}

export default Main