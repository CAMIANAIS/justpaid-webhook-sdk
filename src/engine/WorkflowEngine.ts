import { JustPaidWorkflow, WorkflowStep } from '../types';

export class WorkflowEngine {

    // Método principal que recibe el JSON y arranca el motor
    public async executeWorkflow(workflowDef: JustPaidWorkflow, contractPayload: any): Promise<void> {
        console.log(`\n⚙️ Iniciando flujo de trabajo: [${workflowDef.workflow_name}]`);

        for (const [index, step] of workflowDef.steps.entries()) {
            console.log(`\n➡️ Ejecutando Paso ${index + 1}: ${step.type}`);

            try {
                await this.processStep(step, contractPayload);
            } catch (error) {
                console.error(`[Error fatal en paso ${step.type}]: Abortando workflow.`, error);
                break; // Detiene la cadena si un paso falla (Critical for financial systems)
            }
        }

        console.log(`\n✅ Flujo de trabajo [${workflowDef.workflow_name}] completado con éxito.`);
    }

    // El enrutador lógico
    private async processStep(step: WorkflowStep, payload: any): Promise<void> {
        switch (step.type) {

            case 'parse_contract':
                console.log(`📄 Analizando contrato usando IA (Modelo: ${step.ai_model_version || 'default'})...`);
                // Aquí iría la llamada real a la API de JustPaid/OpenAI
                await this.simulateDelay(1000);
                console.log(`✅ Contrato analizado. Monto detectado: $${payload.detected_amount}`);
                break;

            case 'send_for_approval':
                console.log(`⚖️ Enviando payload al webhook del cliente: ${step.approver_webhook}`);
                // Aquí llamas al servidor que construimos en el paso anterior
                await this.simulateDelay(800);
                console.log(`✅ Respuesta del cliente recibida. Estado: APPROVED`);
                break;

            case 'create_invoice':
                // Evaluación de condiciones declarativas (Ej: "approval_status == 'approved'")
                if (step.condition && step.condition.includes('approved')) {
                    console.log(`💸 Emitiendo factura oficial con fecha: ${step.issue_date}`);
                    await this.simulateDelay(500);
                } else {
                    console.log(`⚠️ Condición no cumplida para emitir factura. Saltando paso.`);
                }
                break;

            case 'trigger_dunning':
                console.log(`⏰ Configurando secuencia de cobro. Intento max: ${step.max_attempts}`);
                console.log(`✅ Secuencia programada en el cronjob interno.`);
                break;

            default:
                console.warn(`[Warning] Tipo de paso desconocido: ${step.type}`);
        }
    }

    // Utilidad para simular el tiempo de respuesta de las APIs en el log
    private simulateDelay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}