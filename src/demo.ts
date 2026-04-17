import { WorkflowEngine } from './engine/WorkflowEngine';
import { JustPaidWorkflow } from './types';

// 1. El JSON que un desarrollador cliente escribiría
const customerWorkflow: JustPaidWorkflow = {
    workflow_name: "Enterprise_Net60_Workflow",
    steps: [
        {
            type: "parse_contract",
            ai_model_version: "v3-financial"
        },
        {
            type: "send_for_approval",
            approver_webhook: "https://api.cliente.com/webhooks/justpaid"
        },
        {
            type: "create_invoice",
            condition: "approval_status == 'approved'",
            issue_date: "now"
        }
    ]
};

// 2. El contrato simulado que acaba de entrar al sistema
const incomingContract = {
    contract_id: "CTR-9942",
    pdf_url: "s3://bucket/contracts/ctr-9942.pdf",
    detected_amount: 15000,
    net_terms: 60
};

// 3. ¡Arrancamos los motores!
const engine = new WorkflowEngine();
engine.executeWorkflow(customerWorkflow, incomingContract);