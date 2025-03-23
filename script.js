// DOM Elements
const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Data Storage
let products = [];

// Function to Add Product
productForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get Input Values
  const no = document.getElementById('no').value;
  const productName = document.getElementById('productName').value;
  const volume = document.getElementById('volume').value;
  const variant = document.getElementById('variant').value;
  const brand = document.getElementById('brand').value;
  const price = document.getElementById('price').value;
  const resellerPrice = document.getElementById('resellerPrice').value;

  // Create Product Object
  const product = {
    no,
    productName,
    volume,
    variant,
    brand,
    price,
    resellerPrice,
  };

  // Add to Products Array
  products.push(product);

  // Render Table
  renderTable();

  // Clear Form
  productForm.reset();
});

// Function to Render Table
function renderTable() {
  productTableBody.innerHTML = ''; // Clear Table Body

  products.forEach((product) => {
    const row = `
      <tr>
        <td>${product.no}</td>
        <td>${product.productName}</td>
        <td>${product.volume}</td>
        <td>${product.variant}</td>
        <td>${product.brand}</td>
        <td>Rp ${product.price}</td>
        <td>Rp ${product.resellerPrice}</td>
      </tr>
    `;
    productTableBody.insertAdjacentHTML('beforeend', row);
  });
}

// Function to Export to PDF
exportPdfBtn.addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add Table Headers
  doc.setFontSize(12);
  doc.text('Price List', 10, 10);
  doc.autoTable({
    startY: 20,
    head: [['No.', 'Product Name', 'Volume', 'Variant', 'Brand', 'Price (Rp)', 'Reseller Price (Rp)']],
    body: products.map((product) => [
      product.no,
      product.productName,
      product.volume,
      product.variant,
      product.brand,
      `Rp ${product.price}`,
      `Rp ${product.resellerPrice}`,
    ]),
  });

  // Save PDF
  doc.save('price-list.pdf');
});
