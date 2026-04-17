import express from 'express';
import { handleContractReview } from './controllers/webhookHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el JSON entrante
app.use(express.json());

// El endpoint que los clientes configurarían en el dashboard de JustPaid
app.post('/api/webhooks/justpaid/contract-review', handleContractReview);

app.listen(PORT, () => {
    console.log(`🚀 JustPaid Webhook SDK Simulator corriendo en http://localhost:${PORT}`);
    console.log(`Escuchando eventos en: POST /api/webhooks/justpaid/contract-review`);
});