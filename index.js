var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const get_data = (url) => __awaiter(void 0, void 0, void 0, function* () { return (yield fetch(`https://fakestoreapi.com/products/${url}`)).json(); });
const get_data_from_local_storage = (key) => JSON.parse(window.localStorage.getItem(key) || "[]");
const set_data_in_local_storage = (key, value) => window.localStorage.setItem(key, value);
const getProductId = () => window.location.search.split('?')[1].split("=")[1];
const getProductDetails = () => get_data_from_local_storage("products").filter(item => item.id == getProductId())[0];
const get_products_in_cateogory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    if (get_data_from_local_storage(category).length == 0) {
        const products_in_category = yield get_data(`category/${category}`);
        set_data_in_local_storage(category, JSON.stringify(products_in_category));
    }
    else {
        const products_in_category = get_data_from_local_storage(category);
        return products_in_category;
    }
});
const get_all_categories = () => __awaiter(void 0, void 0, void 0, function* () {
    if (get_data_from_local_storage("categories").length == 0) {
        console.log("JHIII");
        const categories = yield get_data("categories");
        set_data_in_local_storage("categories", JSON.stringify(categories));
        return categories;
    }
    else {
        const categories = get_data_from_local_storage("categories");
        return categories;
    }
});
const get_all_products = () => __awaiter(void 0, void 0, void 0, function* () {
    if (get_data_from_local_storage("products").length == 0) {
        const products = yield get_data("");
        set_data_in_local_storage("products", JSON.stringify(products));
        set_data_in_local_storage("filtered_products", JSON.stringify(products));
        return products;
    }
    else {
        const products = get_data_from_local_storage("products");
        return products;
    }
});
const navigate_to_home_page = (event) => location.href = '/';
const navigateToCart = (event) => location.href = "/cart.html";
const navigateToProduct = (event) => {
    const products = get_data_from_local_storage("products");
    const product = products.filter(item => item.title.trim() == [...event.currentTarget.parentElement.childNodes][1].innerText)[0];
    location.href = `./product.html?id=${product.id}`;
};
const navigate_to_category_page = (event) => {
    const title = [...event.target.parentElement.childNodes][0].innerText.toString().toLocaleLowerCase();
    location.href = `./category.html?title=${title}`;
};
const set_product_data_in_ui = () => {
    const { image, category, price, description, title, rating } = getProductDetails();
    document.getElementById("image").setAttribute("src", image);
    document.getElementById("description").innerText = description;
    document.getElementById("rating").style.width = `${rating.rate * 150 / 5}px`;
    document.getElementById("title").innerText = title.toString().toLocaleUpperCase();
    document.getElementById("category").innerText = category.charAt(0).toLocaleUpperCase() + category.substr(1);
};
const add_products_in_ui = (all_products, append_to) => {
    // const categoryData : Product[] = get_data_from_local_storage(category);
    all_products === null || all_products === void 0 ? void 0 : all_products.forEach((item, index) => {
        const card_div = document.createElement("div");
        card_div.setAttribute("class", "productCardContainer");
        const image = document.createElement("img");
        image.setAttribute("alt", `${item}Image${index}`);
        image.setAttribute("src", item.image);
        image.setAttribute("class", "productImg");
        const title = document.createElement("p");
        title.innerText = item.title;
        title.setAttribute("onClick", "navigateToProduct(event)");
        title.setAttribute("class", "productTitle");
        const price_container = document.createElement("div");
        price_container.setAttribute("class", "priceContainer");
        const price = document.createElement("span");
        price.setAttribute("class", "priceInfo");
        price.innerHTML = `&#8377;` + item.price;
        const cart = get_data_from_local_storage("cart") || [];
        const found = cart === null || cart === void 0 ? void 0 : cart.filter(i => item.id == i.id)[0];
        const cart_button = document.createElement("button");
        cart_button.setAttribute("id", "Cart " + item.id);
        if (!found) {
            cart_button.setAttribute("onclick", "add_to_cart(event)");
            cart_button.innerText = "ADD";
            cart_button.setAttribute("class", "productCartButton");
        }
        else {
            cart_button.setAttribute("class", "productCartBtn");
            const decrease_button = document.createElement("button");
            decrease_button.innerText = "-";
            const decrease_button_id = "-" + item.id;
            decrease_button.setAttribute("id", decrease_button_id);
            decrease_button.setAttribute("onclick", "change_quantity(event)");
            const increase_button = document.createElement("button");
            increase_button.innerText = "+";
            const increase_button_id = "+" + item.id;
            increase_button.setAttribute("id", increase_button_id);
            increase_button.setAttribute("onclick", "change_quantity(event)");
            const quantity = document.createElement("span");
            quantity.setAttribute("id", String(found.id));
            quantity.innerText = String(found.quantity);
            cart_button.appendChild(decrease_button);
            cart_button.appendChild(quantity);
            cart_button.appendChild(increase_button);
        }
        price_container.appendChild(price);
        price_container.appendChild(cart_button);
        card_div.appendChild(image);
        card_div.appendChild(title);
        card_div.appendChild(price_container);
        append_to.appendChild(card_div);
    });
};
const selected_sort = (event) => {
    const operation = event.target.value.charAt(0);
    const filter = event.target.value.toString().substring(1);
    const all_products = get_data_from_local_storage("products");
    if (filter == 'price' && operation == '+')
        all_products.sort((a, b) => a[filter] - b[filter]);
    if (filter == 'price' && operation == '-')
        all_products.sort((a, b) => b[filter] - a[filter]);
    if (filter == 'rating' && operation == '+')
        all_products.sort((a, b) => a[filter].rate - b[filter].rate);
    if (filter == 'rating' && operation == '-')
        all_products.sort((a, b) => b[filter].rate - a[filter].rate);
    set_data_in_local_storage("filtered_products", JSON.stringify(all_products));
    console.log(operation);
    const parent_element = document.getElementById("products");
    parent_element.innerHTML = "";
    initialize_ui();
};
const selected_filter = (event) => {
    const rating = parseInt(event.target.value);
    const all_products = get_data_from_local_storage("products");
    const filtered_products = all_products.filter(item => item.rating.rate > rating);
    set_data_in_local_storage("filtered_products", JSON.stringify(filtered_products));
    const parent_element = document.getElementById("products");
    parent_element.innerHTML = "";
    initialize_ui();
};
const initialize_ui = () => {
    const parent_element = document.getElementById("products");
    const filtered_products = get_data_from_local_storage("filtered_products");
    add_products_in_ui(filtered_products, parent_element);
};
const change_quantity = (event) => {
    const cart = get_data_from_local_storage("cart");
    const id = event.target.id.toString().substring(1);
    const operation_to_be_performed = event.target.id.toString().charAt(0);
    const product_in_cart = cart.filter(item => item.id.toString() == id)[0];
    const cart_without_product = cart.filter(item => item.id != product_in_cart.id);
    if (operation_to_be_performed == '+') {
        product_in_cart.quantity = product_in_cart.quantity + 1;
        set_data_in_local_storage("cart", JSON.stringify([...cart_without_product, product_in_cart]));
        document.getElementById(id).innerText = product_in_cart.quantity.toString();
    }
    else {
        if (product_in_cart.quantity == 1) {
            set_data_in_local_storage("cart", JSON.stringify(cart_without_product));
            if (location.pathname == '/category.html') {
                document.getElementById("products").innerHTML = "";
                initialize_category_ui(true);
            }
            else {
                initialize_ui();
                document.getElementById("products").innerHTML = "";
            }
        }
        else {
            product_in_cart.quantity = product_in_cart.quantity - 1;
            set_data_in_local_storage("cart", JSON.stringify([...cart_without_product, product_in_cart]));
            document.getElementById(id).innerText = product_in_cart.quantity.toString();
        }
    }
};
const add_to_cart = (event) => {
    const product_title = [...event.target.parentElement.parentElement.childNodes][1].innerText;
    const products = get_data_from_local_storage("filtered_products");
    const product = products.filter(item => item.title.trim() == product_title)[0];
    const cart = get_data_from_local_storage("cart");
    const found_in_cart = cart.filter(item => item.title == product_title)[0];
    if (found_in_cart) {
        const new_cart = cart.filter(item => item.title.trim() != product_title);
        found_in_cart.quantity = found_in_cart.quantity + 1;
        new_cart.push(found_in_cart);
        set_data_in_local_storage("cart", JSON.stringify(new_cart));
    }
    else {
        const product_to_be_added_in_cart = Object.assign(Object.assign({}, product), { quantity: 1 });
        if (cart && cart.length > 0)
            set_data_in_local_storage("cart", JSON.stringify([...cart, product_to_be_added_in_cart]));
        else
            set_data_in_local_storage("cart", JSON.stringify([product_to_be_added_in_cart]));
    }
    const cart_button = document.getElementById(event.target.id);
    cart_button.innerHTML = "";
    cart_button.setAttribute("class", "productCartBtn");
    const decrease_button = document.createElement("button");
    decrease_button.innerText = "-";
    const decrease_button_id = "-" + product.id;
    decrease_button.setAttribute("id", decrease_button_id);
    decrease_button.setAttribute("onclick", "change_quantity(event)");
    const increase_button = document.createElement("button");
    increase_button.innerText = "+";
    const increase_button_id = "+" + product.id;
    increase_button.setAttribute("id", increase_button_id);
    increase_button.setAttribute("onclick", "change_quantity(event)");
    const quanitity = document.createElement("span");
    quanitity.setAttribute("id", event.target.id.split(" ")[1]);
    quanitity.innerText = String(1);
    cart_button.appendChild(decrease_button);
    cart_button.appendChild(quanitity);
    cart_button.appendChild(increase_button);
    cart_button.removeAttribute("onclick");
};
const selected_category_filter = (event) => {
    const category = window.location.search.replace("%20", " ").replace("%27", "'").split("?")[1].split("=")[1];
    const rating = parseInt(event.target.value);
    const all_products = get_data_from_local_storage(category);
    const filtered_products = all_products.filter(item => item.rating.rate > rating);
    set_data_in_local_storage("filtered_category", JSON.stringify(filtered_products));
    const parent_element = document.getElementById("products");
    parent_element.innerHTML = "";
    initialize_category_ui(false);
};
const selected_category_sort = (event) => {
    const category = window.location.search.replace("%20", " ").replace("%27", "'").split("?")[1].split("=")[1];
    const operation = event.target.value.charAt(0);
    const filter = event.target.value.toString().substring(1);
    const all_products = get_data_from_local_storage(category);
    if (filter == 'price' && operation == '+')
        all_products.sort((a, b) => a[filter] - b[filter]);
    if (filter == 'price' && operation == '-')
        all_products.sort((a, b) => b[filter] - a[filter]);
    if (filter == 'rating' && operation == '+')
        all_products.sort((a, b) => a[filter].rate - b[filter].rate);
    if (filter == 'rating' && operation == '-')
        all_products.sort((a, b) => b[filter].rate - a[filter].rate);
    set_data_in_local_storage("filtered_category", JSON.stringify(all_products));
    const parent_element = document.getElementById("products");
    parent_element.innerHTML = "";
    initialize_category_ui(false);
};
const initialize_category_ui = (flag) => {
    const category = window.location.search.replace("%20", " ").replace("%27", "'").split("?")[1].split("=")[1];
    const category_div = document.getElementById("products");
    const categoryTitle = document.createElement("p");
    categoryTitle.setAttribute("class", "categoryTitle");
    categoryTitle.innerText = category.charAt(0).toLocaleUpperCase() + category.substring(1);
    category_div.appendChild(categoryTitle);
    const category_products_div = document.createElement("div");
    category_products_div.setAttribute("class", "categoryProductsContainer");
    category_div.appendChild(category_products_div);
    const caregory_data = get_data_from_local_storage(category);
    if (flag)
        set_data_in_local_storage("filtered_category", JSON.stringify(caregory_data));
    add_products_in_ui(get_data_from_local_storage("filtered_category"), category_products_div);
};
const initialize_data = () => __awaiter(void 0, void 0, void 0, function* () {
    const all_categories = yield get_all_categories();
    yield get_all_products();
    all_categories.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield get_products_in_cateogory(item);
    }));
    setTimeout(() => {
        initialize_ui();
    }, 1000);
});
if (location.pathname == '/index.html' || location.pathname == '/')
    initialize_data();
if (location.pathname == '/category.html' || location.pathname == '/category')
    initialize_category_ui(true);
if (location.pathname == '/product.html')
    set_product_data_in_ui();
// export {};
