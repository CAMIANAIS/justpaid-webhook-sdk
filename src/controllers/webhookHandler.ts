import { Request, Response } from 'express';
import { JustPaidContractPayload, WebhookResponse } from '../types';

export const handleContractReview = (req: Request, res: Response) => {
    try {
        const payload = req.body as JustPaidContractPayload;

        console.log(`[JustPaid Webhook] Recibido contrato ${payload.contract_id} por un total de $${payload.detected_amount}`);

        // ==========================================
        // LÓGICA DE NEGOCIO Y COMPLIANCE
        // ==========================================

        // Regla 1: Contratos mayores a $10,000 requieren revisión manual (Compliance)
        if (payload.detected_amount > 10000) {
            console.log(`[Alerta] Monto elevado. Requiere revisión humana.`);
            const response: WebhookResponse = {
                status: 'review_pending',
                review_url: `https://internal-erp.cliente.com/legal-review/${payload.contract_id}`,
                message: 'Monto excede el umbral de auto-aprobación.'
            };
            return res.status(200).json(response);
        }

        // Regla 2: Si el plazo de pago (Net Terms) es mayor a 60 días, escalar al CFO
        if (payload.net_terms > 60) {
            console.log(`[Alerta] Términos de pago extendidos (${payload.net_terms} días).`);
            const response: WebhookResponse = {
                status: 'review_pending',
                review_url: `https://internal-erp.cliente.com/finance-review/${payload.contract_id}`,
                message: 'Términos de pago Net-60+ requieren aprobación de Tesorería.'
            };
            return res.status(200).json(response);
        }

        // Regla 3: Si pasa las validaciones, la IA de JustPaid tiene luz verde para facturar
        console.log(`[Aprobado] Contrato validado automáticamente. Procediendo a facturación.`);
        const successResponse: WebhookResponse = {
            status: 'approved',
            message: 'Workflow validado por el sistema interno.'
        };

        return res.status(200).json(successResponse);

    } catch (error) {
        console.error('[Error] Fallo al procesar el webhook de JustPaid:', error);
        return res.status(500).json({ status: 'rejected', message: 'Error interno del servidor' });
    }
};