const fs = require('fs');

// Función para extraer timestamps y subtítulos
function extractTimestampsAndSubtitles(filePath) {
    try {
        console.log(`Iniciando lectura del archivo: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        console.log("Archivo leído correctamente. Iniciando procesamiento...");

        const lines = content.split('\n');
        console.log(`Total de líneas en el archivo: ${lines.length}`);

        const subtitles = [];
        let inEventsSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            console.log(`Procesando línea ${i + 1}: ${line}`);

            if (line.startsWith('[Events]')) {
                inEventsSection = true;
                console.log("Sección [Events] encontrada. Comenzando extracción de diálogos.");
                continue;
            }

            if (inEventsSection && line.trim().startsWith('Dialogue:')) {
                console.log(`Diálogo encontrado en línea ${i + 1}: ${line}`);
                const parts = line.split(',');
                console.log(`Partes del diálogo: ${parts}`);

                if (parts.length >= 10) {
                    const startTime = parts[1];
                    const endTime = parts[2];
                    const text = parts.slice(9).join(',').trim();
                    subtitles.push({
                        startTime,
                        endTime,
                        text
                    });
                    console.log(`Subtítulo extraído: [${startTime} -> ${endTime}] ${text}`);
                } else {
                    console.log(`La línea no tiene suficientes partes para ser un diálogo válido: ${line}`);
                }
            }
        }

        console.log(`Total de subtítulos extraídos: ${subtitles.length}`);
        return subtitles;
    } catch (error) {
        console.error("Error al leer el archivo:", error);
        return [];
    }
}

// Ruta al archivo .ass
const filePath = 'subtitulos.ass'; // Asegúrate de que el nombre del archivo sea correcto

// Extraer subtítulos
console.log("Iniciando extracción de subtítulos...");
const subtitles = extractTimestampsAndSubtitles(filePath);

// Verificar si se extrajeron subtítulos
console.log("Subtítulos extraídos:", subtitles);

// Ruta al archivo de salida .txt
const outputFilePath = 'subtitulos.txt';

// Escribir los subtítulos en un archivo .txt
try {
    console.log(`Preparando contenido para escribir en ${outputFilePath}...`);
    const outputContent = subtitles.map(sub =>
        `[${sub.startTime} -> ${sub.endTime}] ${sub.text}`
    ).join('\n');

    fs.writeFileSync(outputFilePath, outputContent, 'utf8');
    console.log(`Subtítulos exportados exitosamente a ${outputFilePath}`);
} catch (error) {
    console.error("Error al escribir el archivo:", error);
}
