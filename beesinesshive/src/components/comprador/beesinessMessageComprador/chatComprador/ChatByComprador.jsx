import React, { useState, useEffect } from 'react';
import './chatByComprador.css'; // Asegúrate de que la ruta del archivo CSS sea correcta
import { useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../general/navbar/Navbar'
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../../general/context/AuthContext.jsx';
import Style from '../../../inicio/inicio.module.css';
import Footer from '../../../general/footer/Footer.jsx'
import ListIcon from '@mui/icons-material/List';
function ChatByComprador() {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [botMessage, setBotMessage] = useState('');
    const [Comprador] = useState('comprador');
    const [Vendedor] = useState('vendedor');
    const { user, login, logout } = useAuth();
    const token = user?.token; 
    const navigate = useNavigate();
   
    const location = useLocation(); // Obtén el estado desde la ubicación actual
    const { IdConversacion, comprador,compradorId, idProductor} = location.state || {}; 
   
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
                if(decodedToken.role === "productor") navigate("/");
                else if(decodedToken.role === "comprador" && (!IdConversacion || !compradorId)) navigate("/NotificacionesChatComprador");
            }
        })
    }, []);

    const [IdUsuario] = useState(compradorId);
    
     useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Evitar la navegación hacia atrás
            event.preventDefault();
            // Redirigir a NotificacionesChatComprador
            navigate('/NotificacionesChatComprador');
        };

        // Añadir el event listener cuando se monte el componente
        window.addEventListener('popstate', handleBeforeUnload);

        // Limpiar el event listener cuando se desmonte el componente
        return () => {
            window.removeEventListener('popstate', handleBeforeUnload);
        };
    }, [navigate]);

    useEffect(() => {
   
            if (IdConversacion) {
                // Si IdConversacion está disponible, cargar la conversación
                HandleLoadChat(IdConversacion);
                const intervalId = setInterval(() => {
                    HandleLoadChat(IdConversacion);
                }, 10000); // Cada 10 segundos
    
                return () => clearInterval(intervalId); 
            } else {
                // Si no hay IdConversacion, crearla (si es necesario)
           
             let NewConvers;
             let NewIdComprador;
             let NewIdProductor;
             let NewNombreProductor;
              const createConversation = async () => {
                if (!IdConversacion) {
                    // Esperar a que la promesa se resuelva
                    const conversation = await createNewConversation(idProductor);
                    NewConvers=conversation.NewConver.Attributes.IdConversacion.S;
                   // handleSend(conversation)
                   NewIdComprador=conversation.NewIdComprador;
                   NewIdProductor=conversation.NewIdProductor;
            
                   const nombreVendedorResponse = await fetch(`http://54.87.25.132/producers/chat/${NewIdProductor}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': `Bearer ${token}`
                    }
                  });
                  
                  const nombreVendedorData = await nombreVendedorResponse.json();
                  NewNombreProductor = nombreVendedorData.User.nombreCompleto;
                  
                   navigate('/ChatByComprador', { state: {  IdConversacion:NewConvers, compradorId:NewIdComprador, comprador: NewNombreProductor} }); 
                   HandleLoadChat(NewConvers);
                }
            };
            
           createConversation(); 
      
           
          
            }
           
        
    }, [IdConversacion,  idProductor]);
   

    const HandleLoadChat = async (IdConversacion) => {
       
        try {
            
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

    const createNewConversation = async (idProductor) => {
        try {
            const response = await fetch('http://54.87.25.132/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*',
                    'authorization': `Bearer ${token}` // Incluye el token aquí
                },
                body: JSON.stringify({
                    idProductor
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la conversación');
            }

            const data = await response.json(); // necesito este y el token para hacer exactmenete lo mismo que le put de arriba 
          
           //return data.IdConversacion; // Asegúrate de que el servidor te retorne el IdConversacion
           return data;
 
         
         
        } catch (error) {
            console.error('Error al crear la conversación:', error);
    
        }
    };

    const handleSend = async () => {
    
        
        if (!userMessage.trim()) return; // Evita enviar mensajes vacíos
        
        // Crear un objeto de conversación
        const conversacion = {
            "IdConversacion": IdConversacion,
            "mensajes": [
                {
                    "rol": Vendedor,
                    "id": IdUsuario,
                    "timestamp": new Date().toISOString(),
                  // "timestamp":"66666666666",
                    "content": userMessage
                }
            ]
        };

        // Mostrar el mensaje del usuario en la interfaz
        setMessages([...messages, { role: Vendedor, content: userMessage }]);


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
                        "rol": Vendedor,
                        "id": IdUsuario ||compradorId,
                        "timestamp": new Date().toISOString(),
                        "content": userMessage
                      }
                    ]
                  })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data =  response.json();
           
            setBotMessage(data.status || 'Mensaje registrado con exito');
         
    

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setBotMessage('Error al registrar el mensaje');
           
        }

        // Limpiar el input del usuario
        setUserMessage('');
        HandleLoadChat(IdConversacion);
    };
    const handleNavigate = (event) => {
        // Evitar la navegación hacia atrás
        event.preventDefault();
        // Redirigir a NotificacionesChatComprador
        navigate('/NotificacionesChatComprador');
    };
    return (
        <>
        <Navbar/>
        <div className='principalchat'>
        <div className="chat_container">
           
            <div className='titulochat'>
            <div className='title'>
                <button onClick={handleNavigate} className='regreso' style={{ all: 'unset', cursor: 'pointer', fontSize:40 }}>&#10094;</button>
                &#10094;   <PersonIcon sx={{ color:'white',fontSize:45 }}/>
                            {comprador}
                </div>
                <ListIcon sx={{color:'#e5c464', fontSize:45 }}/>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {botMessage && (
                    <div className="message bot">
                        {botMessage}
                    </div>
                )}
            </div>
            <div className="input_container">
               
            <div className={Style.box} style={{ width: '95%', background:'#fef8e1'}}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Escribir..."
                    id="nombre" name="nombre" 
                    
                />
                </div>
                {/* <ReceiptLongIcon onClick={handleBill}  style={{ cursor: 'pointer', color: '#4CAF50' }} />*/}
                <button className="send"  onClick={handleSend}><SendIcon/></button>
            </div>
        </div>
        </div>
        <Footer/>
        </>
    );
}

export default ChatByComprador;

