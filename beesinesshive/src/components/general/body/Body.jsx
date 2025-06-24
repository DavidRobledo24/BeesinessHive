import { useEffect, useState, React } from "react";
import styles from "./body.module.css";
import abejaPrincipal from "../../../assets/abejaPrincipal.png";
import Andres from "../../../assets/Andres.jpg";
import emily1 from "../../../assets/emily1.jpg";
import Jordy from "../../../assets/Jordy.jpg";
import David from "../../../assets/David.jpg";
import valentina from "../../../assets/valentina.jpg";
import Fabio from "../../../assets/Fabio.jpg";
import { Link } from "react-router-dom";

export default function Body() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const newPosition = -scrollPosition / 5;
  const newOpacity = 1 - scrollPosition / 500;

  return (
    <div>
      <div className={styles.contenedorInicio}>
        <div className={styles.imagenPrincipal}>
          <img
            className={styles.abejaPrincipal}
            src={abejaPrincipal}
            alt="abejaPrincipal"
            style={{
              transform: `translateX(${newPosition}px)`,
              opacity: newOpacity,
            }}
          />
        </div>
        <div className={styles.contendorBienvenida}>
          <h2 className={styles.bienvenidaTitulo}>Bienvenid@ a</h2>
          <h1 className={styles.tituloMarca}>
            <span className={styles.beesinessb}>Beesiness</span>
            <span className={styles.hiveb}>Hive</span>
          </h1>
          <h3 className={styles.slogan}>
            ¡El lugar donde endulzamos tu trabajo!
          </h3>
          <Link to="login" className={styles.btnIniciar}>Iniciar Ahora</Link>
        </div>
      </div>

      <div className={styles.contQueEs} id="queEs">
        <h2 className={styles.tituloQueEs}>
          ¿Qué es
          <span className={styles.beesiness}> Beesiness</span>
          <span className={styles.hive}>Hive</span>?
        </h2>
        <p className={styles.parrafoQueEs}>
          BeesinessHive es un proyecto que busca mejorar la gestión de los
          apicultores manejando una variedad de formatos didacticos como las
          bitacoras y el registro de actividades que tengan dentro de sus
          apiarios.
          <br></br>
          <br></br>
          Se Manejara un marketplace donde los civiles como los mismos
          productores puedan buscar y comprar productos que necesiten o sean de
          su agrado, ampliando el conocimiento de este gran mundo de amarillo y
          negro a rayas.
        </p>
      </div>

      <div className={styles.contObjetivos}>
        <h1 className={styles.tituloObjetivo}>Objetivos</h1>
        <p className={styles.parrafoObjetivo}>
          Nuestro objetivo principal es el ayudar a los apicultores a tener sus
          registros de forma virtual, creando una copia segura de su trabajo,
          siendo facil de manejar para todos los usuarios.<br></br>
          Buscamos crear conexiones de los apicultores y compradores en sus
          ventas, creando lazos de confianza.
        </p>
      </div>

      <div
        className={styles.contenedorGrupoTrabajo}
        style={{ marginTop: "60px" }}
        id="teamWork"
      >
        <div className={styles.contenedorTitulo}>
          <h2 className={styles.titutoGrupoTrabajo}>
            Nuestro grupo de trabajo
          </h2>
        </div>
        <div className={styles.miembrosTrabajo}>
          <img
            className={styles.fotoTemporal}
            src={Andres}
            alt="Andres"
          />
          <div className={styles.info}>
            <h3 className={styles.nombreMiembro}>Andrés Osorio</h3>
            <p className={styles.descripcion}>
              Soy Andrés Osorio Zapata, tecnologo en analisis y desarrollo de
              software, me apasiona la tecnologia y todo lo relacionado con el
              desarrollo de software, experimentado en desarrollo web con React,
              Node.js y PHP. En busca de expandir mi conocimiento y experiencia
              en diferentes areas de desarrollo.
              <br></br>
              <a href="https://github.com/Minajio" className={styles.links} target="_blank">
                <strong>Trabajos</strong>
              </a>
            </p>
          </div>
        </div>

        <div className={styles.miembrosTrabajo}>
          <div className={styles.info}>
            <h3 className={styles.nombreMiembro}>David Robledo</h3>
            <p className={styles.descripcion}>
              Hola soy David, un estudiante de tecnología en análisis y desarrollo
              de software, soy una persona muy dedicada a mi trabajo, me enfoco
              en la lógica y el backend; me encanta jugar videojuegos y aprender
              nuevas tecnologías.
              <br></br>
              <a
                href="https://github.com/DavidRobledo24"
                className={styles.links}
                target="_blank"
              >
                <strong>Trabajos</strong>
              </a>
            </p>
          </div>
          <img
            className={styles.fotoTemporal}
            src={David}
            alt="David"
          />
        </div>

        <div className={styles.miembrosTrabajo}>
          <img
            className={styles.fotoTemporal}
            src={emily1}
            alt="emily1"
          />
          <div className={styles.info}>
            <h3 className={styles.nombreMiembro}>Emily García</h3>
            <p className={styles.descripcion}>
              Tengo conocimientos de HTML, CSS, SASS, JS, Python y JAVA. Soy una
              persona resiliente, con muy buena capacidad para liderar y
              organizar las tareas asignadas. Llevo más de 3 años programando y
              estoy adoptando mi enfoque para gestionar la ciberseguridad.
              <br></br>
              <a href="https://github.com/Mimi0908" className={styles.links} target="_blank">
                <strong>Trabajos</strong>
              </a>
            </p>
          </div>
        </div>

        <div className={styles.miembrosTrabajo}>
          <div className={styles.info}>
            <h3 className={styles.nombreMiembro}>Jordy Sneider Arias</h3>
            <p className={styles.descripcion}>
              Hola, mi nombre es Jordy Arias Ramírez tengo 20 años, actualmente
              me dedico al área de software, en la rama de Back - end; Uso la
              librería de React con el framework de express usando el orm de
              Mysql Sequelize.
              <br></br>
              <a href="https://github.com/Jordy-int" className={styles.links} target="_blank">
                <strong>Trabajos</strong>
              </a>
            </p>
          </div>
          <img
            className={styles.fotoTemporal}
            src={Jordy}
            alt="Jordy"
          />
        </div>

        <div className={styles.miembrosTrabajo}>
          <img
            className={styles.fotoTemporal}
            src={valentina}
            alt="valentina"
          />
          <div className={styles.info}>
            <h3 className={styles.nombreMiembro}>Valentina Gonzalez</h3>
            <p className={styles.descripcion}>
              Hola, Me llamo Valentina González Carmona, tengo 18 años y
              actualmente estoy cursando el Tecnólogo en Análisis y Desarrollo
              de Software, me enfoco en la rama del Front-end y
              Uso HTML, CSS y JS.
              <br></br>
              <a
                href=" https://github.com/Valentina0630"
                className={styles.links}
                target="_blank"
              >
                <strong>Trabajos</strong>
              </a>
            </p>
          </div>
        </div>

        <div className={styles.miembrosTrabajo}>
          <div className={styles.info}>
            <h3 className={styles.nombreMiembro}>Fabio Andrés</h3>
            <p className={styles.descripcion}>
              Soy un apasionado por el desarrollo backend y la arquitectura
              cloud, siempre encaminado a buscar retos para crear soluciones
              robustas y escalables, mi enfoque se centra en diseñar software
              eficiente que transforma ideas en realidad e impulsen la
              innovación tecnológica, comunícate conmigo {""}
              <a
                href="https://fabioandresnaranjomorales.s3.amazonaws.com/index.html#"
                className={styles.links}
                style={{ color: "black" }}
                target="_blank"
              >
                <strong>Acá</strong>
              </a>
              .<br></br>
              <a
                href="https://github.com/NaranjoMorales"
                className={styles.links}
                target="_blank"
              >
                <strong>Trabajos</strong>
              </a>
            </p>
          </div>
          <img
            className={styles.fotoTemporal}
            src={Fabio}
            alt="Fabio"
          />
        </div>
      </div>
    </div>
  );
}
