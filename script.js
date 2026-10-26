document.addEventListener('DOMContentLoaded', () => {

  const obs = new IntersectionObserver(e => e.forEach(i => i.isIntersecting && i.target.classList.add('visible')), { threshold: 0.1 });
  document.querySelectorAll('.scroll-reveal').forEach(el => obs.observe(el));

  let failed = 0, locked = false;
  const overlay = document.getElementById('authOverlay');
  const errEl = document.getElementById('authErrorMsg');
  const lockEl = document.getElementById('lockoutTimerMsg');

  function handleLogin() {
    if (locked) return;
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value.trim();
    if (u === 'Xusanboy' && p === '1234') {
      overlay.classList.add('hidden');
      failed = 0;
    } else {
      failed++;
      if (failed >= 5) {
        locked = true;
        ['loginUsername', 'loginPassword', 'loginSubmitBtn', 'googleAuthBtn'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.disabled = true;
        });
        errEl.style.display = 'none';
        lockEl.style.display = 'block';
        lockEl.innerText = 'Too many failed attempts (5/5). Account locked.';
        setTimeout(() => {
          locked = false;
          failed = 0;
          ['loginUsername', 'loginPassword', 'loginSubmitBtn', 'googleAuthBtn'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
          });
          lockEl.style.display = 'none';
        }, 30000);
      } else {
        errEl.style.display = 'block';
        errEl.innerText = `Incorrect login. Attempt ${failed} of 5.`;
      }
    }
  }

  document.getElementById('loginSubmitBtn')?.addEventListener('click', handleLogin);

  document.getElementById('googleAuthBtn')?.addEventListener('click', () => {
    if (!locked) overlay.classList.add('hidden');
  });

  document.getElementById('spinWheelBtn')?.addEventListener('click', () => {
    const list = ['10% OFF', '20% OFF', 'FREE EXPRESS SHIPPING', '30% VIP CODE'];
    alert(`Congratulations! You won: ${list[Math.floor(Math.random() * list.length)]}! Code: AKH2026`);
  });

  const holoInput = document.getElementById('holoTextInput');
  const projText = document.getElementById('projectedText');
  const holoShirt = document.getElementById('hologramShirt');

  holoInput?.addEventListener('input', () => {
    projText.innerText = holoInput.value.trim() ? holoInput.value : 'T-SHIRT.AKH';
  });

  document.querySelectorAll('.box94 button').forEach(b => {
    b.onclick = function() {
      document.querySelectorAll('.box94 button').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      const c = this.dataset.color;
      projText.style.color = c;
      projText.style.textShadow = `0 0 10px ${c}, 0 0 25px ${c}`;
      holoShirt.style.boxShadow = `0 0 35px ${c}`;
    };
  });

  document.getElementById('saveHologramCartBtn')?.addEventListener('click', () => {
    cart.push({ title: `Hologram Custom ("${projText.innerText}")`, price: 169, qty: 1 });
    renderCart();
    cartDrawer.classList.add('active');
  });

  let wish = [];
  const wishDrawer = document.getElementById('wishlistDrawer');
  const wishBox = document.getElementById('wishlistItemsContainer');
  const wishBadge = document.getElementById('wishlistBadge');

  function renderWish() {
    wishBadge.innerText = wish.length;
    if (!wish.length) return wishBox.innerHTML = '<p class="box289">Your wishlist is empty.</p>';
    wishBox.innerHTML = wish.map((x, i) => `
      <div class="wishlist-item">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${x.img}" alt="" style="width:40px;height:40px;border-radius:6px;object-fit:cover;">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">${x.title}</div>
            <div style="color:var(--accent-cyan);font-size:0.85rem;font-weight:700;">$${x.price.toFixed(2)}</div>
          </div>
        </div>
        <button class="rw-btn" data-i="${i}" style="background:none;border:none;color:#ec4899;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');

    wishBox.querySelectorAll('.rw-btn').forEach(b => b.onclick = function() {
      const idx = +this.dataset.i;
      const t = wish[idx].title;
      wish.splice(idx, 1);
      document.querySelectorAll('.box147,.box158,.box169,.box180,.box191,.box202,.box213,.box224').forEach(c => {
        if (c.getAttribute('data-name') === t) c.querySelector('.like-btn')?.classList.remove('liked');
      });
      renderWish();
    });
  }

  document.getElementById('wishlistOpenBtn')?.addEventListener('click', () => wishDrawer.classList.add('active'));
  document.getElementById('wishlistCloseBtn')?.addEventListener('click', () => wishDrawer.classList.remove('active'));

  document.querySelectorAll('.like-btn').forEach(b => {
    b.onclick = function(e) {
      e.stopPropagation();
      const card = this.closest('[data-name]');
      const title = card.getAttribute('data-name');
      const price = +card.getAttribute('data-price');
      const img = card.getAttribute('data-img');
      this.classList.toggle('liked');
      if (this.classList.contains('liked')) wish.push({ title, price, img });
      else wish = wish.filter(i => i.title !== title);
      renderWish();
    };
  });

  let cart = [];
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBox = document.getElementById('cartItemsContainer');
  const cartBadge = document.getElementById('cartBadge');
  const subtotalEl = document.getElementById('cartSubtotal');
  const noticeEl = document.getElementById('checkoutStatusNotice');

  function renderCart() {
    cartBadge.innerText = cart.reduce((a, b) => a + b.qty, 0);
    if (!cart.length) {
      cartBox.innerHTML = '<p class="box302">Your cart is empty.</p>';
      subtotalEl.innerText = '$0.00';
      return;
    }
    let tot = 0;
    cartBox.innerHTML = cart.map((x, i) => {
      tot += x.price * x.qty;
      return `
        <div class="cart-item">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">${x.title}</div>
            <div style="color:var(--accent-cyan);font-weight:700;font-size:0.85rem;">$${(x.price * x.qty).toFixed(2)}</div>
            <div class="cart-controls">
              <button class="dec" data-i="${i}">-</button>
              <span>${x.qty}</span>
              <button class="inc" data-i="${i}">+</button>
            </div>
          </div>
          <button class="rc-btn" data-i="${i}" style="background:none;border:none;color:#ec4899;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
    }).join('');
    subtotalEl.innerText = '$' + tot.toFixed(2);

    cartBox.querySelectorAll('.inc').forEach(b => b.onclick = function() { cart[+this.dataset.i].qty++; renderCart(); });
    cartBox.querySelectorAll('.dec').forEach(b => b.onclick = function() {
      const i = +this.dataset.i;
      if (cart[i].qty > 1) cart[i].qty--; else cart.splice(i, 1);
      renderCart();
    });
    cartBox.querySelectorAll('.rc-btn').forEach(b => b.onclick = function() { cart.splice(+this.dataset.i, 1); renderCart(); });
  }

  document.getElementById('cartOpenBtn')?.addEventListener('click', () => cartDrawer.classList.add('active'));
  document.getElementById('cartCloseBtn')?.addEventListener('click', () => cartDrawer.classList.remove('active'));

  document.querySelectorAll('.addToCartBtn').forEach(b => {
    b.onclick = function() {
      if (this.classList.contains('adding')) return;
      const r = this.getBoundingClientRect();
      this.style.width = r.width + 'px';
      this.style.height = r.height + 'px';
      this.classList.add('adding');
      this.innerHTML = 'Added!';

      const card = this.closest('[data-name]');
      const title = card.getAttribute('data-name');
      const price = +card.getAttribute('data-price');
      const item = cart.find(x => x.title === title);
      if (item) item.qty++; else cart.push({ title, price, qty: 1 });
      renderCart();

      setTimeout(() => {
        this.innerHTML = 'Add';
        this.classList.remove('adding');
        this.style.width = '';
        this.style.height = '';
      }, 1500);
    };
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!cart.length) return alert('Your cart is empty!');
    noticeEl.style.display = 'block';
    cart = [];
    renderCart();
  });

  const canvas = document.getElementById('tshirtCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let color = '#111116', printText = 'cyber', angle = 0, autoRot = true, drag = false, startX = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      const scaleX = Math.cos((angle * Math.PI) / 180);
      ctx.scale(scaleX, 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(100, 60); ctx.lineTo(140, 30); ctx.lineTo(200, 30); ctx.lineTo(240, 60);
      ctx.lineTo(280, 120); ctx.lineTo(240, 150); ctx.lineTo(220, 130); ctx.lineTo(220, 300);
      ctx.lineTo(120, 300); ctx.lineTo(120, 130); ctx.lineTo(100, 150); ctx.lineTo(60, 120);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3; ctx.stroke();

      ctx.beginPath(); ctx.arc(170, 30, 30, 0, Math.PI); ctx.fillStyle = '#07070b'; ctx.fill();

      if (Math.abs(scaleX) > 0.25) {
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(printText.toUpperCase(), 170, 160);
      }
      ctx.restore();
    }

    (function loop() {
      if (autoRot) { angle = (angle + 1.5) % 360; }
      draw();
      requestAnimationFrame(loop);
    })();

    canvas.onmousedown = e => { drag = true; startX = e.clientX; autoRot = false; };
    window.onmouseup = () => drag = false;
    canvas.onmousemove = e => { if (drag) { angle += (e.clientX - startX) * 0.5; startX = e.clientX; } };

    document.getElementById('toggleRotateBtn')?.addEventListener('click', function() {
      autoRot = !autoRot;
      this.innerHTML = autoRot ? '<i class="fa-solid fa-pause"></i> Pause' : '<i class="fa-solid fa-play"></i> Play';
    });
    document.getElementById('resetRotateBtn')?.addEventListener('click', () => angle = 0);

    document.querySelectorAll('.box117 button').forEach(b => b.onclick = function() {
      document.querySelectorAll('.box117 button').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      color = this.dataset.color;
    });

    document.querySelectorAll('.box125 button').forEach(b => b.onclick = function() {
      document.querySelectorAll('.box125 button').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      printText = this.dataset.print;
    });
  }

  document.getElementById('addCustomStudioBtn')?.addEventListener('click', () => {
    cart.push({ title: 'Custom Configured T-Shirt.akh', price: 149, qty: 1 });
    renderCart();
    cartDrawer.classList.add('active');
  });

  const ageS = document.getElementById('ageSlider'), chestS = document.getElementById('chestSlider');
  function calcFit() {
    const c = +chestS.value;
    document.getElementById('ageVal').innerText = ageS.value;
    document.getElementById('chestVal').innerText = c;
    document.getElementById('recommendedSizeOutput').innerText = c < 34 ? 'S' : c <= 38 ? 'M' : c <= 42 ? 'L' : c <= 46 ? 'XL' : 'XXL';
  }
  ageS?.addEventListener('input', calcFit);
  chestS?.addEventListener('input', calcFit);

  const wS = document.getElementById('weightSlider'), hS = document.getElementById('heightSlider');
  function calcBMI() {
    const w = +wS.value, h = +hS.value / 100;
    document.getElementById('weightVal').innerText = w;
    document.getElementById('heightVal').innerText = hS.value;
    const bmi = (w / (h * h)).toFixed(1);
    const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    document.getElementById('bmiOutput').innerText = `${bmi} (${cat})`;
  }
  wS?.addEventListener('input', calcBMI);
  hS?.addEventListener('input', calcBMI);

  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you! Your message has been sent successfully to T-Shirt.akh.');
    e.target.reset();
  });
});