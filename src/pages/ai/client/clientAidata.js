import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../App";
import "../ClientAiData.css";

const ClientAidata = () => {
  const [dsExamples, setExamples] = useState([]);
  const [exampleImages, setExampleImages] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState({ id: null, name: null });
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const { client } = useParams();
  const [activeModel, setActiveModel] = useState(null); // Активная модель

  const fetchDataForModel = async (modelId) => {
    setLoading(true);
    setExamples([]);
    setExampleImages([]);
    setModelNames([]);
    setSelectedImage(null);
    setSelectedDetails({ id: null, name: null });

    try {
      // Получаем эталоны для текущей модели
      const classesResponse = await fetch(`${ApiUrl}/ai/classes/getclassesetalon?modelId=${modelId}`);
      const classesData = await classesResponse.json();
      if (classesData && classesData.length > 0) {
        const formattedNames = classesData.map((classValue) => ({
          id: classValue.id,
          name: `${classValue.class} (id:${classValue.id})`,
        }));
        setModelNames(formattedNames);
      }

      // Получаем примеры для текущей модели
      const examplesResponse = await fetch(`${ApiUrl}/ai/dataset/getExamples?modelId=${modelId}`);
      const examplesData = await examplesResponse.json();
      if (examplesData && examplesData.length > 0) {
        setExamples(examplesData);
        const images = examplesData.map((example) => example.data);
        setExampleImages(images);
      }
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (modelId) => {
    if (activeModel !== modelId) {
      setActiveModel(modelId);
      fetchDataForModel(modelId);
    }
  };

  const handleImageClick = (imageData, details) => {
    const imagePrefix = imageData.startsWith("data:image/") ? "" : "data:image/jpeg;base64,";
    setSelectedImage(`${imagePrefix}${imageData}`);
    setSelectedDetails(details);
  };

  return (
    <div className="client-aidata">
      <div className="etalonButtons">
        <button
          className={activeModel === 2 ? "etalon-active-button" : ""}
          onClick={() => handleModelChange(2)}
        >
          AI100
        </button>
        <button
          className={activeModel === 3 ? "etalon-active-button" : ""}
          onClick={() => handleModelChange(3)}
        >
          AI600
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Загрузка...</div>
      ) : (
        activeModel && (
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
        )
      )}

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