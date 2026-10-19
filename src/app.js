const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const logger = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger); //Middleware'i uygulamaya ekliyoruz.


//Ana sayfa, API hakkında bilgi verir ve mevcut endpointleri listeler.
app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow API',
    message: 'Görev ve proje yönetim sistemi API',
    endpoints: {
      tasks: '/api/tasks'
    }
  });
});

app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'İstenen sayfa bulunamadı.' });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && err.body) {
    return res.status(400).json({ message: 'Geçersiz JSON gövdesi.' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Sunucu hatası.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TaskFlow API ${PORT} portunda çalışıyor.`);
  });
}

module.exports = app;
