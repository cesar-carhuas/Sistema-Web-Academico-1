import { useNavigate } from 'react-router-dom';

function ContenidoInicio() {
    const navigate = useNavigate();

    // Función para redirigir al usuario


    return (
        <div className="contenido-inicio">
            <div className="intro-text">
                <h2>Bienvenido a <span className="empresa-nombre">Flexguaraje Perú</span></h2>
                <p className="subtitulo">¡Estamos felices de tenerte aquí!</p>
            </div>
            <div className="motivacion">
                <p>
                    ¡Estás a punto de empezar una gran aventura! En Flexguaraje, cada día es una nueva oportunidad
                    para crecer, aprender y ofrecer lo mejor de nosotros. Recuerda que el éxito se construye paso a paso,
                    y juntos lograremos grandes cosas.
                </p>
                <p>
                    No importa cuál grande sea el desafío, lo enfrentaremos con energía, optimismo y trabajo en equipo.
                    ¡Este es solo el comienzo de algo increíble!
                </p>
                <p>
                    "El éxito es la suma de pequeños esfuerzos repetidos día tras día." — Robert Collier
                </p>
            </div>
            <div className="cierre">
                <p>¡Estamos aquí para apoyarte en cada paso del camino! ¡Buena suerte en tu jornada laboral!</p>
                <h3>¡GRACIASSSSSSSSSSSSSSSSSSSSSSSS!</h3>
            </div>
        </div>
    );
}

export default ContenidoInicio;
