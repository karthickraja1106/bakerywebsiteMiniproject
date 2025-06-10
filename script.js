// hero section image slider code
const swiper = new Swiper('.slider_container', {
    effect: "fade",
    speed: 500,
    autoplay: { delay: 3000 },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    on: {
        slideChangeTransitionStart: function () {

            document.querySelectorAll('.animate-text').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = null;
            });
        }
    }


});


// Testimonial Swiper initialization


const testimonialSwiper = new Swiper('.testimonial-slider', {
    grabCursor: true,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    spaceBetween: 30,
    slidesPerView: 1,
    pagination: {
        el: '.testimonial-pagination',
        clickable: true,
    },


});


// harmburger menu code
const hamburgerMenu = document.getElementById('hamburger-menu');
const menuUl = document.querySelector('.nav_container nav ul');
hamburgerMenu.addEventListener("click", () => {
    menuUl.classList.toggle("active");
    hamburgerMenu.classList.toggle("cross");
});

// product filter code
let buttons = document.querySelectorAll(".btn")
let boxes = document.querySelectorAll(".box")
buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault()
        setActiveFun(e)
        let btn_filter = e.target.dataset.filter;

        boxes.forEach((box) => {
            if (btn_filter == "all") {
                box.style.display = "block"
            }
            else {
                let box_filter = box.dataset.item;
                if (box_filter === btn_filter) {
                    box.style.display = "block"
                }
                else {
                    box.style.display = "none"
                }
            }
        })
    })

})
function setActiveFun(e) {
    buttons.forEach((button) => {
        button.classList.remove("btn_clicked")
    })
    e.target.classList.add("btn_clicked")
}

// Order Section JS

document.addEventListener("DOMContentLoaded", function () {
    
    const products = [
        "sourdogs",
        "Wheatbreads",
        "Black Forest",
        "Cashew Cookies",
        "corissant",
        "Oats muffins"
    ];

    const tagInput = document.getElementById("tagInput");
    const dropdown = document.getElementById("form-dropdownList");
    const cartList = document.getElementById("cartList");
    let cart = [];

    // Show dropdown when typing
    tagInput.addEventListener("input", function () {
        const val = tagInput.value.toLowerCase();
        dropdown.innerHTML = "";
        if (!val) {
            dropdown.style.display = "none";
            return;
        }
        const filtered = products.filter(
            (p) => p.toLowerCase().includes(val) && !cart.some(item => item.name === p)
        );
        if (filtered.length === 0) {
            dropdown.style.display = "none";
            return;
        }
        filtered.forEach((p) => {
            const div = document.createElement("div");
            div.textContent = p;
            div.onmousedown = function (e) {
                e.preventDefault();
                selectProduct(p);
            };
            dropdown.appendChild(div);
        });
        dropdown.style.display = "block";
    });

    
    tagInput.addEventListener("blur", () => setTimeout(() => dropdown.style.display = "none", 150));

    
    function selectProduct(product) {
        const found = cart.find(item => item.name === product);
        if (found) {
            found.qty += 1;
        } else {
            cart.push({ name: product, qty: 1 });
        }
        renderCart();
        tagInput.value = "";
        dropdown.style.display = "none";
    }

    // Render cart list with quantity controls
    function renderCart() {
        cartList.innerHTML = "";
        cart.forEach((item, idx) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <button type="button" class="qty-btn" data-action="decrease" data-idx="${idx}">-</button>
                    <span style="margin:0 8px;">${item.qty}</span>
                    <button type="button" class="qty-btn" data-action="increase" data-idx="${idx}">+</button>
                    <button type="button" class="remove-btn" data-idx="${idx}">Remove</button>
                </div>
            `;
            cartList.appendChild(li);
        });

        // Quantity and remove handlers
        cartList.querySelectorAll('.qty-btn').forEach(btn => {
            btn.onclick = function () {
                const idx = parseInt(this.getAttribute('data-idx'));
                const action = this.getAttribute('data-action');
                if (action === "increase") cart[idx].qty += 1;
                if (action === "decrease" && cart[idx].qty > 1) cart[idx].qty -= 1;
                renderCart();
            };
        });
        cartList.querySelectorAll('.remove-btn').forEach(btn => {
            btn.onclick = function () {
                const idx = parseInt(this.getAttribute('data-idx'));
                cart.splice(idx, 1);
                renderCart();
            };
        });
    }

    // Order form submit
    document.getElementById("orderForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const address = document.getElementById("address").value.trim();

        if (!name || !phone || !date || !time) {
            alert("Please fill in all required fields.");
            return;
        }
        if (cart.length === 0) {
            alert("Please select at least one product.");
            return;
        }

        let summary = `Order for ${name}\nPhone: ${phone}\nDate: ${date} Time: ${time}\nAddress: ${address}\nProducts:\n`;
        cart.forEach(item => {
            summary += `- ${item.name} x${item.qty}\n`;
        });

        alert("Order placed!\n\n" + summary);

        // Reset
        document.getElementById("orderForm").reset();
        cart = [];
        renderCart();
    });
});