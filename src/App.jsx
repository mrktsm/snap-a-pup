import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_REACT_APP_DOG_API_KEY;
console.log("API Key:", API_KEY);

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [dogName, setDogName] = useState(null);
  const [breed, setBreed] = useState(null);
  const [lifeSpan, setLifeSpan] = useState(null);
  const [temperament, setTemperament] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bannedAttributes, setBannedAttributes] = useState([]);

  const getRandomDog = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.thedogapi.com/v1/images/search?has_breeds=1&api_key=${API_KEY}`
      );
      const data = await response.json();

      // Ensure data has the breed information
      if (data[0]?.breeds?.length > 0) {
        const breed = data[0].breeds[0].name;
        const lifeSpan = data[0].breeds[0].life_span;
        const temperament = data[0].breeds[0].temperament;

        // Check if any attribute is banned
        if (
          bannedAttributes.includes(breed) ||
          bannedAttributes.includes(lifeSpan) ||
          bannedAttributes.includes(temperament)
        ) {
          // If any attribute is banned, retry fetching a new dog
          getRandomDog();
          return;
        }

        // If no attributes are banned, set the dog information
        setDogImage(data[0].url);
        setDogName(breed);
        setBreed(data[0].breeds[0].breed_group || "Unknown");
        setLifeSpan(lifeSpan);
        setTemperament(temperament);
      } else {
        // Retry if no breed information
        getRandomDog();
        return;
      }
    } catch (error) {
      console.error("Error fetching dog:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getRandomDog();
  }, []);

  const handleButtonClick = (attribute) => {
    setBannedAttributes(
      (prevBannedAttributes) =>
        prevBannedAttributes.includes(attribute)
          ? prevBannedAttributes.filter((attr) => attr !== attribute) // Remove if already present
          : [...prevBannedAttributes, attribute] // Add if not present
    );
  };

  const isBanned = (attribute) => bannedAttributes.includes(attribute);

  return (
    <div className="app-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="content-wrapper">
          <h1 className="dog-name">{dogName}</h1>
          <div className="main-content">
            <div className="left-column">
              <div className="image-container">
                <img src={dogImage} alt={dogName} className="dog-image" />
              </div>
            </div>
            <div className="right-column">
              <div className="dog-attributes">
                <div className="attribute">
                  <button
                    className={`attribute-button ${
                      isBanned(breed) ? "banned" : ""
                    }`}
                    onClick={() => handleButtonClick(breed)}
                  >
                    {breed}
                  </button>
                </div>
                <div className="attribute">
                  <button
                    className={`attribute-button ${
                      isBanned(lifeSpan) ? "banned" : ""
                    }`}
                    onClick={() => handleButtonClick(lifeSpan)}
                  >
                    {lifeSpan}
                  </button>
                </div>
                <div className="attribute">
                  <button
                    className={`attribute-button temperament ${
                      isBanned(temperament) ? "banned" : ""
                    }`}
                    onClick={() => handleButtonClick(temperament)}
                  >
                    {temperament}
                  </button>
                </div>
                <button className="fetch-button" onClick={getRandomDog}>
                  Fetch Another Dog!
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={
                bannedAttributes.length === 0
                  ? "banned-container hidden"
                  : "banned-container"
              }
            >
              <h3>Banned Attributes:</h3>
              <div>
                {bannedAttributes.map((attribute) => (
                  <button
                    className="banned-button"
                    key={attribute}
                    onClick={() => handleButtonClick(attribute)}
                  >
                    {attribute}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
