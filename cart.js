const navigateToHome = (event) => {
    location.href = '/';
};
const changeQuantity = (event) => {
    const cart = getDataFromLocalStorage("cart");
    const id = event.target.id.toString().substring(1);
    const operation_to_be_performed = event.target.id.toString().charAt(0);
    const product_in_cart = cart.filter(item => item.id.toString() == id)[0];
    const cart_without_product = cart.filter(item => item.id != product_in_cart.id);
    if (operation_to_be_performed == '+') {
        product_in_cart.quantity = product_in_cart.quantity + 1;
        setDataInLocalStorage("cart", JSON.stringify([...cart_without_product, product_in_cart]));
        document.getElementById(id).innerText = product_in_cart.quantity.toString();
    }
    else {
        if (product_in_cart.quantity == 1) {
            setDataInLocalStorage("cart", JSON.stringify(cart_without_product));
        }
        else {
            product_in_cart.quantity = product_in_cart.quantity - 1;
            setDataInLocalStorage("cart", JSON.stringify([...cart_without_product, product_in_cart]));
            document.getElementById(id).innerText = product_in_cart.quantity.toString();
        }
    }
    document.getElementById("cartProducts").innerHTML = "";
    document.getElementById("cart").innerHTML = "";
    render_data_in_cart_ui();
    render_total_cart();
};
const render_total_cart = () => {
    const cart = getDataFromLocalStorage("cart");
    const billInfoContainerDiv = document.getElementById("cart");
    let total = 0;
    document.getElementsByClassName("cartInfoWrapper")[0].style.display = "none";
    if (cart.length > 0) {
        document.getElementsByClassName("cartInfoWrapper")[0].style.display = "block";
        cart.sort((a, b) => a.id - b.id).forEach(item => {
            const productBillDiv = document.createElement("div");
            productBillDiv.setAttribute("class", "productBillContainer");
            const productBillTitle = document.createElement("p");
            productBillTitle.setAttribute("class", "productBillTitle");
            productBillTitle.innerText = item.title;
            const productBillAmount = document.createElement("p");
            productBillAmount.setAttribute("class", "productBillAmount");
            productBillAmount.innerHTML = `&#8377;` + parseInt(item.price) * item.quantity;
            total += parseInt(item.price) * item.quantity;
            productBillDiv.appendChild(productBillTitle);
            productBillDiv.appendChild(productBillAmount);
            billInfoContainerDiv.appendChild(productBillDiv);
        });
        const totalAmountDiv = document.createElement("div");
        totalAmountDiv.setAttribute("class", "totalCartAmountContainer");
        const billTotalTitle = document.createElement("p");
        billTotalTitle.setAttribute("class", "billTotalTitle");
        billTotalTitle.innerText = "Grand Total";
        const billTotalAmount = document.createElement("p");
        billTotalAmount.setAttribute("class", "billTotalAmount");
        billTotalAmount.innerHTML = `&#8377;` + total;
        totalAmountDiv.appendChild(billTotalTitle);
        totalAmountDiv.appendChild(billTotalAmount);
        billInfoContainerDiv.appendChild(totalAmountDiv);
    }
};
const getDataFromLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key) || "[]");
const setDataInLocalStorage = (key, value) => window.localStorage.setItem(key, value);
const addProductsInUI = (productsData, appendTo) => {
    var _a;
    if (productsData.length < 1) {
        const no_cart_text = document.createElement("span");
        no_cart_text.setAttribute("class", "noCartText");
        no_cart_text.innerText = "No items in the cart!";
        appendTo.appendChild(no_cart_text);
    }
    else {
        (_a = productsData === null || productsData === void 0 ? void 0 : productsData.sort((a, b) => a.id - b.id)) === null || _a === void 0 ? void 0 : _a.forEach((item, index) => {
            const cardDiv = document.createElement("div");
            cardDiv.setAttribute("class", "productCardContainer");
            const imgTag = document.createElement("img");
            imgTag.setAttribute("alt", `${item}Image${index}`);
            imgTag.setAttribute("src", item.image);
            imgTag.setAttribute("class", "productImg");
            const cardContentDiv = document.createElement("div");
            cardContentDiv.setAttribute("class", "cardContentContainer");
            const titleTag = document.createElement("p");
            titleTag.innerText = item.title;
            titleTag.setAttribute("onClick", "navigateToProduct(event)");
            titleTag.setAttribute("class", "productTitle");
            const priceContainer = document.createElement("div");
            priceContainer.setAttribute("class", "priceContainer");
            const priceTag = document.createElement("p");
            priceTag.setAttribute("class", "priceInfo");
            priceTag.innerHTML = "Price: " + `&#8377;` + item.price;
            const cartBtn = document.createElement("button");
            cartBtn.setAttribute("class", "productCartButton");
            const decBtn = document.createElement("button");
            decBtn.innerText = "-";
            decBtn.setAttribute("id", "-" + item.id);
            decBtn.setAttribute("onclick", "changeQuantity(event)");
            const incBtn = document.createElement("button");
            incBtn.innerText = "+";
            incBtn.setAttribute("id", "+" + item.id);
            incBtn.setAttribute("onclick", "changeQuantity(event)");
            const quanitityText = document.createElement("p");
            quanitityText.setAttribute("id", item.id);
            quanitityText.innerText = item.quantity;
            cartBtn.appendChild(decBtn);
            cartBtn.appendChild(quanitityText);
            cartBtn.appendChild(incBtn);
            priceContainer.appendChild(priceTag);
            priceContainer.appendChild(cartBtn);
            cardContentDiv.appendChild(titleTag);
            cardContentDiv.appendChild(priceContainer);
            cardDiv.appendChild(imgTag);
            cardDiv.appendChild(cardContentDiv);
            appendTo.appendChild(cardDiv);
        });
    }
};
const render_data_in_cart_ui = () => {
    const cartData = getDataFromLocalStorage("cart");
    addProductsInUI(cartData, document.getElementById("cartProducts"));
};
render_data_in_cart_ui();
render_total_cart();
// export {};
