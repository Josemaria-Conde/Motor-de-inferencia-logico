% ============================================================
% Base de Conocimiento: Sistema de Contratos y Penalizaciones
% Motor de Inferencia Lógica como Servicio
% ============================================================

% ─── HECHOS: Contratos ───────────────────────────────────────────────────────
% contract(ID, Client, Type, StartYear, EndYear, Value)
contract(contract1, acme_corp,    service,    2022, 2025, 150000).
contract(contract2, beta_inc,     supply,     2023, 2026, 320000).
contract(contract3, gamma_llc,    service,    2021, 2023, 80000).
contract(contract4, delta_co,     consulting, 2024, 2027, 200000).
contract(contract5, epsilon_ltd,  supply,     2022, 2024, 95000).

% ─── HECHOS: Pagos ───────────────────────────────────────────────────────────
% payment(ContractID, Amount, Status)
% Status: on_time | delayed | missing
payment(contract1, 150000, delayed).
payment(contract2, 320000, on_time).
payment(contract3, 80000,  missing).
payment(contract4, 200000, on_time).
payment(contract5, 95000,  delayed).

% ─── HECHOS: Incumplimientos reportados ──────────────────────────────────────
% breach(ContractID, Type)
% Type: quality | delivery | confidentiality
breach(contract1, delivery).
breach(contract3, quality).
breach(contract3, confidentiality).
breach(contract5, delivery).

% ─── HECHOS: Tasas de penalización por tipo de incumplimiento ────────────────
% penalty_rate(BreachType, Rate)
penalty_rate(delivery,      0.05).
penalty_rate(quality,       0.10).
penalty_rate(confidentiality, 0.20).
penalty_rate(delayed_payment, 0.03).

% ─── HECHOS: Clientes estratégicos ───────────────────────────────────────────
% strategic_client(ClientID)
strategic_client(acme_corp).
strategic_client(beta_inc).

% ─── REGLAS: Inferencia ──────────────────────────────────────────────────────

% Un contrato tiene pago pendiente si su pago está 'missing'
unpaid_contract(ContractID) :-
    payment(ContractID, _, missing).

% Un contrato tiene pago tardío si su pago está 'delayed'
late_payment(ContractID) :-
    payment(ContractID, _, delayed).

% Un contrato tiene al menos un incumplimiento registrado
has_breach(ContractID) :-
    breach(ContractID, _).

% Un contrato es de alto riesgo si tiene incumplimiento Y pago tardío/faltante
high_risk_contract(ContractID) :-
    has_breach(ContractID),
    (late_payment(ContractID) ; unpaid_contract(ContractID)).

% Aplica penalización si el contrato tiene incumplimiento o pago problemático
penalty_applicable(ContractID) :-
    has_breach(ContractID).
penalty_applicable(ContractID) :-
    late_payment(ContractID).
penalty_applicable(ContractID) :-
    unpaid_contract(ContractID).

% Calcula el monto de penalización por incumplimiento de entrega/calidad/etc.
penalty_amount(ContractID, BreachType, Amount) :-
    contract(ContractID, _, _, _, _, Value),
    breach(ContractID, BreachType),
    penalty_rate(BreachType, Rate),
    Amount is Value * Rate.

% Calcula penalización por pago tardío
late_payment_penalty(ContractID, Amount) :-
    contract(ContractID, _, _, _, _, Value),
    late_payment(ContractID),
    penalty_rate(delayed_payment, Rate),
    Amount is Value * Rate.

% Contrato activo en el año dado
active_contract(ContractID, Year) :-
    contract(ContractID, _, _, Start, End, _),
    Year >= Start,
    Year =< End.

% Contratos activos en 2025
active_in_2025(ContractID) :-
    active_contract(ContractID, 2025).

% Cliente en riesgo: tiene contrato de alto riesgo Y es cliente estratégico
strategic_client_at_risk(Client) :-
    contract(ContractID, Client, _, _, _, _),
    high_risk_contract(ContractID),
    strategic_client(Client).

% Contrato compliant: tiene pago a tiempo y sin incumplimientos
compliant_contract(ContractID) :-
    payment(ContractID, _, on_time),
    \+ has_breach(ContractID).

% Tipo de un contrato
contract_type(ContractID, Type) :-
    contract(ContractID, _, Type, _, _, _).

% Cliente de un contrato
contract_client(ContractID, Client) :-
    contract(ContractID, Client, _, _, _, _).
