window.addEventListener("DOMContentLoaded", renderCart);
window.addEventListener("DOMContentLoaded", () => {
    renderCart();
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
}

renderCart();

function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const emptyMessage = document.getElementById ("empty-cart-message");
  const checkoutContainer = document.getElementById("checkout-container");
  cartContainer.innerHTML = ""; // Clear existing content

  const cartArray = Cart.load(); // Load tickets from cookie
  let index = 0;
  let subtotal = 0;

  if (cartArray.length === 0) {
    emptyMessage.style.display = "block";
    cartContainer.innerHTML = "";
    document.querySelector(".subtotal-amount").textContent = `$${subtotal}`;
    checkoutContainer.style.display = "none";
    return; // nothing more to render
  } else {
    emptyMessage.style.display = "none";
    checkoutContainer.style.display = "flex";
    checkoutContainer.style.flexDirection = "row";
    checkoutContainer.style.justifyContent = "center";
  }

  const template = document.getElementById("cart-item-template");

  cartArray.forEach(ticket => {
    const clone = template.content.cloneNode(true); // Clone the template
    console.log("Clone: ", clone);

    const root = clone.querySelector(".cart-item");
    root.dataset.ticketId = ticket.id;

    clone.querySelector(".true-title").textContent = ticket.name;
    clone.querySelector(".ticket-info").innerHTML =
      document.getElementById(ticket.descriptionId)?.outerHTML || "";
    clone.querySelector(".ticket-number").textContent = `${ticket.quantity}`;
    clone.querySelector(".ticket-price").textContent = `Price: $${ticket.price * ticket.quantity}`;
    subtotal += ticket.price * ticket.quantity;

    cartContainer.appendChild(clone);
    document.querySelectorAll(".desc")[index].style.display = "block";
    index += 1;
  });
  
  document.querySelector(".subtotal-amount").textContent = `$${subtotal}`;
}


document.getElementById("cart-container").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const cartItem = btn.closest(".cart-item");
  if (!cartItem) return;

  const ticketId = cartItem.dataset.ticketId;
  let cart = Cart.load();
  let ticket = cart.find(t => t.id === ticketId);

  if (!ticket) return;

  // Handle add button
  if (btn.classList.contains("add-btn")) {
    ticket.quantity++;
  }

  // Handle subtract button
  else if (btn.classList.contains("sub-btn")) {
    if (ticket.quantity > 1) {
      ticket.quantity--;
    }
  }

  // Handle remove button
  else if (btn.classList.contains("trash-btn")) {
    const confirmed = confirm(`Remove "${ticket.name}" from your cart?`);

    if (!confirmed) {
        return;
    }
    
    cart = cart.filter(t => t.id !== ticketId);
    Cart.save(cart);
    renderCart();
    return;
  }

  // Save updated cart
  Cart.save(cart);

  // Re-render UI
  renderCart();
});


function addToCart() {
    if (!selectedTicket) {
        alert("Please select a ticket first.");
        return;
    }

    let cartArray = Cart.load();
    console.log("Adding ticket:", selectedTicket);
    Cart.addTicket({
        id: selectedTicket.id,
        price: selectedTicket.price,
        descriptionId: selectedTicket.descriptionID,
        name: selectedTicket.name,
        quantity: count
    });
    console.log(document.cookie);
    console.log("Ticket added!");
    console.log("Cart upadated:", Cart.load());
};

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