
import express from 'express';
import crypto from 'node:crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const products = {
  foto: { price: 5000 },
  video: { price: 10000 },
  premium: { price: 25000 }
};

const orders = new Map();

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'Galeri+' });
});

app.post('/api/orders', (req, res) => {
  const { product, amount, buyerName, buyerContact } = req.body || {};
  const item = products[product];

  if (!item) {
    return res.status(400).json({ error: 'Produk tidak valid' });
  }

  if (Number(amount) !== item.price) {
    return res.status(400).json({ error: 'Nominal tidak sesuai' });
  }

  if (!buyerName || !buyerContact) {
    return res.status(400).json({
      error: 'Nama dan kontak wajib diisi'
    });
  }

  const id = crypto.randomUUID();

  orders.set(id, {
    id,
    product,
    amount: item.price,
    buyerName,
    buyerContact,
    status: 'pending',
    createdAt: new Date().toISOString()
  });

  res.status(201).json({
    id,
    status: 'pending',
    message: 'Pesanan dibuat. Pembayaran otomatis belum aktif.'
  });
});

app.get('/api/orders/:id/status', (req, res) => {
  const order = orders.get(req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
  }

  res.json({
    id: order.id,
    status: order.status
  });
});

app.listen(PORT, () => {
  console.log(`Galeri+ running on port ${PORT}`);
});
      
