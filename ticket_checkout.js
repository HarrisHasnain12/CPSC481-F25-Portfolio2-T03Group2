
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
    } else {
        shipFields.style.display = "none";
    }
    
  });
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

document.getElementById("deb-cred").addEventListener("click", () => {
    document.getElementById("payfield").style.display = "flex";
    document.getElementById("paymentButtons").style.display = "none";
    document.getElementById("finalCheckout").style.display = "flex";

});