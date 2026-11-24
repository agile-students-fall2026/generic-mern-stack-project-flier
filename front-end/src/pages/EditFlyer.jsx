import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AddFlyerForm from "../components/AddFlyerForm";
import { useFlyer } from "../hooks/useFlyer";
import { useOrgs } from "../hooks/useOrgs";
import { EmptyState, ErrorState, LoadingState } from "../components/LoadingState";

function EditFlyerPanel({ flyer, updateFlyer }) {
  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.notice ?? "");
  const { organizations, loading: organizationsLoading, error: organizationsError } = useOrgs();

  async function handleSave(values) {
    let image = values.image;
    if (values.imageFile) {
      const formData = new FormData();
      formData.append("image", values.imageFile);
      const uploadResponse = await fetch("/api/uploads", { method: "POST", body: formData });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Could not upload flyer file.");
      }
      image = uploadData.url;
    }
    const { imageFile, ...updates } = values;
    await updateFlyer({ ...updates, image });
    setNotice("Changes saved");
  }

  return (
    <div className="flex flex-1 flex-col bg-(--parchment) rounded-t-4xl inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3 relative">
      <AddFlyerForm
        mode="edit"
        heading="Edit Details"
        submitLabel="Save"
        organizations={Array.isArray(organizations) ? organizations : []}
        initialValues={flyer}
        onSubmit={handleSave}
        notice={notice}
      />
      {organizationsLoading && <LoadingState label="Loading organizations…" className="absolute bottom-4 left-4 right-4 z-10" />}
      {organizationsError && <ErrorState className="absolute bottom-4 left-4 right-4 z-10">{organizationsError}</ErrorState>}
    </div>
  );
}

export default function EditFlyer() {
  const { flyerId } = useParams();
  const { flyer, loading, error, updateFlyer } = useFlyer(flyerId);

  if (loading || error || !flyer) {
    return (
      <section className="flex flex-1 flex-col bg-(--parchment) p-8 pb-28 text-(--soft-black) inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3 rounded-4xl">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          {loading ? <LoadingState label="Loading flyer…" /> : error ? <ErrorState>{error}</ErrorState> : <EmptyState><p className="body-copy">This flyer is not available.</p></EmptyState>}
          <Link to="/home" className="body-copy underline underline-offset-4">
            Back to Main Feed
          </Link>
        </div>
      </section>
    );
  }

  return <EditFlyerPanel key={flyer.id} flyer={flyer} updateFlyer={updateFlyer} />;
}
