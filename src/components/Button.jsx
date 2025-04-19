import '../assets/Button.css'; // Estilos del botón

function Button({ text, onClick, isPrimary = true, fullWidth = false }) {
  const buttonClass = `button ${isPrimary ? 'primary' : 'secondary'} ${fullWidth ? 'full-width' : ''}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;