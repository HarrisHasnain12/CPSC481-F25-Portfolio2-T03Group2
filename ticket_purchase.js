const btn = document.getElementById('dropdownBtn');
const menu = document.getElementById('dropdownMenu');

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