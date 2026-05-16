**Requisitos**  
- **Node.js** >= 16.x  
- **npm** >= 8.x  

**Instalación local**  
# 1. Clonar el repositorio  
   
 # 2. Instalar dependencias  
 npm install  
   
 # 3. Iniciar el servidor  
 npm start  
   
El servidor queda disponible en http://localhost:3000.  
Para desarrollo con recarga automática:  
npm run dev  
   

**Estructura del proyecto**  
motor-inferencia-logica/  
 ├── server.js         # Servidor Express + lógica de integración Prolog   
 ├── base.pl            # Base de conocimiento en Prolog  
 ├── package.json  
 └── README.md  
   

**Endpoints**  
POST /query  
Ejecuta una consulta lógica contra la base de conocimiento.  
**Body:**  
{ "query": "<consulta Prolog>" }  
   
**Respuesta:**  
{  
   "success": true,  
   "query": "penalty_applicable(contract1).",  
   "solutions": [{}],  
   "count": 1,  
   "elapsed_ms": 12  
 }  
   

GET /health  
Verifica el estado del servicio.  
GET /facts  
Retorna el contenido de la base de conocimiento.  

**Ejemplos de consultas**  
# ¿Aplica penalización al contrato 1?  
 curl -X POST http://localhost:3000/query \  
   -H "Content-Type: application/json" \  
   -d '{"query": "penalty_applicable(contract1)"}'  
   
 # ¿Cuál es el monto de penalización por incumplimiento?  
 curl -X POST http://localhost:3000/query \  
   -H "Content-Type: application/json" \  
   -d '{"query": "penalty_amount(contract1, Type, Amount)"}'  
   
 # ¿Qué contratos tienen alto riesgo?  
 curl -X POST http://localhost:3000/query \  
   -H "Content-Type: application/json" \  
   -d '{"query": "high_risk_contract(X)"}'  
   
 # ¿Qué contratos están activos en 2025?  
 curl -X POST http://localhost:3000/query \  
   -H "Content-Type: application/json" \  
   -d '{"query": "active_in_2025(X)"}'  
   
 # ¿Qué contratos son compliant?  
 curl -X POST http://localhost:3000/query \  
   -H "Content-Type: application/json" \  
   -d '{"query": "compliant_contract(X)"}'  
   
 # ¿Hay clientes estratégicos en riesgo?  
 curl -X POST http://localhost:3000/query \  
   -H "Content-Type: application/json" \  
   -d '{"query": "strategic_client_at_risk(Client)"}'  
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSdYxZ4/mJjEsxE8W8GbCFuCLTOzVXsAAPzFuVZ3dXw9AQDgtesBxPEF3bv7x0IAAAAASUVORK5CYII=)  
**Base de conocimiento**  
La base de conocimiento (knowledge/base.pl) define:  
- **Hechos:** contratos, pagos, incumplimientos, tasas de penalización, clientes estratégicos  
- **Reglas de inferencia:**  
- penalty_applicable/1 — si aplica penalización  
- penalty_amount/3 — monto calculado según tipo de incumplimiento  
- high_risk_contract/1 — contratos con múltiples problemas  
- compliant_contract/1 — contratos sin problemas  
- strategic_client_at_risk/1 — clientes prioritarios con riesgo  
- active_contract/2, active_in_2025/1 — contratos vigentes  
Para ampliar el dominio, edita knowledge/base.pl sin modificar el servidor.  
.  
