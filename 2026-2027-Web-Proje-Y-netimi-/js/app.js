/**
 * AKBABA DEPO - TANITIM VE ENVANTER KONSOLU
 * Dosya: js/app.js
 * Saf Vanilla JavaScript (Harici kütüphane bağımlılığı yoktur)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initTaxCalculator();
  initMobileMenu();
  initInventoryConsole();
});

/**
 * 1. Modül Ekran Görüntüleri & Sekme (Tab) Değiştirici
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (!tabButtons.length || !tabPanes.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

/**
 * 2. Canlı KDV ve Fiyat Hesaplama Simülatörü
 */
function initTaxCalculator() {
  const priceInput = document.getElementById('calc-price');
  const taxRateSelect = document.getElementById('calc-tax-rate');
  const quantityInput = document.getElementById('calc-quantity');

  const displayBase = document.getElementById('disp-base-price');
  const displayTax = document.getElementById('disp-tax-amount');
  const displayTotal = document.getElementById('disp-total-price');

  if (!priceInput || !taxRateSelect || !quantityInput) return;

  function calculate() {
    const unitPrice = parseFloat(priceInput.value) || 0;
    const taxRate = parseFloat(taxRateSelect.value) || 0;
    const quantity = parseFloat(quantityInput.value) || 1;

    const baseTotal = unitPrice * quantity;
    const taxAmount = baseTotal * (taxRate / 100);
    const grandTotal = baseTotal + taxAmount;

    const formatTL = (val) => {
      return '₺' + val.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    if (displayBase) displayBase.textContent = formatTL(baseTotal);
    if (displayTax) displayTax.textContent = formatTL(taxAmount);
    if (displayTotal) displayTotal.textContent = formatTL(grandTotal);
  }

  priceInput.addEventListener('input', calculate);
  taxRateSelect.addEventListener('change', calculate);
  quantityInput.addEventListener('input', calculate);

  calculate();
}

/**
 * 3. Mobil Hamburger Menü Aç/Kapa
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Menüdeki linklere tıklanınca mobilde menüyü kapat
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/**
 * 4. Canlı Stok ve Envanter Konsolu (CRUD & Arama & Modal Simülasyonu)
 */
function initInventoryConsole() {
  // Başlangıç envanter verileri (Ekran görüntülerinizdeki gerçek Akbaba Depo verisiyle)
  let inventory = [
    {
      id: 1,
      code: 'KBL-101',
      name: 'A KABLO (3x2.5mm Bakır Tesisat Kablosu)',
      category: 'Kablo & Tel',
      location: '3B RAF 15',
      quantity: 25,
      unit: 'Metre',
      unitPrice: 120.00,
      taxRate: 20
    }
  ];

  const tbody = document.getElementById('inventory-tbody');
  const statItemCount = document.getElementById('stat-item-count');
  const statTotalQty = document.getElementById('stat-total-qty');
  const statTotalVal = document.getElementById('stat-total-val');
  const searchInput = document.getElementById('console-search-input');

  const modal = document.getElementById('product-modal');
  const btnOpenModal = document.getElementById('btn-open-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const productForm = document.getElementById('product-form');

  const inpPrice = document.getElementById('inp-price');
  const inpTax = document.getElementById('inp-tax');
  const modalTaxSum = document.getElementById('modal-tax-sum');
  const modalPriceSum = document.getElementById('modal-price-sum');

  const formatTL = (val) => {
    return '₺' + val.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Tabloyu ve istatistikleri ekrana render et
  function render(data = inventory) {
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            Arama kriterinize uygun veya kayıtlı ürün bulunmamaktadır.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = data.map(item => {
        const itemTax = item.unitPrice * (item.taxRate / 100);
        const itemGross = item.unitPrice + itemTax;
        const totalRowVal = itemGross * item.quantity;

        return `
          <tr>
            <td><span class="table-tag tag-red mono">${item.code}</span></td>
            <td><strong>${item.name}</strong></td>
            <td>
              <span class="table-tag">${item.category}</span>
              <span class="mono" style="font-size: 0.75rem; color: #64748b; margin-left: 4px;">${item.location}</span>
            </td>
            <td class="mono"><strong>${item.quantity}</strong> ${item.unit}</td>
            <td class="mono">${formatTL(item.unitPrice)}</td>
            <td class="mono" style="color: #64748b;">%${item.taxRate}</td>
            <td class="mono" style="color: var(--color-primary); font-weight: 700;">${formatTL(totalRowVal)}</td>
            <td style="text-align: right;">
              <button class="btn-icon-danger" data-delete-id="${item.id}" title="Ürünü Sil" aria-label="Ürünü Sil">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" style="stroke-width: 2;">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Toplam istatistikleri güncelle
    if (statItemCount) statItemCount.textContent = inventory.length + ' Çeşit';
    
    const totalQuantity = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
    if (statTotalQty) statTotalQty.textContent = totalQuantity.toLocaleString('tr-TR');

    const totalPortfolioVal = inventory.reduce((acc, curr) => {
      const gross = curr.unitPrice * (1 + curr.taxRate / 100);
      return acc + (gross * curr.quantity);
    }, 0);
    if (statTotalVal) statTotalVal.textContent = formatTL(totalPortfolioVal);

    // Silme butonlarına olay dinleyicisi bağla
    const deleteButtons = tbody.querySelectorAll('[data-delete-id]');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idToDelete = parseInt(btn.getAttribute('data-delete-id'), 10);
        inventory = inventory.filter(p => p.id !== idToDelete);
        render();
      });
    });
  }

  // Arama filtresi
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
      render(filtered);
    });
  }

  // Modal içindeki canlı vergi hesaplaması
  function updateModalTax() {
    if (!inpPrice || !inpTax || !modalTaxSum || !modalPriceSum) return;
    const price = parseFloat(inpPrice.value) || 0;
    const taxRate = parseFloat(inpTax.value) || 0;
    const taxVal = price * (taxRate / 100);
    const grossVal = price + taxVal;

    modalTaxSum.textContent = formatTL(taxVal);
    modalPriceSum.textContent = formatTL(grossVal);
  }

  if (inpPrice) inpPrice.addEventListener('input', updateModalTax);
  if (inpTax) inpTax.addEventListener('change', updateModalTax);

  // Modal Aç/Kapa
  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      updateModalTax();
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      if (productForm) productForm.reset();
      updateModalTax();
    }
  };

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Yeni Ürün Formu Kaydetme
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newProduct = {
        id: Date.now(),
        code: document.getElementById('inp-code').value.trim().toUpperCase(),
        name: document.getElementById('inp-name').value.trim(),
        category: document.getElementById('inp-category').value,
        location: document.getElementById('inp-location').value.trim().toUpperCase(),
        quantity: parseInt(document.getElementById('inp-quantity').value, 10) || 1,
        unit: document.getElementById('inp-unit').value,
        unitPrice: parseFloat(document.getElementById('inp-price').value) || 0,
        taxRate: parseFloat(document.getElementById('inp-tax').value) || 0
      };

      inventory.push(newProduct);
      closeModal();
      render();
    });
  }

  // İlk render
  render();
}
