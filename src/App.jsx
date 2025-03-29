import { useEffect } from "react";
import "./App.css";

const API_KEY = "";

function App() {
  const getRandomDog = async () => {
    const response = await fetch(
      `https://api.thedogapi.com/v1/images/search?&api_key=${API_KEY}`
    );
    const data = await response.json();

    console.log(data);
  };

  useEffect(() => {
    getRandomDog();
  }, []);

  return <></>;
}

export default App;
