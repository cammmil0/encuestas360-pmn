function Card({ title, description, onButtonClick, buttonText }) {
    return (
      <div className="card">
        <h3>{title}</h3>
        <p>{description}</p>
        <button onClick={onButtonClick}>{buttonText}</button>
      </div>
    );
  }
  
  export default Card;