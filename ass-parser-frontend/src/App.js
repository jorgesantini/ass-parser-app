import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

function App() {
  const [fileContent, setFileContent] = useState('');
  const [logs, setLogs] = useState([]);
  const [outputFileName, setOutputFileName] = useState('subtitulos.txt');

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.ass',
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        const content = reader.result;
        setFileContent(content);
        setLogs(prevLogs => [...prevLogs, `Archivo ${file.name} leído correctamente.`]);
      };

      reader.readAsText(file);
    }
  });

  const processFile = async () => {
    setLogs(prevLogs => [...prevLogs, 'Enviando archivo al servidor para procesamiento...']);

    try {
      const response = await fetch('http://localhost:3001/process-ass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent, outputFileName }),
      });

      const data = await response.json();

      if (data.success) {
        setLogs(prevLogs => [...prevLogs, 'Archivo procesado y guardado correctamente.']);
      } else {
        setLogs(prevLogs => [...prevLogs, 'Error al procesar el archivo.']);
      }
    } catch (error) {
      setLogs(prevLogs => [...prevLogs, 'Error al conectar con el servidor.']);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Subtitle Extractor</h1>
      <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #0087F7', borderRadius: '4px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <input {...getInputProps()} />
        <p>Arrastra y suelta un archivo .ass aquí, o haz clic para seleccionar un archivo</p>
      </div>
      <div>
        <label>
          Nombre del archivo de salida:
          <input
            type="text"
            value={outputFileName}
            onChange={(e) => setOutputFileName(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={processFile} style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#0087F7', color: 'white', border: 'none', borderRadius: '4px' }}>
        Procesar Archivo
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>Logs:</h3>
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', height: '200px', overflowY: 'scroll' }}>
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
