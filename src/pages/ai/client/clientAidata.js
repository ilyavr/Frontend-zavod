import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../App";
import "../ClientAiData.css";

const ClientAidata = () => {
  const [dsExamples, setExamples] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState({ id: null, name: null });
  const [showAI100, setShowAI100] = useState(false); // Состояние для кнопки AI100
  const [showAI600, setShowAI600] = useState(false); // Состояние для кнопки AI600
  const { client } = useParams();
  const [modelId, setModelId] = useState(-1);
  const [modelNames, setModelNames] = useState([]);
  const [exampleImages, setExampleImages] = useState([]);

  useEffect(() => {
    fetch(`${ApiUrl}/ai/classes/getclassesetalon`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const filteredData = data.filter((classValue) => !classValue.deleted);
          const formattedNames = filteredData.map(
            (classValue) => ({
              id: classValue.id,
              name: `${classValue.class} (id:${classValue.id})`,
            })
          );
          setModelNames(formattedNames);
        }
      })
      .catch((err) => console.error("Ошибка при получении классов:", err));
  }, []);

  useEffect(() => {
    fetch(`${ApiUrl}/ai/dataset/getExamples?modelId=${modelId}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setExamples(data);
          const images = data.map((example) => example.data);
          setExampleImages(images);
        }
      })
      .catch((err) => console.error("Ошибка при получении примеров:", err));
  }, [modelId]);

  const handleImageClick = (imageData, details) => {
    const imagePrefix = imageData.startsWith("data:image/") ? "" : "data:image/jpeg;base64,";
    setSelectedImage(`${imagePrefix}${imageData}`);
    setSelectedDetails(details);
  };

  const handleShowAI100 = () => {
    setShowAI100(true);
    setShowAI600(false);
  };

  const handleShowAI600 = () => {
    setShowAI100(false);
    setShowAI600(true);
    setSelectedImage(null);
  };

  return (
    <div className="client-aidata">
      <div className="etalonButtons">
        <button
          className={showAI100 ? "etalon-active-button" : ""}
          onClick={handleShowAI100}
        >
          AI100
        </button>
        <button
          className={showAI600 ? "etalon-active-button" : ""}
          onClick={handleShowAI600}
        >
          AI600
        </button>
      </div>

      {showAI100 && (
        <div className="thumbnail-gallery">
          {dsExamples.map((example, index) => (
            <div key={index} className="thumbnail-container">
              <div className="thumbnail-title">
                {modelNames[index]?.name || "Без имени"}
              </div>
              <img
                className="thumbnail"
                src={`${exampleImages[index]}`}
                alt={`Thumbnail ${index}`}
                onClick={() =>
                  handleImageClick(exampleImages[index], modelNames[index] || { id: null, name: "Без имени" })
                }
              />
            </div>
          ))}
        </div>
      )}

      {showAI600 && <div className="no-data">Нет данных для AI600</div>}

      {selectedImage && (
        <div className="selected-image">
          <p align="center">{selectedDetails.name}</p>
          <img src={selectedImage} alt="Увеличенное изображение" />
        </div>
      )}
    </div>
  );
};

export default ClientAidata;