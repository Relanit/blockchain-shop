// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";

contract Contract {

    struct User {
        address addr;
        uint role;
        bytes32 passwordHash;
        bool logged;
    }

    struct Seller {
        string FIO;
        string city;
        string shop;
        uint currentRole;
    }

    struct TransferProduct {
        string from;
        string to;
        string seller;
        string name;
        uint productId;
        uint price;
        uint count;
        uint time;
        bool confirmed;
        bool active;
    }

    struct Product {
        string name;
        uint price;
        uint count;
    }

    struct Action {
        string description;
        uint time;
    }

    mapping(address => string) public logins;
    mapping(string => User) public users;
    mapping(string => Action[]) private userActions;

    mapping(string => string) public buyersFIO;
    mapping(string => Seller) public sellers;

    mapping(string => string) public shopCity;
    mapping(string => Product[]) public shopProducts;
    mapping(string => string[]) private shopSellers;
    mapping(string => uint[]) private shopPurchasesIds;
    mapping(string => uint[]) private shopPurchaseRefundsIds;
    mapping(string => uint[]) private shopOrdersIds;
    
    mapping(string => uint) private shopRating;

    mapping(uint => uint[2]) public purchaseRefundIds;

    mapping(string => uint[]) private buyerPurchasesIds;
    mapping(string => uint[]) private buyerPurchaseRefundsIds;
    
    mapping(string => Product[]) public providerProducts;
    mapping(string => uint[]) private providerOrdersIds;
    
    TransferProduct[] public orders;
    TransferProduct[] public purchases;
    TransferProduct[] public refunds;

    constructor() {
        logins[0xF032E37214DcAC8652124EC8E952fdfC30C5153E] = "taganrog";
        users["taganrog"] = User(0xF032E37214DcAC8652124EC8E952fdfC30C5153E, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["taganrog"] = "Taganrog";
        shopSellers["taganrog"] = ["nelanit"];
        shopRating["taganrog"] = 2;

        logins[0xF651039A25373CAAF869133048a564a9a8Bb4588] = "taganrog2";
        users["taganrog2"] = User(0xF651039A25373CAAF869133048a564a9a8Bb4588, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["taganrog2"] = "Taganrog";
        shopSellers["taganrog2"] = ["prodovec_gov"];
        shopRating["taganrog2"] = 4;

        logins[0x2082eFC44E87EB8b372F19c0aAD226d46c5CE114] = "rostov";
        users["rostov"] = User(0x2082eFC44E87EB8b372F19c0aAD226d46c5CE114, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["rostov"] = "Rostov";
        shopSellers["rostov"] = ["t2x2"];
        shopRating["rostov"] = 7;

        logins[0x2C7DC73836E1fe66812d19F2fA0eCADdDDd8dFEe] = "rostov2";
        users["rostov2"] = User(0x2C7DC73836E1fe66812d19F2fA0eCADdDDd8dFEe, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["rostov2"] = "Rostov";
        shopSellers["rostov2"] = ["mzlff"];
        shopRating["rostov2"] = 6;

        logins[0x37C0302565DE3Ed277EAB357d79FF2463F0D3E2f] = "moscow";
        users["moscow"] = User(0x37C0302565DE3Ed277EAB357d79FF2463F0D3E2f, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["moscow"] = "Moscow";
        shopSellers["moscow"] = ["tester"];
        shopRating["moscow"] = 10;

        logins[0x2DfA28C7d48B6AF1631826509e12a9A33f738349] = "moscow2";
        users["moscow2"] = User(0x2DfA28C7d48B6AF1631826509e12a9A33f738349, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["moscow2"] = "Moscow";
        shopSellers["moscow2"] = ["brff"];
        shopRating["moscow2"] = 10;

        logins[0xeF7cb07414C0A8FCD7Af6780653217b79D2a0A20] = "murmansk";
        users["murmansk"] = User(0xeF7cb07414C0A8FCD7Af6780653217b79D2a0A20, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["murmansk"] = "Murmansk";
        shopSellers["murmansk"] = ["elona"];
        shopRating["murmansk"] = 4;

        logins[0x765469cb202bc66f040555D51Fb2b3517e1b6146] = "murmansk2";
        users["murmansk2"] = User(0x765469cb202bc66f040555D51Fb2b3517e1b6146, 0, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        shopCity["murmansk2"] = "Murmansk";
        shopSellers["murmansk2"] = ["durov"];
        shopRating["murmansk2"] = 3;
        

        logins[0x6479e1A75Be9f5DC474E932bFC55754d83C302b6] = "relanit";
        users["relanit"] = User(0x6479e1A75Be9f5DC474E932bFC55754d83C302b6, 1, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        buyersFIO["relanit"] = "Maxim Stulov";

        logins[0x0F6228D44E246dc03131D4fFaf5F2bc81e00e4AE] = "relan1t";
        users["relan1t"] = User(0x0F6228D44E246dc03131D4fFaf5F2bc81e00e4AE, 1, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        buyersFIO["relan1t"] = "Maxim Stulov";
        
        logins[0x6834FF86f8E15C28C66d6b5a54C60a8E85d3C673] = "nelanit";
        users["nelanit"] = User(0x6834FF86f8E15C28C66d6b5a54C60a8E85d3C673, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["nelanit"] = Seller("Maxim Stulov", "Taganrog", "taganrog", 2);
        
        logins[0x10D3c11d2FB9225f91015883056F399a844711BA] = "prodovec_gov";
        users["prodovec_gov"] = User(0x10D3c11d2FB9225f91015883056F399a844711BA, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["prodovec_gov"] = Seller("Alexey Shevtsov", "Taganrog", "taganrog2", 2);

        logins[0x102cBd6322c37F462d5216b94d590a1d64483866] = "t2x2";
        users["t2x2"] = User(0x102cBd6322c37F462d5216b94d590a1d64483866, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["t2x2"] = Seller("Anton Tatyrzha", "Rostov", "rostov", 2);

        logins[0xE154Ac70e434C2a96F60811DDa0490B59197C09a] = "mzlff";
        users["mzlff"] = User(0xE154Ac70e434C2a96F60811DDa0490B59197C09a, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["mzlff"] = Seller("Ilya Mazellovv", "Rostov", "rostov2", 2);

        logins[0x033C8EBE8CCCA936E57152fA1f4Ef695e116e47C] = "tester";
        users["tester"] = User(0x033C8EBE8CCCA936E57152fA1f4Ef695e116e47C, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["tester"] = Seller("Test Testovich", "Moscow", "moscow", 2);

        logins[0x096a1c5b1379FC7FAdF57eA4B0481982FB63fB04] = "brff";
        users["brff"] = User(0x096a1c5b1379FC7FAdF57eA4B0481982FB63fB04, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["brff"] = Seller("Vladimir Semenuk", "Moscow", "moscow2", 2);

        logins[0xe9315B1DE058305Ce43b48f01cCc63709cCa503f] = "elona";
        users["elona"] = User(0xe9315B1DE058305Ce43b48f01cCc63709cCa503f, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["elona"] = Seller("Elona Musk", "Murmansk", "murmansk", 2);

        logins[0x8d394e03316bC7Ae17cdb447D274dC58d9425c85] = "durov";
        users["durov"] = User(0x8d394e03316bC7Ae17cdb447D274dC58d9425c85, 2, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        sellers["durov"] = Seller("Pavel Durov", "Murmansk", "murmansk2", 2);

        logins[0x20FCbDcB9dbA24631c3D7237d459DF36F1AD354D] = "granit";
        users["granit"] = User(0x20FCbDcB9dbA24631c3D7237d459DF36F1AD354D, 3, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
        
        logins[0xb577C28b43743EC9a4A09057a8b7Df9Df0A5c298] = "lazurit";
        users["lazurit"] = User(0xb577C28b43743EC9a4A09057a8b7Df9Df0A5c298, 3, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);

        logins[0x76996D568245E1932Aa1bf4c859ea0cA543969d6] = "magnit";
        users["magnit"] = User(0x76996D568245E1932Aa1bf4c859ea0cA543969d6, 3, 0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107, false);
    }

    function signUp(address addr, bytes32 passwordHash, string memory login, string memory FIO) public {
        require(msg.sender == 0x9FdfD4d4bC2dFd25B71256FDCBd0406e7F8A2054, "Not a zero account");
        require(users[login].addr == address(0), "User with such login already exists");
        users[login] = User(addr, 1, passwordHash, false);
        logins[addr] = login;
        buyersFIO[login] = FIO;

        userActions[login].push(
            Action(
                "Sign Up", 
                block.timestamp
            )
        );
    }

    function logIn(string memory login, bytes32 passwordHash) public {
        require(msg.sender == 0x9FdfD4d4bC2dFd25B71256FDCBd0406e7F8A2054, "Not a zero account");
        require(users[login].addr != address(0), "Account with such login doesn't exist");
        require(users[login].passwordHash == passwordHash, "Invalid password");
        users[login].logged = true;

        userActions[login].push(
            Action(
                "Log In", 
                block.timestamp
            )
        );
    }

    function logOut(string memory login) public {
        require(msg.sender == 0x9FdfD4d4bC2dFd25B71256FDCBd0406e7F8A2054, "Not a zero account");
        require(users[login].addr != address(0), "Account with such login doesn't exist");
        users[login].logged = false;

        userActions[login].push(
            Action(
                "Log out", 
                block.timestamp
            )
        );
    }

    function shop() private view {
        require(users[logins[msg.sender]].role == 0, "Not shop");
    }

    function logged() private view {
        require(users[logins[msg.sender]].logged, "Not logged");
    }

    function buyer() private view {
        if (users[logins[msg.sender]].role == 2) {
            require(sellers[logins[msg.sender]].currentRole == 1, "Not buyer");
        }
        else {
            require(users[logins[msg.sender]].role == 1, "Not buyer");
        }
    }

    function seller() private view {
        require(users[logins[msg.sender]].role == 2, "Not seller");
    }

    function provider() private view {
        require(users[logins[msg.sender]].role == 3, "Not provider");
    }

    function append(string memory a, string memory b) private pure returns(string memory) {
        return string(abi.encodePacked(a, b));
    }

    function getHash(string memory str) private pure returns(bytes32)  {
        return keccak256(abi.encodePacked(str));
    }

    function getBalance(string memory login) public view returns(uint) {
        return users[login].addr.balance;
    }

    function getUserActions(string memory login) public view returns(Action[] memory) {
        return userActions[login];
    }

    function getSellers(string memory login) public view returns(string[] memory) {
        require(getHash(shopCity[login]) != getHash(""), "Not shop");
        return shopSellers[login];
    }

    function getRating(string memory login) public view returns(uint) {
        require(getHash(shopCity[login]) != getHash(""), "Not shop");
        return(shopRating[login]);
    }

    function getProviderOrdersIds(string memory login) public view returns(uint[] memory) {
        require(users[login].role == 3, "Not provider");
        return providerOrdersIds[login];
    }

    function getShopPurchasesIds(string memory login) public view returns(uint[] memory) {
        require(getHash(shopCity[login]) != getHash(""), "Not shop");
        return shopPurchasesIds[login];
    }

    function getShopPurchaseRefundsIds(string memory login) public view returns(uint[] memory) {
        require(getHash(shopCity[login]) != getHash(""), "Not shop");
        return shopPurchaseRefundsIds[login];
    }

    function getShopOrdersIds(string memory login) public view returns(uint[] memory) {
        require(getHash(shopCity[login]) != getHash(""), "Not shop");
        return shopOrdersIds[login];
    }

    function getBuyerPurchasesIds(string memory login) public view returns(uint[] memory) {
        if (users[login].role == 2) {
            require(sellers[login].currentRole == 1, "Not buyer");
        }
        else {
            require(users[login].role == 1, "Not buyer");
        }
        return buyerPurchasesIds[login];
    }

    function getBuyerPurchaseRefundsIds(string memory login) public view returns(uint[] memory) {
        if (users[login].role == 2) {
            require(sellers[login].currentRole == 1, "Not buyer");
        }
        else {
            require(users[login].role == 1, "Not buyer");
        }
        return buyerPurchaseRefundsIds[login];
    }

    function getShopProducts(string memory login) public view returns(Product[] memory) {
        require(getHash(shopCity[login]) != getHash(""), "Not shop");
        return shopProducts[login];
    }

    // Функции магазина

    function orderProduct(string memory login, uint id, uint count) public payable {
        logged();
        shop();
        require(users[login].role == 3, "Not provider");
        require(id < providerProducts[login].length, "Product not exist");
        require(count > 0, "Invalid count");
        require(count <= providerProducts[login][id].count, "Not enough products");
        require(msg.value == providerProducts[login][id].price * count, "Invalid value"); 

        orders.push(
            TransferProduct(
                login, 
                logins[msg.sender],
                "",
                providerProducts[login][id].name,
                id,
                providerProducts[login][id].price,
                count,
                block.timestamp,
                false,
                true
            )
        );

        providerProducts[login][id].count -= count;
        providerOrdersIds[login].push(orders.length - 1);
        shopOrdersIds[logins[msg.sender]].push(orders.length - 1);

        userActions[logins[msg.sender]].push(
            Action(
                append("Creating order with ID ", Strings.toString(orders.length - 1)), 
                block.timestamp
            )
        );
    }

    function confirmReceipt(uint id) public payable {
        logged();
        shop();
        require(id < orders.length, "Invalid id");
        require(msg.sender == users[orders[id].to].addr, "Not your order");
        require(orders[id].active, "Order not active");
        require(orders[id].confirmed, "Order not confirmed");

        payable(users[orders[id].from].addr).transfer(
            orders[id].price * orders[id].count
        );

        shopProducts[orders[id].to].push(
            Product(
                orders[id].name,
                orders[id].price + orders[id].price*20/100,
                orders[id].count
            )
        );

        orders[id].time = block.timestamp;
        orders[id].active = false;

        userActions[logins[msg.sender]].push(
            Action(
                append("Confirming of receipt of order with ID ", Strings.toString(id)), 
                block.timestamp
            )
        );
    }

    // Функции покупателя

    function createPurchase(string memory login, uint id, uint count) public payable {
        logged();
        buyer();
        require(getHash(shopCity[login]) != getHash(""), "Shop not found");
        require(id < shopProducts[login].length, "Product not exist");
        require(count > 0, "Invalid count");
        require(count <= shopProducts[login][id].count, "Not enough products");
        require(msg.value == shopProducts[login][id].price * count, "Invalid value");

        purchases.push(
            TransferProduct(
                login, 
                logins[msg.sender], 
                "",
                shopProducts[login][id].name,
                id,
                shopProducts[login][id].price,
                count,
                block.timestamp,
                false, 
                true
            )
        );

        shopProducts[login][id].count -= count;
        shopPurchasesIds[login].push(purchases.length - 1);
        buyerPurchasesIds[logins[msg.sender]].push(purchases.length - 1);

        userActions[logins[msg.sender]].push(
            Action(
                append("Creating purchase with ID ", Strings.toString(purchases.length - 1)), 
                block.timestamp
            )
        );
    }

    function cancelPurchase(uint id, uint count) public payable {
        logged();
        buyer();
        require(id < purchases.length, "Invalid id");
        require(msg.sender == users[purchases[id].to].addr, "Not your purchase");
        require(purchases[id].active, "Purchase not active");
        require(0 < count && count <= purchases[id].count, "Invalid count");

        if (count == purchases[id].count) {
            purchases[id].active = false;
        }
        else {
            purchases[id].count -= count;
        }

        shopProducts[purchases[id].from][purchases[id].productId].count += count;

        payable(msg.sender).transfer(
            purchases[id].price * count
        );
        
        purchases[id].time = block.timestamp;

        userActions[logins[msg.sender]].push(
            Action(append("Cancelling purchase with ID ", Strings.toString(id)), 
                   block.timestamp
            )
        );
    }

    function refundPurchase(uint id, uint count) public {
        logged();
        buyer();
        require(id < purchases.length, "Invalid id");
        require(msg.sender == users[purchases[id].to].addr, "Not your purchase");
        require(!purchases[id].active, "Purchase is active");
        require(purchases[id].confirmed, "Purchase not confirmed");
        require(0 < count && count <= purchases[id].count, "Invalid count");
        require(purchaseRefundIds[id][0] == 0, "Refund already requested");

        refunds.push(
            TransferProduct(
                purchases[id].from,
                purchases[id].to, 
                "",
                purchases[id].name,
                id,
                purchases[id].price,
                count,
                block.timestamp,
                false, 
                true
            )
        );

        shopPurchaseRefundsIds[purchases[id].from].push(id);
        buyerPurchaseRefundsIds[logins[msg.sender]].push(id);
        uint[2] memory refundId = [1, refunds.length - 1];
        purchaseRefundIds[id] = refundId;

        userActions[logins[msg.sender]].push(
            Action(
                append("Creating a refund request for purchase with ID ", Strings.toString(id)), 
                block.timestamp
            )
        );
    }

    // Функции продавца

    function changeRole() public {
        logged();
        seller();
        if (sellers[logins[msg.sender]].currentRole == 2) {
            sellers[logins[msg.sender]].currentRole = 1;
            
            userActions[logins[msg.sender]].push(
                Action("Changing role to buyer", block.timestamp)
            );
        }
        else {
            sellers[logins[msg.sender]].currentRole = 2;

            userActions[logins[msg.sender]].push(
                Action("Changing role to seller", block.timestamp)
            );
        }
    }

    function confirmPurchase(uint id) public payable {
        logged();
        seller();
        require(id < purchases.length, "Invalid id");
        require(getHash(sellers[logins[msg.sender]].shop) == getHash(purchases[id].from), "Not your shop");
        require(purchases[id].active, "Purchase not active");
        require(
            users[logins[msg.sender]].addr != users[purchases[id].to].addr, 
            "Can't confirm your own purchase"
        );

        payable(users[purchases[id].from].addr).transfer(
            purchases[id].price * purchases[id].count
        );

        string memory sellerLogin = logins[msg.sender];
        purchases[id].seller = sellerLogin;
        purchases[id].time = block.timestamp;
        purchases[id].confirmed = true;
        purchases[id].active = false;

        userActions[logins[msg.sender]].push(
            Action(
                append("Confirming purchase with ID ", Strings.toString(id)),
                block.timestamp
            )
        );
    }

    function rejectPurchase(uint id) public payable {
        logged();
        seller();
        require(id < purchases.length, "Invalid id");
        require(getHash(sellers[logins[msg.sender]].shop) == getHash(purchases[id].from), "Not your shop");
        require(purchases[id].active, "Purchase not active");

        payable(users[purchases[id].to].addr).transfer(
            purchases[id].price * purchases[id].count
        );

        shopProducts[purchases[id].from][purchases[id].productId].count += purchases[id].count;
        string memory sellerLogin = logins[msg.sender];
        purchases[id].seller = sellerLogin;
        purchases[id].time = block.timestamp;
        purchases[id].active = false;

        userActions[logins[msg.sender]].push(
            Action(
                append("Rejecting purchase with ID ", Strings.toString(id)), 
                block.timestamp
            )
        );
    }

    function confirmRefund(uint purchaseId) public payable {
        logged();
        seller();
        require(purchaseId < purchases.length, "Invalid id");
        require(
            getHash(sellers[logins[msg.sender]].shop) == getHash(refunds[purchaseRefundIds[purchaseId][1]].from), 
            "Not your shop"
        );
        require(purchaseRefundIds[purchaseId][0] == 1, "No refund requested");
        uint id = purchaseRefundIds[purchaseId][1];
        require(refunds[id].active, "Refund not active");
        require(users[logins[msg.sender]].addr != users[refunds[id].to].addr, "Your own refund");
        require(msg.value == refunds[id].price * refunds[id].count, "Invalid value");

        payable(users[refunds[id].to].addr).transfer(
            refunds[id].price * refunds[id].count
        );

        string memory sellerLogin = logins[msg.sender];
        refunds[id].seller = sellerLogin;
        refunds[id].time = block.timestamp;
        refunds[id].confirmed = true;
        refunds[id].active = false;

        userActions[logins[msg.sender]].push(
            Action(
                append("Confirming refund request for purchase with ID ", Strings.toString(id)),
                block.timestamp
            )
        );
    }

    function rejectRefund(uint purchaseId) public payable {
        logged();
        seller();
        require(purchaseId < purchases.length, "Invalid id");
        require(
            getHash(sellers[logins[msg.sender]].shop) == getHash(refunds[purchaseRefundIds[purchaseId][1]].from), 
            "Not your shop"
        );
        require(purchaseRefundIds[purchaseId][0] == 1, "No refund requested");
        uint id = purchaseRefundIds[purchaseId][1];
        require(refunds[id].active, "Refund not active");
        string memory sellerLogin = logins[msg.sender];
        refunds[id].seller = sellerLogin;
        refunds[id].time = block.timestamp;
        refunds[id].active = false;

        userActions[logins[msg.sender]].push(
            Action(
                append("Rejecting refund request for purchase with ID ", Strings.toString(id)),
                block.timestamp
            )
        );
    }

    // Функции поставщика

    function createProduct(string memory name, uint price, uint count) public {
        logged();
        provider();
        require(getHash(name) != getHash(""), "Invalid name");
        require(price > 0, "Invalid price");
        require(count > 0, "Invalid count");
        providerProducts[logins[msg.sender]].push(Product(name, price, count));

        userActions[logins[msg.sender]].push(
            Action(
                append("Creating product with ID ", Strings.toString(providerProducts[logins[msg.sender]].length -1)),
                block.timestamp
            )
        );
    }

    function confirmOrder(uint id) public {
        logged();
        provider();
        require(id < orders.length, "Invalid id");
        require(msg.sender == users[orders[id].from].addr, "Not your order");
        require(orders[id].active, "Order not active");
        require(!orders[id].confirmed, "Order already confirmed");
        orders[id].confirmed = true;
        orders[id].time = block.timestamp;

        userActions[logins[msg.sender]].push(
            Action(
                append("Confirming order with ID ", Strings.toString(id)),
                block.timestamp
            )
        );
    }

    function rejectOrder(uint id) public {
        logged();
        provider();
        require(id < orders.length, "Invalid id");
        require(msg.sender == users[orders[id].from].addr, "Not your order");
        require(orders[id].active, "Order not active");
        require(!orders[id].confirmed, "Order already confirmed");

        payable(users[orders[id].to].addr).transfer(
            orders[id].price * orders[id].count
        );

        providerProducts[logins[msg.sender]][orders[id].productId].count += orders[id].count;
        orders[id].active = false;
        orders[id].time = block.timestamp;

        userActions[logins[msg.sender]].push(
            Action(
                append("Rejecting order with ID ", Strings.toString(id)),
                block.timestamp
            )
        );
    }
}
