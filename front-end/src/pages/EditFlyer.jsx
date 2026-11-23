import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AddFlyerForm from "../components/AddFlyerForm";
import { useFlyers } from "../context/FlyersContext";

// API flyers use starts_at / organizationId; the shared form uses date / time / clubId.
function toFormValues(flyer) {
  if (flyer.date && flyer.time) {
    return flyer;
  }

  const start = flyer.starts_at ? new Date(flyer.starts_at) : null;
  const pad = (n) => String(n).padStart(2, "0");

  return {
    image: flyer.image ?? "",
    title: flyer.title ?? "",
    clubId: flyer.organizationId ?? flyer.clubId ?? "",
    date: start ? `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}` : "",
    time: start ? `${pad(start.getHours())}:${pad(start.getMinutes())}` : "",
    location: flyer.location ?? "",
  };
}

function EditFlyerPanel({ flyer }) {
  const location = useLocation();
  const { updateFlyer } = useFlyers();
  const [notice, setNotice] = useState(location.state?.notice ?? "");

  function handleSave(values) {
    updateFlyer(flyer.id, values);
    setNotice("Changes saved");
  }

  return (
    <AddFlyerForm
      heading="Edit Details"
      submitLabel="Save"
      initialValues={toFormValues(flyer)}
      onSubmit={handleSave}
      notice={notice}
    />
  );
}

export default function EditFlyer() {
  const { flyerId } = useParams();
  const { getFlyer } = useFlyers();
  const flyer = getFlyer(flyerId);

  if (!flyer) {
    return (
      <section className="flex flex-1 flex-col bg-(--parchment) p-8 pb-28 text-(--soft-black) inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3 rounded-4xl">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <p className="body-copy">This flyer is not available.</p>
          <Link to="/home" className="body-copy underline underline-offset-4">
            Back to Main Feed
          </Link>
        </div>
      </section>
    );
  }

  return <EditFlyerPanel key={flyer.id} flyer={flyer} />;
}
