const btn = document.getElementById('dropdownBtn');
const menu = document.getElementById('dropdownMenu');
const menuItems = dropdownMenu.querySelectorAll('a[data-ticket]');
const descriptions = document.querySelectorAll('.desc');
const header = document.getElementById('ticketHeader');
const dayButtons = document.querySelectorAll('.ticket-btn');
const buyNow = document.getElementById('buyNow');
const addCart = document.getElementById('addCart');

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

    // Hide all descriptions
    descriptions.forEach(desc => desc.style.display = 'none');

    // Show the matching one
    const toShow = document.getElementById(`desc-${ticket}`);
    if (toShow) {
      toShow.style.display = 'block';
    }

    //Update header text
    header.innerText = `${label}`;
    //document.getElementById('ticketMenu').classList.remove('show');
  });
});


//Script to select buttons and show appropriate descriptions
dayButtons.forEach(button => {
    button.addEventListener('click', () => {
        //Toggle selected state
        button.classList.toggle('selected');

        //Get all selected buttons
        const selectedButtons = document.querySelectorAll('.ticket-btn.selected');
        descriptions.forEach(desc => desc.style.display = 'none');
        if (selectedButtons.length === 0) {
            header.innerText = `Select Ticket`
            return;
        }

        if (selectedButtons.length > 1) {
            const descToShow = document.getElementById(`desc-4day`);
            if (descToShow) {
                descToShow.style.display = 'block';
                return;
            }
        }

        const ticket = button.getAttribute('data-ticket');
        const toShow = document.getElementById(`desc-${ticket}`);
        if (toShow) toShow.style.display = 'block';

        const label = item.getAttribute('data-display') || item.innerText;
        header.innerText = `${label}`;
    });
});

buyNow.addEventListener('click', () => {
    
});