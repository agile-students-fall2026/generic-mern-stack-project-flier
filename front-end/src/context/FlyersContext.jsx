import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";

const FlyersContext = createContext(null);

function toApiFlyer(values, imageUrl) {
  return {
    title: values.title,
    // Form does not collect categories/description yet — send safe defaults.
    categories: values.categories?.length ? values.categories : ["General"],
    starts_at: new Date(`${values.date}T${values.time}`).toISOString(),
    location: values.location,
    image: imageUrl,
    organizationId: values.clubId,
    description: values.description || values.title,
  };
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
    let imageUrl = values.image;

    if (values.imageFile) {
      const formData = new FormData();
      formData.append("image", values.imageFile);
      const uploaded = await apiPost("/api/uploads", formData);
      imageUrl = uploaded.url;
    }

    const data = await apiPost("/api/flyers", toApiFlyer(values, imageUrl));
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
