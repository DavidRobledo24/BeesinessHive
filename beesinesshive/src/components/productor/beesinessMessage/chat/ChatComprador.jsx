import React, { useState, useEffect } from 'react';
import Navbar from '../../../general/navbar/Navbar';
import Footer from '../../../general/footer/Footer';
import PersonIcon from '@mui/icons-material/Person';
import Style from '../../../inicio/inicio.module.css';
import style from './chatcomprador.module.css'; // Asegúrate de que la ruta del archivo CSS sea correcta
import { useLocation } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAuth } from '../../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import ListIcon from '@mui/icons-material/List';
function ChatComprador() {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [botMessage, setBotMessage] = useState('');
    const [Comprador] = useState('comprador');
    const [Vendedor] = useState('vendedor');

    const { user, login, logout } = useAuth();
    const token = user?.token;
    const navigate = useNavigate();
    //const [IdConversacion] = useState('13'); // ID de la conversación
    const location = useLocation(); // Obtén el estado desde la ubicación actual
    const { IdConversacion, comprador, vendedorId } = location.state || {};
    const [IdUsuario] = useState(vendedorId);

    useEffect(() => {

        if(!token){
            navigate("/")
            return;
        }
    
        fetch(`http://54.87.25.132/articulos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
        }).then(response => {
            if(response.status == 403){
                logout();
                navigate("/");
                return
            }
            else if(response.status == 200){
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                if(decodedToken.role === "comprador") navigate("/");
                else if(decodedToken.role === "productor" && (!IdConversacion || !vendedorId)) navigate("/notificacionesChat");
            }
        })
    }, []);

    useEffect(() => {
        HandleLoadChat();
        const intervalId = setInterval(() => {
            HandleLoadChat();
        }, 10000); // Cada 5 segundos

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    }, []);
 

    const HandleLoadChat = async () => {
        try {
            // ?IdConversacion=54321
            const response = await fetch(`http://54.87.25.132/chat?IdConversacion=${IdConversacion}`, {
                method: 'GET',

                headers: {
                    'Content-Type': 'application/json',
                      'Accept':'*'
                     
                },

            });
           

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Network response was not ok: ${errorMessage}`);
            }

            const data = await response.json();
           
            // Actualizar el estado con los mensajes obtenidos
            setMessages(data.mensajes.map(msg => ({
                role: msg.rol,
                content: msg.content
            })));

        } catch (error) {
            console.error('Error en la petición:', error);
            setBotMessage('Error al cargar la conversación');
        }

    };

    const handleSend = async () => {
        if (!userMessage.trim()) return; // Evita enviar mensajes vacíos

        // Crear un objeto de conversación
        const conversacion = {
            "IdConversacion": IdConversacion,
            "mensajes": [
                {
                    "rol": Comprador,
                    "id": IdUsuario,
                    "timestamp": new Date().toISOString(),
                  
                    "content": userMessage
                }
            ]
        };

        // Mostrar el mensaje del usuario en la interfaz
        setMessages([...messages, { role: Comprador, content: userMessage }]);
        try {
            // Enviar el mensaje al servidor
            const response = await fetch('http://54.87.25.132/chat', {

                method: 'PUT',

                //mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                     'Accept':'*'
                   
                },



                body: JSON.stringify({
                    "IdConversacion": IdConversacion,
                    "mensajes": [
                      {
                        "rol": Comprador,
                        "id": IdUsuario || vendedorId,
                        "timestamp": new Date().toISOString(),
                        "content": userMessage
                      }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = response.json();
            
            setBotMessage(data.status || 'Mensaje registrado con exito');
         
      

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setBotMessage('Error al registrar el mensaje');

        }

        // Limpiar el input del usuario
        setUserMessage('');
        HandleLoadChat();
    };

    function handleBill() {

        navigate('/generarfactura', { state: { IdConversacion, vendedorId } });
    }
    const handleNavigate = () => {
        
        // Redirigir a NotificacionesChatComprador
        navigate('/NotificacionesChatComprador');
    };
    return (
        <>
            <Navbar />
            <div className={style.principalchat}>
                <div className={style.chat_container}>

                    <div className={style.titulochat}>
                        <div className={style.title}>
                        <button onClick={handleNavigate} className='regreso' style={{ all: 'unset', cursor: 'pointer', fontSize:40 }}>&#10094;</button>
                        &#10094; <PersonIcon sx={{ color:'white',fontSize:45 }}/>
                            {comprador}
                        </div>
                        <ListIcon sx={{color:'#e5c464', fontSize:45 }}/>
                    </div>
                    <div className={style.messages}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`${style.message} ${style[msg.role] || ''}`}>
                                {msg.content}
                            </div>
                        ))}
                        {botMessage && (
                            <div className={`${style.message} ${style.bot}`}>
                                {botMessage}
                            </div>
                        )}
                    </div>
                    <div className={style.input_container}>
                        <div className={Style.box} style={{ width: '95%', background:'#fef8e1'}}>
                            <input
                                type="text"
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                placeholder="Escribir..."
                                id="nombre" name="nombre"
                            />
                            <ReceiptLongIcon onClick={handleBill} style={{ cursor: 'pointer', color: 'black', fontSize:'35px' }} />
                        </div>
                        <button className={style.send} onClick={handleSend}><SendIcon /></button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ChatComprador;

