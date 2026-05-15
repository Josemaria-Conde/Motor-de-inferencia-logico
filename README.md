**Requisitos**  
- **Node.js** >= 16.x  
- **npm** >= 8.x  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/khWsYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4qjBdKlX6OKAAAAAElFTkSuQmCC)  
**Instalación local**  
# 1. Clonar el repositorio  
   
 # 2. Instalar dependencias  
 npm install  
   
 # 3. Iniciar el servidor  
 npm start  
   
El servidor queda disponible en http://localhost:3000.  
Para desarrollo con recarga automática:  
npm run dev  
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM0lEQVR4nO3OMQ0AIAwAwZIiBKl1gjacsGCAiZDcTT9+q6oRETMAAPjF6ify6QYAADdyA9/yAyy03KM6AAAAAElFTkSuQmCC)  
**Estructura del proyecto**  
motor-inferencia-logica/  
 ├── src/  
 │   └── server.js          # Servidor Express + lógica de integración Prolog  
 ├── knowledge/  
 │   └── base.pl            # Base de conocimiento en Prolog  
 ├── package.json  
 └── README.md  
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhwgJOUPcjIpnRgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseaJEEL8XMiYMAAAAASUVORK5CYII=)  
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
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNBCkLfE07YGfHAiAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrse4eQF6VhvmPsAAAAASUVORK5CYII=)  
GET /health  
Verifica el estado del servicio.  
GET /facts  
Retorna el contenido de la base de conocimiento.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANElEQVR4nO3OMQ0AIAwAwZIgBKnVgjN8dGDBABMhuZt+/JaZIyJmAADwi9VP1NMNAABu1AaU3AUhiyfJeAAAAABJRU5ErkJggg==)  
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
