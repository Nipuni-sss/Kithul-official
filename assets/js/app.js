document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Plus/Minus Quantity Controllers
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const input = document.getElementById(targetId);
            let val = parseInt(input.value);

            if (e.target.classList.contains('plus')) {
                input.value = val + 1;
            } else if (e.target.classList.contains('minus') && val > 1) {
                input.value = val - 1;
            }
        });
    });

    // Multi-Item Cart Logic
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartItemsList = document.getElementById('cartItemsList');
    const subTotalTxt = document.getElementById('subTotalTxt');
    const totalTxt = document.getElementById('totalTxt');
    const cartBadge = document.getElementById('cartBadge');
    const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');

    let deliveryCost = 400;
    let cartItems = [];

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.size-checkbox:checked');
            
            if (checkboxes.length === 0) {
                alert('Please select at least one size by checking the box.');
                return;
            }

            cartItems = [];
            let subtotal = 0;
            let totalQty = 0;
            let listHTML = '';

            checkboxes.forEach(cb => {
                const size = cb.getAttribute('data-size');
                const price = parseInt(cb.getAttribute('data-price'));
                const qtyInput = document.getElementById(`qty${size}`);
                const qty = parseInt(qtyInput.value);
                const itemTotal = price * qty;

                subtotal += itemTotal;
                totalQty += qty;

                cartItems.push({
                    size: size,
                    price: price,
                    qty: qty,
                    total: itemTotal
                });

                listHTML += `
                    <div style="background: #F9F8F6; padding: 10px 12px; border-radius: 6px; margin-bottom: 8px;">
                        <strong>Kithul Handle (${size} Inches)</strong><br>
                        <small>Rs. ${price.toLocaleString()} × ${qty}</small>
                        <span style="float: right; font-weight:700;">Rs. ${itemTotal.toLocaleString()}</span>
                    </div>
                `;
            });

            // Update UI
            cartItemsList.innerHTML = listHTML;
            subTotalTxt.innerText = `Rs. ${subtotal.toLocaleString()}`;
            totalTxt.innerText = `Rs. ${(subtotal + deliveryCost).toLocaleString()}`;
            cartBadge.innerText = totalQty;
        });
    }

    // WhatsApp Order Generation
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                alert('Please select your preferred sizes and click "Add Selected Sizes To Cart" first.');
                return;
            }

            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const address = document.getElementById('custAddress').value.trim();

            if (!name || !phone || !address) {
                alert('Please fill in your Name, Phone Number, and Address.');
                return;
            }

            const myWhatsappNumber = "940742301077"; 

            let itemsMessage = '';
            let subtotal = 0;

            cartItems.forEach(item => {
                itemsMessage += `• *${item.size}" Handle:* ${item.qty} qty (Rs. ${item.total})%0A`;
                subtotal += item.total;
            });

            const message = `*NEW ORDER - KITHUL HANDLES*%0A%0A` +
                `*ITEMS ORDERED:*%0A${itemsMessage}%0A` +
                `*Subtotal:* Rs. ${subtotal.toLocaleString()}%0A` +
                `*Delivery:* Rs. 400%0A` +
                `*Total Amount:* Rs. ${(subtotal + 400).toLocaleString()}%0A%0A` +
                `*CUSTOMER DETAILS:*%0A` +
                `*Name:* ${name}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Address:* ${address}`;

            window.open(`https://wa.me/${myWhatsappNumber}?text=${message}`, '_blank');
        });
    }
});