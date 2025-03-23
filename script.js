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

// Export to Excel Button
const exportExcelBtn = document.getElementById('exportExcelBtn');

exportExcelBtn.addEventListener('click', function () {
  // Convert the products array to a worksheet
  const worksheetData = [
    ['No.', 'Product Name', 'Volume', 'Variant', 'Brand', 'Price (Rp)', 'Reseller Price (Rp)'],
    ...products.map((product) => [
      product.no,
      product.productName,
      product.volume,
      product.variant,
      product.brand,
      `Rp ${product.price}`,
      `Rp ${product.resellerPrice}`,
    ]),
  ];

  // Create a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Price List');

  // Export the workbook as an Excel file
  XLSX.writeFile(workbook, 'price-list.xlsx');
});

// Export to Word Button
const exportWordBtn = document.getElementById('exportWordBtn');

exportWordBtn.addEventListener('click', function () {
  // Create a Word document content
  const wordContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <title>Price List</title>
    </head>
    <body>
      <h1>Price List</h1>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>No.</th>
            <th>Product Name</th>
            <th>Volume</th>
            <th>Variant</th>
            <th>Brand</th>
            <th>Price (Rp)</th>
            <th>Reseller Price (Rp)</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product) => `
                <tr>
                  <td>${product.no}</td>
                  <td>${product.productName}</td>
                  <td>${product.volume}</td>
                  <td>${product.variant}</td>
                  <td>${product.brand}</td>
                  <td>Rp ${product.price}</td>
                  <td>Rp ${product.resellerPrice}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create a Blob with the Word content
  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword',
  });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'price-list.doc';
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
});
