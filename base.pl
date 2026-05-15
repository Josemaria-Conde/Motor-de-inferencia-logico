

% ─── HECHOS: Contratos ────────
contract(contract1, acme_corp,    service,    2022, 2025, 150000).
contract(contract2, beta_inc,     supply,     2023, 2026, 320000).
contract(contract3, gamma_llc,    service,    2021, 2023, 80000).
contract(contract4, delta_co,     consulting, 2024, 2027, 200000).
contract(contract5, epsilon_ltd,  supply,     2022, 2024, 95000).

% ─── HECHOS: Pagos ──────────
% Status: on_time | delayed | missing
payment(contract1, 150000, delayed).
payment(contract2, 320000, on_time).
payment(contract3, 80000,  missing).
payment(contract4, 200000, on_time).
payment(contract5, 95000,  delayed).

% ─── HECHOS: Incumplimientos reportados ─────
breach(contract1, delivery).
breach(contract3, quality).
breach(contract3, confidentiality).
breach(contract5, delivery).

% ─── HECHOS: Tasas de penalización por tipo de incumplimiento ────────
penalty_rate(delivery,      0.05).
penalty_rate(quality,       0.10).
penalty_rate(confidentiality, 0.20).
penalty_rate(delayed_payment, 0.03).

% ─── HECHOS: Clientes estratégicos ────────
strategic_client(acme_corp).
strategic_client(beta_inc).

% ─── REGLAS: Inferencia ──────────
unpaid_contract(ContractID) :-
    payment(ContractID, _, missing).


late_payment(ContractID) :-
    payment(ContractID, _, delayed).

has_breach(ContractID) :-
    breach(ContractID, _).


high_risk_contract(ContractID) :-
    has_breach(ContractID),
    (late_payment(ContractID) ; unpaid_contract(ContractID)).


penalty_applicable(ContractID) :-
    has_breach(ContractID).
penalty_applicable(ContractID) :-
    late_payment(ContractID).
penalty_applicable(ContractID) :-
    unpaid_contract(ContractID).


penalty_amount(ContractID, BreachType, Amount) :-
    contract(ContractID, _, _, _, _, Value),
    breach(ContractID, BreachType),
    penalty_rate(BreachType, Rate),
    Amount is Value * Rate.


late_payment_penalty(ContractID, Amount) :-
    contract(ContractID, _, _, _, _, Value),
    late_payment(ContractID),
    penalty_rate(delayed_payment, Rate),
    Amount is Value * Rate.


active_contract(ContractID, Year) :-
    contract(ContractID, _, _, Start, End, _),
    Year >= Start,
    Year =< End.


active_in_2025(ContractID) :-
    active_contract(ContractID, 2025).


strategic_client_at_risk(Client) :-
    contract(ContractID, Client, _, _, _, _),
    high_risk_contract(ContractID),
    strategic_client(Client).

compliant_contract(ContractID) :-
    payment(ContractID, _, on_time),
    \+ has_breach(ContractID).

contract_type(ContractID, Type) :-
    contract(ContractID, _, Type, _, _, _).

contract_client(ContractID, Client) :-
    contract(ContractID, Client, _, _, _, _).
