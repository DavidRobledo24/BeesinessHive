import React, { useState } from 'react';
import 'whatwg-fetch';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

const Azure = ({ onTranscriptChange }) => {
  const [transcript, setTranscript] = useState('');

  const handleStartButtonClick = async (event) => {
    event.preventDefault(); // Evita que el botón recargue la página

    try {
      // Configuración de la API de Azure
      const subscriptionKey = 'EA6ECE2811EB48CDBD66E265DC16D447'; // Reemplaza con tu clave
      const region = 'centralus'; // Cambia la región si es necesario
      const tokenEndpoint = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

      const headers = new Headers();
      headers.append('Ocp-Apim-Subscription-Key', subscriptionKey);
      headers.append('Content-Length', '0');
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      // Solicita el token de Azure
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: headers,
      });
      const token = await tokenResponse.text();

      // Verifica que SpeechRecognition esté disponible en el navegador
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES'; // Configura el idioma a español (España)
        recognition.start();

        // Maneja el evento de resultados cuando se complete la transcripción
        recognition.onresult = function (event) {
          const newTranscript = event.results[0][0].transcript;
          setTranscript(newTranscript);
          onTranscriptChange(newTranscript); // Envia la transcripción al componente padre
        };
        
        recognition.onerror = function (event) {
          console.error('Error en el reconocimiento de voz:', event.error);
        };
      } else {
        console.error('SpeechRecognition no está disponible en este navegador');
      }
    } catch (error) {
      console.error('Error al obtener el token o iniciar el reconocimiento de voz:', error);
    }
  };

  return (
    <div>
      <button id="startButton" onClick={handleStartButtonClick}>
        <KeyboardVoiceIcon />
      </button>
      
    </div>
  );
};

export default Azure;
