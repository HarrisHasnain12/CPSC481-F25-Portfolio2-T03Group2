window.addEventListener("DOMContentLoaded", renderCheckout);
window.addEventListener("DOMContentLoaded", () => {
    renderCheckout();
});

let shippingCost = 0;
let ticketTot = 0;

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

renderCheckout();


document.addEventListener("DOMContentLoaded", () => {
  const shipBox = document.getElementById("shipIt");
  const shipFields = document.getElementById("shippingFields");
  console.log("Page loaded");
  console.log("shipBox=", shipBox);
  console.log("shipFields=", shipFields);

  shipBox.addEventListener("change", () => {
    console.log("Checkbox changed. Checked=", shipBox.checked);
    if (shipBox.checked) {
        shipFields.style.display = "flex";
        document.getElementById("shipping").style.display = "flex";
        shippingCost = 20;
        renderCheckout();
    } else {
        shipFields.style.display = "none";
        document.getElementById("shipping").style.display = "none";
        document.getElementById("shippingSaved").innerHTML=""
        document.getElementById("shippingInfo").style.display = "none";
        shippingCost = 0;
        renderCheckout();
    }
    
  });
});

document.getElementById("checkout").addEventListener("click", () => {
    document.getElementById("waitPls").style.display = "flex";
    setCookie("shippingCost", shippingCost);
    setTimeout(()=>{window.location = "ticket_complete.html"}, Math.floor(Math.random() * 3000) +2000);
});

document.getElementById("saveShipping").addEventListener("click", () => {
  const name = document.getElementById("shipName").value;
  const email = document.getElementById("shipEmail").value;
  const address = document.getElementById("shipAddy").value;
  const city = document.getElementById("shipCity").value;
  const postal = document.getElementById("shipZip").value;

  const summaryDiv = document.getElementById("shippingSaved");

  summaryDiv.innerHTML = `
    <p> ${name}</p>
    <p> ${email}</p>
    <p> ${address}, ${city}, ${postal}</p>
  `;

  document.getElementById("shippingFields").style.display = "none";
  document.getElementById("shippingInfo").style.display = "flex";
});

document.getElementById("edit-btn").addEventListener("click", () => {

  const summaryDiv = document.getElementById("shippingSaved");

  summaryDiv.innerHTML = ``;

  document.getElementById("shippingFields").style.display = "flex";
  document.getElementById("shippingInfo").style.display = "none";
});

document.getElementById("deb-cred").addEventListener("click", () => {
    document.getElementById("payfield").style.display = "flex";
    document.getElementById("paymentButtons").style.display = "none";
    document.getElementById("finalCheckout").style.display = "flex";

});

document.addEventListener("DOMContentLoaded", () => {
    const requiredFields = document.querySelectorAll(".required-field-ship");
    const saveBtn = document.getElementById("saveShipping");

    function validateForm() {
        let allValid = true;

        requiredFields.forEach(field => {

            if (field.value.trim() === "") {
                field.classList.add("invalid");
                
                allValid = false;
            } else {
                field.classList.remove("invalid");
                
            }
        });
        console.log("Valid?", allValid);
        saveBtn.disabled = !allValid;
    }

    // Validate on input and when leaving a field
    requiredFields.forEach(field => {
        field.addEventListener("input", validateForm);
        field.addEventListener("blur", validateForm);
    });

    // Initial check
    validateForm();
});

document.addEventListener("DOMContentLoaded", () => {
    const requiredFields = document.querySelectorAll(".required-field");
    const saveBtn = document.getElementById("checkout");

    function validateForm() {
        let allValid = true;

        requiredFields.forEach(field => {
            const error = field.parentElement.querySelector(".error-message");

            if (field.value.trim() === "") {
                field.classList.add("invalid");
                
                allValid = false;
            } else {
                field.classList.remove("invalid");
                
            }
        });

        saveBtn.disabled = !allValid;
    };

    // Validate on input and when leaving a field
    requiredFields.forEach(field => {
        field.addEventListener("input", validateForm);
        field.addEventListener("blur", validateForm);
    });

    // Initial check
    validateForm();
});


function renderCheckout() {
  const cartContainer = document.getElementById("cart-container");
  const emptyMessage = document.getElementById ("empty-cart-message");
  const checkoutContainer = document.getElementById("checkout-container");
  checkoutContainer.innerHTML = ""; // Clear existing content

  const cartArray = Cart.load(); // Load tickets from cookie
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
  document.getElementById("sub-ship").textContent = `$${shippingCost}`;
  let truTotal = subtotal + taxes + shippingCost;
  document.getElementById("total-amount").textContent = `$${truTotal.toFixed(2)}`;
}


document.getElementById("checkout-container").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const cartItem = btn.closest(".checkout-item");
  if (!cartItem) return;

  const ticketId = cartItem.dataset.ticketId;
  let cart = Cart.load();
  let ticket = cart.find(t => t.id === ticketId);

  if (!ticket) return;

  // Handle add button
  if (btn.classList.contains("add-btn")) {
    ticket.quantity++;
    updateCartBadge();
  }

  // Handle subtract button
  else if (btn.classList.contains("sub-btn")) {
    if (ticket.quantity > 1) {
      ticket.quantity--;
      updateCartBadge();
    }
  }

  // Handle remove button
  else if (btn.classList.contains("trash-chek")) {
    const confirmed = confirm(`Remove "${ticket.name}" from your cart?`);

    if (!confirmed) {
        return;
    }
    
    cart = cart.filter(t => t.id !== ticketId);
    Cart.save(cart);
    renderCheckout();
    updateCartBadge();
    return;
  }

  // Save updated cart
  Cart.save(cart);

  // Re-render UI
  renderCheckout();
  updateCartBadge();
});

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

function updateCartBadge() {
  let cartCookie = getCookie("tickets");
  if (!cartCookie) {
    document.getElementById("cart-count").textContent = 0;
    return;
  }

  let cart;

  try {
    cart = JSON.parse(cartCookie);
  } catch (error) {
    console.error("Cart cookie JSON invalid:", error);
    document.getElementById("cart-count").textContent = 0;
    return;
  }

  // Sum all ticket quantities
  let total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  document.getElementById("cart-count").textContent = total;
}

// Call on page load
updateCartBadge();