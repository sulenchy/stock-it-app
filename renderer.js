document.addEventListener('DOMContentLoaded', () => {
    loadStock();
    document.getElementById('sale-form').addEventListener('submit', handleSale);
  });
  
  function loadStock() {
    console.log("=====> Start of renderer .js")
    window.api.loadStock((err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      const stockList = document.getElementById('stock-list');
      stockList.innerHTML = '';
      rows.forEach((row) => {
        stockList.innerHTML += `<li>${row.item}: ${row.quantity} in stock, $${row.price} each</li>`;
      });
    });
  }
  
  function handleSale(event) {
    event.preventDefault();
    const item = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
  
    window.api.handleSale(item, quantity, (err, result) => {
      if (err) {
        alert(err.message);
        return;
      }
  
      loadStock();
      alert(`Sale successful! Total: $${result.total}`);
      printReceipt(result.item, result.quantity, result.total);
    });
  }
  
  function printReceipt(item, quantity, total) {
    const receipt = `Receipt\nItem: ${item}\nQuantity: ${quantity}\nTotal: $${total}\nThank you for your purchase!`;
    const newWindow = window.open('', 'Receipt', 'width=400,height=400');
    newWindow.document.write(`<pre>${receipt}</pre>`);
    newWindow.print();
  }
  