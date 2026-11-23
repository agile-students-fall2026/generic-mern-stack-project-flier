import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";

const FlyersContext = createContext(null);

// One multipart body: image file + event fields for POST /api/flyers.
function toFlyerFormData(values) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append(
    "categories",
    JSON.stringify(values.categories?.length ? values.categories : ["General"]),
  );
  formData.append("starts_at", new Date(`${values.date}T${values.time}`).toISOString());
  formData.append("location", values.location);
  formData.append("organizationId", values.clubId);
  formData.append("description", values.description || values.title);

  if (values.imageFile) {
    formData.append("image", values.imageFile);
  } else if (values.image && !values.image.startsWith("blob:")) {
    // Edit / re-post with an existing hosted image URL (no new file).
    formData.append("image", values.image);
  }

  return formData;
}

export function FlyersProvider({ children }) {
  const [flyers, setFlyers] = useState([]);

  useEffect(() => {
    apiGet("/api/flyers")
      .then((data) => setFlyers(data.flyers ?? []))
      .catch((err) => console.error("Failed to load flyers:", err));
  }, []);

  function getFlyer(id) {
    return flyers.find((flyer) => String(flyer.id) === String(id));
  }

  async function addFlyer(values) {
    const data = await apiPost("/api/flyers", toFlyerFormData(values));
    // Refetch so the new flyer includes organizationName like the list endpoint.
    const list = await apiGet("/api/flyers");
    setFlyers(list.flyers ?? []);
    return data.flyer.id;
  }

  function updateFlyer(id, fields) {
    setFlyers((current) =>
      current.map((flyer) => (flyer.id === id ? { ...flyer, ...fields, id } : flyer)),
    );
  }

  return (
    <FlyersContext.Provider value={{ flyers, getFlyer, addFlyer, updateFlyer }}>
      {children}
    </FlyersContext.Provider>
  );
}

// Context modules export a provider component and the hook that reads it.
// eslint-disable-next-line react-refresh/only-export-components
export function useFlyers() {
  const value = useContext(FlyersContext);
  if (!value) {
    throw new Error("useFlyers must be used within FlyersProvider");
  }
  return value;
}
