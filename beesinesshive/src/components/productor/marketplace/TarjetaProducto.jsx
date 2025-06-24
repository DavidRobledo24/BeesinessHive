import marketplaceStyle from './marketplace.module.css';
import basura from '../../../assets/basura.png';
import lapiz from '../../../assets/lapiz.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../general/context/AuthContext';
import Swal from 'sweetalert2'
function TarjetaProducto(props){
    const { user, login, logout } = useAuth();
    const token = user?.token; 
  
    const navigate = useNavigate();
  
    const handleRedirigirBasura = async (idArticulo) => {
      const confirm = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el artículo y no podrá ser deshecha.',
        icon: 'warning',
        iconHtml: '🗑️',
        background: 'linear-gradient(to right, #FFA500, #FF7F50)',
        color: '#fff',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        buttonsStyling: false,
        customClass: {
          popup: '',
          confirmButton: '',
          cancelButton: '',
        },
        didRender: (popup) => {
          const confirmButton = popup.querySelector('.swal2-confirm');
          confirmButton.style.backgroundColor = '#000';
          confirmButton.style.color = '#fff';
          confirmButton.style.border = 'none';
          confirmButton.style.borderRadius = '10px';
          confirmButton.style.padding = '10px 20px';
          confirmButton.style.fontSize = '16px';
          confirmButton.style.cursor = 'pointer';
          confirmButton.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
          confirmButton.style.marginRight = '10px';
    
          const cancelButton = popup.querySelector('.swal2-cancel');
          cancelButton.style.backgroundColor = '#FF6347';
          cancelButton.style.color = '#fff';
          cancelButton.style.border = 'none';
          cancelButton.style.borderRadius = '10px';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontSize = '16px';
          cancelButton.style.cursor = 'pointer';
          cancelButton.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
          confirmButton.style.marginLeft = '10px';
        },
      });
    
      if (confirm.isConfirmed) {
        try {
          const response = await fetch(`http://54.87.25.132/articulos/${idArticulo}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              authorization: `Bearer ${token}`,
            },
          });
    
          if (response.status === 204) {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El artículo ha sido eliminado correctamente.',
              icon: 'success',
              iconHtml: '🗑️',
              background: 'linear-gradient(to right, #FFA500, #FF7F50)',
              color: '#fff',
              confirmButtonText: 'Entendido',
              buttonsStyling: false,
              customClass: {
                popup: '',
                confirmButton: '',
              },
              didRender: (popup) => {
                const confirmButton = popup.querySelector('.swal2-confirm');
                confirmButton.style.backgroundColor = '#000';
                confirmButton.style.color = '#fff';
                confirmButton.style.border = 'none';
                confirmButton.style.borderRadius = '10px';
                confirmButton.style.padding = '10px 20px';
                confirmButton.style.fontSize = '16px';
                confirmButton.style.cursor = 'pointer';
                confirmButton.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
              },
            });
            window.location.reload(); // Recarga la página para reflejar los cambios.
          } else {
            Swal.fire({
              title: '¡Error!',
              text: `No se pudo eliminar el artículo. Código de estado: ${response.status}`,
              icon: 'error',
              iconHtml: '❌',
              background: 'linear-gradient(to right, #FFA500, #FF7F50)',
              color: '#fff',
              confirmButtonText: 'Entendido',
              buttonsStyling: false,
              customClass: {
                popup: '',
                confirmButton: '',
              },
            });
          }
        } catch (error) {
          Swal.fire({
            title: '¡Error!',
            text: 'Ocurrió un error al intentar eliminar el artículo.',
            icon: 'error',
            background: 'linear-gradient(to right, #FFA500, #FF7F50)',
            color: '#fff',
            confirmButtonText: 'Entendido',
            buttonsStyling: false,
            customClass: {
              popup: '',
              confirmButton: '',
            },
          });
        }
      }
    };    

    const handleRedirigirLapiz = (idArticulo, nombre, descripcion, imagen, precio, cantidad, categoria ) => {
        navigate(`/EditarProducto`, { state: { idArticulo, nombre, descripcion, imagen, precio, cantidad, categoria } }); // Ajusta la URL de la ruta
   
    };
    
    return(
        <div className={marketplaceStyle.contenedorProducto}>
            
            <img className={marketplaceStyle.imagenProducto} src={props.imagen} alt={props.nombre} />
            <div className={marketplaceStyle.infoProducto}>
                <h3 className={marketplaceStyle.textoGrandeProducto + " " + marketplaceStyle.contenedorTexto}>{props.nombre}</h3>
                <h6 className={marketplaceStyle.textoPequenoProducto + " " + marketplaceStyle.contenedorTexto}>{props.descripcion}</h6>
                <h6 className={marketplaceStyle.textoPequenoProducto + " " + marketplaceStyle.contenedorTexto}>{props.tipo} - {props.productor} - {props.lugar}</h6>
                <h3 className={marketplaceStyle.textoGrandeProducto + " " + marketplaceStyle.contenedorTexto} style={{marginTop: "9%", marginBottom: "9%", marginRight: "100%"}}>$ {props.precio}</h3>
            </div>
            <div className={marketplaceStyle.contenedorMiniBotones}>

                <button className={marketplaceStyle.miniBoton} style={{ backgroundColor: "#C62E2E" }} onClick={() => handleRedirigirBasura(props.idArticulo)}> <img src={basura} width="20px" /> </button>
                <button className={marketplaceStyle.miniBoton} style={{backgroundColor: "#117554"}}onClick={() => handleRedirigirLapiz(props.idArticulo, props.nombre,props.descripcion, props.imagen, props.precio, props.cantidad, props.categoria)}><img src={lapiz} width="20px"/></button>
            </div>
        </div>
    )
}

export default TarjetaProducto;