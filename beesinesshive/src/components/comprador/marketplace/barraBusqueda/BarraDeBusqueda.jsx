import React from 'react';
import styles from './BarraDeBusqueda.module.css';

export default function BarraDeBusqueda({ searchTerm, onSearchChange }) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Buscar categoría"
        value={searchTerm} 
        onChange={onSearchChange} 
      />
      <button className={styles.searchButton}>
        🔍
      </button>
    </div>
  );
}
