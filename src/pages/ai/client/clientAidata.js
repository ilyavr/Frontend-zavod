import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiUrl } from "../../../App";
import "../ClientAiData.css";

const ClientAidata = () => {
  const [dsExamples, setExamples] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [modelNames, setModelNames] = useState([]);
  const { client } = useParams();
  const [modelId, setModelId] = useState(-1);

  useEffect(() => {
    fetch(`${ApiUrl}/ai/dataset/getClasses`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const formattedNames = data.map((classValue) => `Б-${classValue}`);
          setModelNames(formattedNames);
        }
      })
      .catch((err) => console.error("Ошибка при получении классов:", err));
  }, []);

  useEffect(() => {
    fetch(`${ApiUrl}/ai/dataset/getExamples?modelId=` + modelId, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setExamples(data);
        }
      })
      .catch((err) => console.error("Ошибка при получении примеров:", err));
  }, [modelId]);

  const handleModelChange = (event) => {
    const selectedIndex = parseInt(event.target.value, 10) - 1;
    const example = dsExamples[selectedIndex];
    if (example && example.data) {
      const imagePrefix = example.data.startsWith("data:image/") ? "" : "data:image/jpeg;base64,";
      setImageSrc(`${imagePrefix}${example.data}`);
    } else {
      console.error("Не удалось загрузить изображение для примера:", example);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "image/jpeg") {
        alert("Пожалуйста, загрузите изображение в формате JPEG.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const newExample = {
          classId: -1,
          data:`data:image/jpeg;base64,${base64Data}`,
        };

        fetch(`${ApiUrl}/ai/dataset/addExample`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExample),
        })
          .then((response) => {
            if (response.ok) {
              alert("Эталон добавлен!");
            } else {
              alert("Ошибка при добавлении эталона.");
            }
          })
          .catch((err) => console.error("Ошибка:", err));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="client-aidata">
      <div className="model-selection">
        <select id="modelSelect" onChange={handleModelChange} defaultValue="">
          <option value="" disabled>
            Выберите модель
          </option>
          {modelNames.map((name, index) => (
            <option key={name} value={index}>
              {name}
            </option>
          ))}
        </select>
        <label className="custom-file-upload">
          Добавить эталон
          <input type="file" accept="image/jpeg" onChange={handleFileUpload} />
        </label>
      </div>

      {imageSrc && (
        <div className="result">
          <img src={imageSrc} alt="Generated from base64" />
        </div>
      )}
    </div>
  );
};

export default ClientAidata;