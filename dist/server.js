"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhookHandler_1 = require("./controllers/webhookHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware para parsear el JSON entrante
app.use(express_1.default.json());
// El endpoint que los clientes configurarían en el dashboard de JustPaid
app.post('/api/webhooks/justpaid/contract-review', webhookHandler_1.handleContractReview);
app.listen(PORT, () => {
    console.log(`🚀 JustPaid Webhook SDK Simulator corriendo en http://localhost:${PORT}`);
    console.log(`Escuchando eventos en: POST /api/webhooks/justpaid/contract-review`);
});
