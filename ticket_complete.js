window.addEventListener("DOMContentLoaded", renderCheckout);
window.addEventListener("DOMContentLoaded", () => {
    renderCheckout();
});

const Cart = {
    cookieName: "tickets",
    load() {
        const data = getCookie(this.cookieName);
        console.log(data);
        return data? JSON.parse(data) : [];
    },

    save(cart) {
        setCookie(this.cookieName, JSON.stringify(cart));
    },

    addTicket(ticket) {
        const cart = this.load();
        const existing = cart.find(t=> t.id === ticket.id);

        if (existing) {
            existing.quantity = ticket.quantity;
        } else {
            cart.push(ticket);
        }

        this.save(cart);
    }
};

function renderCheckout() {
  const cartContainer = document.getElementById("cart-container");
  const emptyMessage = document.getElementById ("empty-cart-message");
  const checkoutContainer = document.getElementById("checkout-container");
  checkoutContainer.innerHTML = ""; // Clear existing content

  const cartArray = Cart.load(); // Load tickets from cookie
  const shippingCostStr = getCookie("shippingCost");
  const shippingCost = +shippingCostStr;
  let index = 0;
  let subtotal = 0;

  if (cartArray.length === 0) {
    emptyMessage.style.display = "block";
    cartContainer.innerHTML = "";
    document.querySelector(".sub-amount").textContent = `$${subtotal}`;
    checkoutContainer.style.display = "none";
    return; // nothing more to render
  } else {
    emptyMessage.style.display = "none";
  }

  const template = document.getElementById("checkout-template");

  cartArray.forEach(ticket => {
    const clone = template.content.cloneNode(true); // Clone the template
    console.log("Clone: ", clone);

    const root = clone.querySelector(".checkout-item");
    root.dataset.ticketId = ticket.id;

    clone.querySelector(".checkout-title").textContent = ticket.name;
    clone.querySelector(".ticket-number").textContent = `${ticket.quantity}`;
    clone.querySelector(".ticket-price").textContent = `$${ticket.price * ticket.quantity}`;
    subtotal += ticket.price * ticket.quantity;

    checkoutContainer.appendChild(clone);
    index += 1;
  });
  
  document.getElementById("sub-amount").textContent = `$${subtotal}`;
  const taxes = subtotal * 0.05;
  document.getElementById("sub-tax").textContent = `$${taxes.toFixed(2)}`;
      console.log("Shipping Price", shippingCost);
  if (shippingCost != 0) {
    console.log("Shipping Price", shippingCost);
    document.getElementById("shipping").style.display = "flex";
    document.getElementById("sub-ship").textContent = `$${shippingCost}`;
  }
  
  let totalDec = subtotal + taxes + shippingCost;
  let total = totalDec.toFixed(2);
  
  document.getElementById("total-amount").textContent = `$${total}`;
}


function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString;
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

//retrieve cookie
function getCookie(name) {
    //const decoded = decodeURIComponent(document.cookie(name));
    const cookies = document.cookie.split("; ");
    console.log(cookies);
    for (const c of cookies) {
        const [key, val] = c.split("=");
        if (key === name) return decodeURIComponent(val);
    }
    return null;
}

document.getElementById("backHome").addEventListener("click", () => {
    document.cookie = "tickets=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "shippingCost=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});