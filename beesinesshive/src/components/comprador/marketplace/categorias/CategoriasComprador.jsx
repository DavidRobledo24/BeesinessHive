import React, { useRef } from 'react';
import styles from './categoriasComprador.module.css';

const categorias = [
    { nombre: 'Miel', emoji: '🍯' },
    { nombre: 'Polen', emoji: '🌻' },
    { nombre: 'Propoleo', emoji: '🛡️' },
    { nombre: 'Cera de abeja', emoji: '🕯️' },
    { nombre: 'Apitoxina', emoji: '🧪' },
    { nombre: 'Jalea Real', emoji: '👑' },
    { nombre: 'Productos transformados', emoji: '✨' },
    { nombre: 'Cosméticos', emoji: '💄' },
    { nombre: 'Reinas', emoji: '👑'},
    { nombre: 'Colmenas', emoji: '🏠' },
    { nombre: 'Nucleos', emoji: '🌱' },
    { nombre: 'Servicios Polinizacion', emoji: '🐝' },
    { nombre: 'Accesorios', emoji: '🛠️' },
    { nombre: 'Otros', emoji: '❓' },
];

export default function CategoriasComprador({ setCategoriaSeleccionada }) {
    const containerRef = useRef(null);

    const scrollLeft = () => {
        containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
        containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    return (
        <div className={styles.ContenedorCategorias}>
            <div className={styles.contenedorTitulo}>
                <h1 className={styles.titulo}>CATEGORIAS</h1>
            </div>
            <div className={styles.listaCategorias}>
                <button className={styles.scrollButton} onClick={scrollLeft}>
                    &lt;
                </button>
                <div className={styles.contenedorCategorias} ref={containerRef}>
                    <div className={styles.contenido}>
                        {categorias.map((categoria, index) => (
                            <button 
                                key={index} 
                                className={styles.categoriaItem}
                                onClick={() => setCategoriaSeleccionada(categoria.nombre)}
                            >
                                <div className={styles.emoji}>
                                    {categoria.emoji}
                                </div>
                                <div className={styles.categoriaNombre}>{categoria.nombre}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <button className={styles.scrollButton} onClick={scrollRight}>
                    &gt;
                </button>
            </div>
        </div>
    );
}
