const express = require('express');
const pl = require('tau-prolog');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const normalizeQuery = (raw) => {
  if (typeof raw !== 'string') throw new TypeError('La consulta debe ser un string');
  const trimmed = raw.trim();
  if (!trimmed) throw new Error('La consulta no puede estar vacia');
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
};

const solutionToObject = (session, solution) => {
  if (!solution || solution === false) return null;
  const vars = {};
  for (const [key, val] of Object.entries(solution.links || {})) {
    vars[key] = session.format_answer(val);
  }
  return vars;
};

const loadKnowledgeBase = (filepath) => {
  if (!fs.existsSync(filepath)) {
    throw new Error('Base de conocimiento no encontrada: ' + filepath);
  }
  return fs.readFileSync(filepath, 'utf-8');
};

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
                  collectAnswers();
                },
                fail: () => resolve(solutions),
                error: (err) => reject(new Error('Error en inferencia: ' + err)),
                limit: () => resolve(solutions),
              });
            };
            collectAnswers();
          },
          error: (err) => reject(new Error('Consulta invalida: ' + err)),
        });
      },
      error: (err) => reject(new Error('Error cargando base de conocimiento: ' + err)),
    });
  });

const KB_PATH = path.join(__dirname, 'base.pl');

app.post('/query', async (req, res) => {
  const start = Date.now();
  try {
    const rawQuery = req.body?.query;
    const normalizedQuery = normalizeQuery(rawQuery);
    const knowledgeBase = loadKnowledgeBase(KB_PATH);
    const solutions = await runPrologQuery(knowledgeBase, normalizedQuery);
    res.json({ success: true, query: normalizedQuery, solutions, count: solutions.length, elapsed_ms: Date.now() - start });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message, elapsed_ms: Date.now() - start });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', knowledge_base_loaded: fs.existsSync(KB_PATH), engine: 'tau-prolog', timestamp: new Date().toISOString() });
});

app.get('/facts', (req, res) => {
  try {
    res.json({ success: true, content: loadKnowledgeBase(KB_PATH) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('[Motor de Inferencia] Servidor iniciado en http://localhost:' + PORT);
  console.log('[Motor de Inferencia] Base de conocimiento: ' + KB_PATH);
});

module.exports = app;
