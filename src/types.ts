// Tipos de pasos soportados por nuestro motor
export type StepType = 'parse_contract' | 'send_for_approval' | 'create_invoice' | 'trigger_dunning';

// Interfaz genérica para un paso del flujo
export interface WorkflowStep {
    type: StepType;
    [key: string]: any; // Permite propiedades dinámicas como 'ai_model_version' o 'condition'
}

// El esquema principal del JSON que envía el cliente
export interface JustPaidWorkflow {
    workflow_name: string;
    steps: WorkflowStep[];
}

// --- Backwards-compatible types expected by the webhook controller ---
export interface JustPaidContractPayload {
    contract_id: string;
    detected_amount: number; // monetary value in major units (as the controller checks > 10000)
    net_terms: number; // payment terms in days
    [key: string]: any;
}

export interface WebhookResponse {
    status: 'approved' | 'review_pending' | 'rejected';
    review_url?: string;
    message?: string;
}