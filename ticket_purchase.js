const btn = document.getElementById('dropdownBtn');
const menu = document.getElementById('dropdownMenu');
const menuItems = dropdownMenu.querySelectorAll('a[data-ticket]');
const descriptions = document.querySelectorAll('.desc');
const header = document.getElementById('ticketHeader');
const dayButtons = document.querySelectorAll('.ticket-btn');
const buyNow = document.getElementById('buyNow');
const addCart = document.getElementById('addCart');
const display = document.getElementById("ticketCount");
const addBtn = document.getElementById("add");
const subtractBtn = document.getElementById("subtract");
const ticketPrice = document.getElementById("ticketPrice");
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
let count = 1;
let price = 0;
let selectedTicket = null;
let cartArray = Cart.load();

//Script to show and hide dropdown
btn.addEventListener('click', () => {
  menu.classList.toggle('show');
  menu.classList.toggle('hide');
});

// Optional: close menu when clicking outside
document.addEventListener('click', (event) => {
    console.log(event.target);
  if (!btn.contains(event.target)) {
    menu.classList.remove('show');
    menu.classList.add('hide');
  }
});


//Script to show appropriate ticket details when selected
menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); // prevents page jump

    const ticket = item.getAttribute('data-ticket');
    const label = item.getAttribute('data-display') || item.innerText;
    price = parseFloat(item.getAttribute('data-price'));

    // Hide all descriptions
    descriptions.forEach(desc => desc.style.display = 'none');

    // Show the matching one
    const toShow = document.getElementById(`desc-${ticket}`);
    if (toShow) {
        toShow.style.display = 'block';
        selectedTicket = {
            id: ticket,
            price: price,
            descriptionID: "desc-" + ticket,
            name: label
        };
    };

    if (ticket === "4day" || "ultimate" || "vip") {
            for (i=0; i < dayButtons.length; i++) {
                if (!dayButtons[i].classList.contains("selected")){dayButtons[i].classList.add("selected");}
            };
        };

    //Update header text
    header.innerText = `${label}`;
    ticketPrice.textContent = (price * count);
  });
});


//Script to select buttons and show appropriate descriptions
dayButtons.forEach(button => {
    button.addEventListener('click', () => {
        //Toggle selected state
        button.classList.toggle('selected');
        if (!button.classList.contains("selected")) {
            button.classList.add("selected");
        };

        //Get all selected buttons
        const selectedButtons = document.querySelectorAll('.ticket-btn.selected');
        descriptions.forEach(desc => desc.style.display = 'none');
        if (selectedButtons.length === 0) {
            header.innerText = `Select Ticket`
            price = 0;
            updateDisplay();
            return;
        };

        //Removes selected class if not the clicked button
        for (i=0; i < dayButtons.length; i++) {
            if (dayButtons[i] != button) {dayButtons[i].classList.remove('selected');};
        };

        //Gets data to show user
        const ticket = button.getAttribute('data-ticket');
        price = button.getAttribute('data-price');
        const toShow = document.getElementById(`desc-${ticket}`);

        if (toShow) toShow.style.display = 'block';

        const label = button.getAttribute("data-display");
        header.innerText = `${label}`;
        updateDisplay();
    });
});

add1.addEventListener("click", () => {
count++;
updateDisplay();
});

sub1.addEventListener("click", () => {
if (count > 1) count--;   // prevents negative numbers
updateDisplay();
});

function updateDisplay () {
    ticketPrice.textContent = (count * price);
    display.textContent = count;
}

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

//Cookie to persist ticket data [I'm the problem now >:)]
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