import { useEffect, useState } from "react";
import "./App.css";

const API_KEY =
  "live_7ny1qsx8IJhBDcYvJHEJQ4CBG1pkSX7ZcXylN7vRs4QBG7jVPXDFho7GIk6rl47V";

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [dogName, setDogName] = useState(null);
  const [breed, setBreed] = useState(null);
  const [lifeSpan, setLifeSpan] = useState(null);
  const [temperament, setTemperament] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRandomDog = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.thedogapi.com/v1/images/search?has_breeds=1&api_key=${API_KEY}`
      );
      const data = await response.json();

      if (data[0]?.breeds?.length > 0) {
        setDogImage(data[0].url);
        setDogName(data[0].breeds[0].name);
        setBreed(data[0].breeds[0].breed_group || "Unknown");
        setLifeSpan(data[0].breeds[0].life_span);
        setTemperament(data[0].breeds[0].temperament);
      } else {
        // Retry if no breed data
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

  return (
    <div className="app-container">
      <div className="dog-card">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <h1 className="dog-name">{dogName}</h1>
            <div className="image-container">
              <img src={dogImage} alt={dogName} className="dog-image" />
            </div>
            <div className="dog-attributes">
              <div className="attribute">
                <span>Breed Group</span>
                <button
                  className="attribute-button"
                  onClick={() => alert(`Breed Group: ${breed}`)}
                >
                  {breed}
                </button>
              </div>
              <div className="attribute">
                <span>Life Span</span>
                <button
                  className="attribute-button"
                  onClick={() => alert(`Life Span: ${lifeSpan}`)}
                >
                  {lifeSpan}
                </button>
              </div>
              <div className="attribute">
                <span>Temperament</span>
                <button
                  className="attribute-button temperament"
                  onClick={() => alert(`Temperament: ${temperament}`)}
                >
                  {temperament}
                </button>
              </div>
            </div>
            <button className="fetch-button" onClick={getRandomDog}>
              Fetch Another Dog!
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
