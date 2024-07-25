const { contextBridge, ipcRenderer } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./stock.db');

contextBridge.exposeInMainWorld('api', {
  loadStock: (callback) => {
    db.all('SELECT * FROM stock', [], (err, rows) => {
    window.console.log({rows})
      callback(err, rows);
    });
  },
  handleSale: (item, quantity, callback) => {
    db.get('SELECT * FROM stock WHERE item = ?', [item], (err, row) => {
      if (err) return callback(err);

      if (!row || row.quantity < quantity) {
        return callback(new Error('Not enough stock available.'));
      }

      const total = quantity * row.price;
      db.run('INSERT INTO sales (item, quantity, total, date) VALUES (?, ?, ?, ?)', [item, quantity, total, new Date().toISOString()], function (err) {
        if (err) return callback(err);

        db.run('UPDATE stock SET quantity = ? WHERE id = ?', [row.quantity - quantity, row.id], (err) => {
          if (err) return callback(err);

          callback(null, { item, quantity, total });
        });
      });
    });
  }
});
 
