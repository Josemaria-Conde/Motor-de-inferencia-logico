/**
 * Motor de Inferencia Lógica como Servicio
 * Integra: Programación Lógica (Prolog/Tau), Funcional (JS), Asíncrona (Node.js)
 */

const express = require('express');
const pl = require('tau-prolog');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// ─── Utilidades funcionales (programación funcional) ──────────────────────────

/**
 * Normaliza una consulta Prolog: asegura que termine con punto,
 * elimina espacios extra, convierte a string si no lo es.
 * Función pura sin efectos secundarios.
 */
const normalizeQuery = (raw) => {
  if (typeof raw !== 'string') throw new TypeError('La consulta debe ser un string');
  const trimmed = raw.trim();
  if (!trimmed) throw new Error('La consulta no puede estar vacía');
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
};

/**
 * Transforma una solución Prolog a un objeto JS plano.
 * También función pura: dada la misma solución, retorna el mismo objeto.
 */
const solutionToObject = (session, solution) => {
  if (!solution || solution === false) return null;
  const vars = {};
  for (const [key, val] of Object.entries(solution.links || {})) {
    vars[key] = session.format_answer(val);
  }
  return vars;
};

/**
 * Carga la base de conocimiento desde disco.
 * Retorna el contenido como string.
 */
const loadKnowledgeBase = (filepath) => {
  if (!fs.existsSync(filepath)) {
    throw new Error(`Base de conocimiento no encontrada: ${filepath}`);
  }
  return fs.readFileSync(filepath, 'utf-8');
};

// ─── Motor de inferencia (programación lógica + async) ───────────────────────

/**
 * Ejecuta una consulta Prolog de forma asíncrona.
 * Retorna una Promise que resuelve con todas las soluciones encontradas.
 */
const runPrologQuery = (knowledgeBase, queryStr) =>
  new Promise((resolve, reject) => {
    const session = pl.create(1000);

    session.consult(knowledgeBase, {
      success: () => {
        session.query(queryStr, {
          success: () => {
            const solutions = [];

            const collectAnswers = () => {
              session.answer({
                success: (answer) => {
                  const result = solutionToObject(session, answer);
                  solutions.push(result || {});
                  collectAnswers(); // recursión para múltiples soluciones
                },
                fail: () => resolve(solutions),       // no más soluciones
                error: (err) => reject(new Error(`Error en inferencia: ${err}`)),
                limit: () => resolve(solutions),
              });
            };

            collectAnswers();
          },
          error: (err) => reject(new Error(`Consulta inválida: ${err}`)),
        });
      },
      error: (err) => reject(new Error(`Error cargando base de conocimiento: ${err}`)),
    });
  });

// ─── Endpoints REST ───────────────────────────────────────────────────────────

const KB_PATH = path.join(__dirname, '..', 'knowledge', 'base.pl');

/**
 * POST /query
 * Body: { "query": "<consulta prolog>" }
 * Response: { success, query, solutions, count, elapsed_ms }
 */
app.post('/query', async (req, res) => {
  const start = Date.now();

  try {
    const rawQuery = req.body?.query;
    const normalizedQuery = normalizeQuery(rawQuery);
    const knowledgeBase = loadKnowledgeBase(KB_PATH);

    const solutions = await runPrologQuery(knowledgeBase, normalizedQuery);

    res.json({
      success: true,
      query: normalizedQuery,
      solutions,
      count: solutions.length,
      elapsed_ms: Date.now() - start,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
      elapsed_ms: Date.now() - start,
    });
  }
});

/**
 * GET /health
 * Verifica que el servicio y la base de conocimiento estén disponibles.
 */
app.get('/health', (req, res) => {
  const kbExists = fs.existsSync(KB_PATH);
  res.json({
    status: 'ok',
    knowledge_base_loaded: kbExists,
    engine: 'tau-prolog',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /facts
 * Lista los hechos de la base de conocimiento (lectura directa del archivo).
 */
app.get('/facts', (req, res) => {
  try {
    const content = loadKnowledgeBase(KB_PATH);
    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Inicio del servidor ──────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Motor de Inferencia] Servidor iniciado en http://localhost:${PORT}`);
  console.log(`[Motor de Inferencia] Base de conocimiento: ${KB_PATH}`);
});

module.exports = app; // exportado para pruebas
