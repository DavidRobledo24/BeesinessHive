
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Inicio from '../general/Inicio';

import Login from '../inicio/Login';

import SignUpProductor from '../inicio/SignUpProductor';
// import SignUpComprador from '../inicio/SignUpComprador';   // esta linea esta generando problamas al usar npm run dev
import CambiarContraseña from '../inicio/CambiarContraseña';
import RestablecerContraseña from '../inicio/RestablecerContraseña';
import RevisarCorreo from '../inicio/RevisarCorreo'

import MarketplaceProd from '../productor/marketplace/Marketplace';
import MarketPlaceComp from '../comprador/marketplace/MarketPlaceComp';


import CrearProducto from "../productor/crearProducto/CrearProducto";
import EditarProducto from '../productor/editarProducto/EditarProducto';

import GestionColmenas from '../productor/gestionColmenas/GestionColmenas';
import CrearColmena  from '../productor/crearColmena/crearColmena';

import EditarApicultor from '../productor/EditarPerfilProductor/EditarApicultor';
import EditarComprador from '../comprador/EditarPerfilComprador/EditarComprador';
import CreacionApiario from '../productor/CreacionApiario/CreacionApiario';

import SignUpComprador from '../inicio/SignUpComprador';
import GestionApiarios from '../productor/gestiones/apiario/GestionApiarios';
import Roless from '../general/roles/Roless';

import EditarColmena from '../productor/editarColmena/EditarColmena';
import BitacoraColmena from '../productor/bitacoras/bitacoraColmena/BitacoraColmena';
import BitacoraApiario from '../productor/bitacoras/bitacoraApiario/BitacoraApiario';

import PrincipalCards from '../productor/principalCards/PrincipalCards';
import GestionPrincipal from '../productor/gestiones/apiario/GestionPrincipal'

import RegistroVenta from '../productor/registroVenta/RegistroVenta';


import VerProducto from '../comprador/verProducto/VerProducto';
import NotificacionesChat from '../productor/beesinessMessage/chat/NotificacionesChat';
import Notificaciones from '../general/notificaciones/NotificacionesMarketplace'
import Facturas from '../productor/facturas/Facturas'
import Favoritos from '../comprador/favoritos/Favoritos'

//import Notificacionescompra from '../comprador/NotificacionesCompr/Notificaciones'
import ChatComprador from '../productor/beesinessMessage/chat/ChatComprador'
import Actividad from '../productor/visualizarActividad/Actividad'

import NotFound from '../general/NotFound/NotFound';
import Empresa from '../comprador/digitarEmpresa/Empresa'

import GenerarFactura from '../productor/beesinessMessage/facturador/GeneradorFactura';
import NotificacionesChatComprador from '../comprador/beesinessMessageComprador/chatComprador/NotificacionesChatByComprador';
import ChatByComprador from '../comprador/beesinessMessageComprador/chatComprador/ChatByComprador';

// estas dos tienen el mismo nombre

import NotificacionesApicultor from '../productor/Notificaciones/NotificacionesApicultor';
import ActividadColmena from '../productor/visualizarActividad/ActividadColmena';
import EditarApiario from '../productor/editarApiario/EditarApiario'
function Enrutador(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />}/>
                {/*Inicio*/}
                
                <Route path="login" element={<Login />}/>
                <Route path="signUpProductor" element={<SignUpProductor/>}/>
                <Route path="signUpComprador" element={<SignUpComprador/>}/>
                <Route path="cambiarContraseña" element={<CambiarContraseña/>}/>
                <Route path="restablecerContraseña/:id" element={<RestablecerContraseña/>}/>
                <Route path="revisarCorreo" element={<RevisarCorreo/>}/>
                <Route path="rol" element={<Roless/>}/>
                <Route path="principalCards" element={<PrincipalCards/>}/>

                {/* Marketplace */}
                <Route path="MarketplaceProd" element={<MarketplaceProd />}/>
                <Route path="MarketPlaceComp" element={<MarketPlaceComp />}/>

                {/* Productos - Apicultor */}
                <Route path="CrearProducto" element={<CrearProducto />}/>
                <Route path="CreacionApiario" element={<CreacionApiario />}/>
                <Route path="EditarProducto" element={<EditarProducto />}/>
                <Route path="EditarApicultor" element={<EditarApicultor />}/>
                <Route path="EditarComprador" element={<EditarComprador/>}/>
                <Route path="gestionApiarios" element={<GestionApiarios/>}/>
                <Route path="Gestionprincipal" element={<GestionPrincipal/>}/>

                {/*Gestión colmenas*/}
                <Route path="GestionarColmenas" element={<GestionColmenas />} />
                <Route path="CrearColmena" element={<CrearColmena />}/>
                <Route path="EditarColmena" element={<EditarColmena/>}/>
                <Route path="BitacoraApiario" element={<BitacoraApiario />}/>
                <Route path="BitacoraColmena" element={<BitacoraColmena/>}/>

                {/* <Route path="RegistroVenta" element={<RegistroVenta/>}/> */}

               {/* <Route path="Actividades" element={<Notificacionescompra/>}/> */}

                {/* PRUEBAS */}
                <Route path="ActividadesColmena" element={<NotificacionesApicultor/>}/>
                <Route path="Producto/:id" element={<VerProducto/>}/>
                <Route path="NotificacionesChat" element={<NotificacionesChat/>}/>
                <Route path="ChatComprador" element={<ChatComprador/>}/>

                <Route path="Facturas" element={<Facturas/>}/>
                <Route path="Favoritos" element={<Favoritos/>}/>
                <Route path="Notificaciones" element={<Notificaciones/>}/>
                <Route path="Actividad" element={<Actividad/>}/>
                {/* <Route path="Empresa" element={<Empresa/>}/> */}

                 {/* Ruta 404 */}
                 <Route path="*" element={<NotFound />} />
                <Route path="generarfactura" element={<GenerarFactura/>}/>
                <Route path="NotificacionesChatComprador" element ={<NotificacionesChatComprador/>}/>
                <Route path="ChatByComprador" element ={<ChatByComprador/>}/>
            
                <Route path="colmenaactividad" element ={<ActividadColmena/>}/>
                <Route path="editarApiario" element ={<EditarApiario/>}/>
                
            </Routes>
            
        </BrowserRouter>
    );

}

export default Enrutador;
 