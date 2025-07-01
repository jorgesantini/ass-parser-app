const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/process-ass', (req, res) => {
  const { fileContent, outputFileName } = req.body;

  try {
    const subtitles = extractTimestampsAndSubtitles(fileContent);
    const outputContent = subtitles.map(sub =>
      `[${sub.startTime} -> ${sub.endTime}] ${sub.text}`
    ).join('\n');

    fs.writeFileSync(`./${outputFileName}`, outputContent, 'utf8');
    res.json({ success: true, message: 'Archivo procesado y guardado correctamente.' });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ success: false, message: 'Error al procesar el archivo.' });
  }
});

function extractTimestampsAndSubtitles(fileContent) {
  const lines = fileContent.split('\n');
  const subtitles = [];
  let inEventsSection = false;

  for (const line of lines) {
    if (line.startsWith('[Events]')) {
      inEventsSection = true;
      continue;
    }

    if (inEventsSection && line.trim().startsWith('Dialogue:')) {
      const parts = line.split(',');
      if (parts.length >= 10) {
        const startTime = parts[1];
        const endTime = parts[2];
        const text = parts.slice(9).join(',').trim();
        subtitles.push({ startTime, endTime, text });
      }
    }
  }

  return subtitles;
}

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
