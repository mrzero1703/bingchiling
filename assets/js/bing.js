const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const cartCheckoutButton = document.getElementById("cartCheckoutButton");
const toast = document.getElementById("toast");
const form = document.querySelector(".order-panel");
const menuGrid = document.getElementById("menuGrid");
const menuMoreButton = document.getElementById("menuMoreButton");
const orderSelect = form?.querySelector('select[name="item"]');
const orderQuantityInput = form?.querySelector('input[name="quantity"]');

const cart = new Map();
let toastTimer;
let menuExpanded = false;
const cartLabels = {
    button: (count) => `Gi\u1ecf h\u00e0ng (${count})`,
    summary: (count) => `${count} m\u00f3n`,
    empty: "Ch\u01b0a c\u00f3 m\u00f3n n\u00e0o trong gi\u1ecf h\u00e0ng.",
    quantity: (quantity) => `S\u1ed1 l\u01b0\u1ee3ng: ${quantity}`,
    added: (itemName) => `\u0110\u00e3 th\u00eam ${itemName} v\u00e0o gi\u1ecf h\u00e0ng.`,
    removed: (itemName) => `\u0110\u00e3 b\u1ecf ${itemName} kh\u1ecfi gi\u1ecf h\u00e0ng.`,
    addButton: "Th\u00eam v\u00e0o gi\u1ecf",
    removeButton: "B\u1ecf m\u00f3n",
    removeItem: (itemName) => `B\u1ecf ${itemName} kh\u1ecfi gi\u1ecf h\u00e0ng`,
};
const menuMoreLabels = {
    more: "Xem th\u00eam menu",
    less: "Thu g\u1ecdn menu",
};

const extraMenuItems = [
    "z7775747827324_ff38780db6c4f9855bb16dde815e82af.jpg",
    "z7775747829679_e50b2bea4ba1b1e72b68def85abc056a.jpg",
    "z7775747833007_fe81a2245c671629abf944c45116d3e0.jpg",
    "z7775747844568_1489f8d86bdd5abb64da1c3c0c902230.jpg",
    "z7775747845558_c4a94356d4ed86e14c162adf03b8e48a.jpg",
    "z7775747855389_a27f258e6733c863a10fcdbe9fe43ffc.jpg",
    "z7775747862715_870bad0b4e03a433cffbf8dd13eef9a4.jpg",
    "z7775747868084_e7a356f6491bc9709eb71757a687e5fa.jpg",
    "z7775747874774_0c2cc460d8b4fead7d391ae47a57cbee.jpg",
    "z7775747876331_d46e9287fce695d11790c03fc08c5be5.jpg",
    "z7775747891015_e2a7e8282bb03e9a2e6bff3863299642.jpg",
    "z7775747893499_538849cb3a689e383190ea085ac4fa54.jpg",
    "z7775747894773_2b7b4d6d48d32cb359e0d64bc17b9bb7.jpg",
    "z7775747903492_5e44551d22528309ef9bb4dccba1fa36.jpg",
    "z7775747911107_acd5e0ed692285d2f33241881751a64b.jpg",
    "z7775747920931_6182e9d73415533cf3c79e0ae8297971.jpg",
    "z7775747927400_5b7046dff5dbd01a9399bff2a809ea20.jpg",
    "z7775747935477_90581b7b3ba215e893d6e20988da86db.jpg",
    "z7775747949367_9426f5c102fa32b59b4b791f8c7b0044.jpg",
    "z7775747961180_bdaf13cd7b17dc073f591d528f2e7c7c.jpg",
    "z7775747969018_810c1dbc4c0b9c2dd5d9f61113a86f70.jpg",
    "z7775747976803_896af6077447390e421bc46d1eac74b0.jpg",
    "z7775747991941_fa3d9797fbf8803d9ee135c4264d9067.jpg",
    "z7775747999120_a9de3bc3dda4ea24939866bf0b007913.jpg",
    "z7775748004604_cbefe39501a6671fd7cb4cf1ac6765cf.jpg",
    "z7775748011678_ead40fd3ee4b6d42699b1d70e9c75532.jpg",
    "z7775748025414_589e7a7035da806f58c620d8b4cf2d4b.jpg",
    "z7775748034847_be5727c7fa77fdc51e6a59d171f42801.jpg",
    "z7775748039406_e61c8c7cd34e1004b5048fc9c1cbdc8e.jpg",
    "z7775748046438_4542287122f42888edfc791ce39b9a03.jpg",
    "z7775748058393_98b03bc3080eaf96530cb50718bed304.jpg",
    "z7775748067561_deb2baeaddb94dbc01998db5bea792a5.jpg",
    "z7775748076732_f0f59eb3510b44a59ab11d4b096a2a97.jpg",
].map((image, index) => ({
    name: `Món Bingchiling ${String(index + 7).padStart(2, "0")}`,
    image: `menu/${image}`,
}));

function getCartCount() {
    return [...cart.values()].reduce((total, item) => total + item.quantity, 0);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderCart() {
    const cartCount = getCartCount();
    cartButton.textContent = cartLabels.button(cartCount);
    cartSummary.textContent = cartLabels.summary(cartCount);
    cartCheckoutButton.hidden = cartCount === 0;
    cartItems.innerHTML = "";

    if (cartCount === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = cartLabels.empty;
        cartItems.appendChild(emptyMessage);
        return;
    }

    cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const name = document.createElement("span");
        name.className = "cart-item-name";
        name.textContent = item.name;

        const quantity = document.createElement("span");
        quantity.className = "cart-item-qty";
        quantity.textContent = cartLabels.quantity(item.quantity);

        const removeButton = document.createElement("button");
        removeButton.className = "cart-remove-btn";
        removeButton.type = "button";
        removeButton.dataset.name = item.name;
        removeButton.textContent = cartLabels.removeButton;
        removeButton.setAttribute("aria-label", cartLabels.removeItem(item.name));

        row.append(name, quantity, removeButton);
        cartItems.appendChild(row);
    });
}

function removeCartItem(itemName) {
    if (!cart.has(itemName)) {
        return;
    }

    cart.delete(itemName);
    renderCart();
    showToast(cartLabels.removed(itemName));
}

function sendCartToOrderForm() {
    const firstCartItem = cart.values().next().value;

    if (firstCartItem && orderSelect) {
        const matchingOption = [...orderSelect.options].find((option) => option.textContent === firstCartItem.name);

        if (matchingOption) {
            orderSelect.value = matchingOption.value || matchingOption.textContent;
        }
    }

    if (orderQuantityInput) {
        orderQuantityInput.value = Math.max(getCartCount(), 1);
    }

    toggleCartPanel(false);
    document.getElementById("dat-mon")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

function toggleCartPanel(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !cartPanel.classList.contains("show");
    cartPanel.classList.toggle("show", shouldOpen);
    cartButton.setAttribute("aria-expanded", String(shouldOpen));
}

function addItemToCart(itemName) {
    const currentItem = cart.get(itemName);

    if (currentItem) {
        currentItem.quantity += 1;
    } else {
        cart.set(itemName, {
            name: itemName,
            quantity: 1,
        });
    }

    renderCart();
    toggleCartPanel(true);
    showToast(cartLabels.added(itemName));
}

function createMenuCard(item) {
    const article = document.createElement("article");
    article.className = "menu-card is-hidden extra-menu-card";

    article.innerHTML = `
        <div class="menu-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="menu-content">
            <div class="menu-top">
                <h3>${item.name}</h3>
                <span class="price">Theo menu</span>
            </div>
            <p>Món trong menu Bingchiling, xem ảnh để chọn vị và topping phù hợp.</p>
            <div class="tag-row">
                <span class="tag">Menu</span>
                <span class="tag">Món thêm</span>
            </div>
            <button class="add-btn" type="button" data-name="${item.name}">${cartLabels.addButton}</button>
        </div>
    `;

    return article;
}

function addMenuOption(item) {
    if (!orderSelect) {
        return;
    }

    const option = document.createElement("option");
    option.textContent = item.name;
    orderSelect.appendChild(option);
}

function renderExtraMenuItems() {
    if (!menuGrid) {
        return;
    }

    extraMenuItems.forEach((item) => {
        menuGrid.appendChild(createMenuCard(item));
        addMenuOption(item);
    });

    if (menuMoreButton) {
        menuMoreButton.hidden = extraMenuItems.length === 0;
    }
}

function setMenuExpanded(expanded) {
    menuExpanded = expanded;

    document.querySelectorAll(".extra-menu-card").forEach((card) => {
        card.classList.toggle("is-hidden", !menuExpanded);
    });

    if (menuMoreButton) {
        menuMoreButton.textContent = menuExpanded ? menuMoreLabels.less : menuMoreLabels.more;
        menuMoreButton.setAttribute("aria-expanded", String(menuExpanded));
    }
}

menuGrid?.addEventListener("click", (event) => {
    const button = event.target.closest(".add-btn");

    if (!button || !menuGrid.contains(button)) {
        return;
    }

    event.stopPropagation();
    addItemToCart(button.dataset.name);
});

menuMoreButton?.addEventListener("click", () => {
    setMenuExpanded(!menuExpanded);

    if (!menuExpanded) {
        document.getElementById("menu")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
});

cartButton.addEventListener("click", () => {
    renderCart();
    toggleCartPanel();
});

cartItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".cart-remove-btn");

    if (!removeButton || !cartItems.contains(removeButton)) {
        return;
    }

    event.stopPropagation();
    removeCartItem(removeButton.dataset.name);
});

cartCheckoutButton.addEventListener("click", sendCartToOrderForm);

document.addEventListener("click", (event) => {
    const clickedInsideCart = cartPanel.contains(event.target) || cartButton.contains(event.target);

    if (!clickedInsideCart) {
        toggleCartPanel(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        toggleCartPanel(false);
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Đã nhận thông tin đặt món. Bingchiling sẽ liên hệ xác nhận.");
    form.reset();
});

renderExtraMenuItems();
renderCart();
