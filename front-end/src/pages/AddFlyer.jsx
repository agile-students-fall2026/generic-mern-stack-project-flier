import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddFlyerForm from "../components/AddFlyerForm";
import { useFlyers } from "../hooks/useFlyers";

const primaryButton = "feature-copy flex h-fit w-full p-6 items-center justify-center rounded-xl border border-black/10 bg-white text-base font-semibold shadow-sm active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)";

function NotAnAdmin() {
  return (
    <div className="flex flex-col">
      <h1 className="heading">Oops!</h1>
      <p className="feature-copy mt-2">
        Looks like you aren&apos;t registered as an admin of an organization yet...
      </p>
      <div className="mt-8 flex flex-col gap-4">
        <Link to="/organizations" className={primaryButton}>
          Find an Organization
        </Link>
        <Link to="/home" className={primaryButton}>
          Back to Main Feed
        </Link>
      </div>
    </div>
  );
}

export default function AddFlyer() {
  const navigate = useNavigate();
  const { addFlyer } = useFlyers();
  // Mock of the user's admin role until accounts come from the back end.
  const [isAdmin, setIsAdmin] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [organizationError, setOrganizationError] = useState("");

  useEffect(() => {
    if (!isAdmin) {return undefined;}

    const controller = new AbortController();
    async function loadOrganizations() {
      setLoadingOrganizations(true);
      setOrganizationError("");
      try {
        const response = await fetch("/api/organizations", { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) {
          throw new Error("Could not load organizations.");
        }
        setOrganizations(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setOrganizationError(error.message || "Could not load organizations.");
        }
      } finally {
        if (!controller.signal.aborted) {setLoadingOrganizations(false);}
      }
    }

    loadOrganizations();
    return () => controller.abort();
  }, [isAdmin]);

  async function handlePost(values) {
    const formData = new FormData();
    formData.append("image", values.imageFile);
    const uploadResponse = await fetch("/api/uploads", { method: "POST", body: formData });
    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok || !uploadData.url) {
      throw new Error(uploadData.error || "Could not upload flyer file.");
    }

    const { imageFile, ...flyer } = values;
    const createdFlyer = await addFlyer({ ...flyer, image: uploadData.url });
    navigate(`/flyer/${createdFlyer.id}`);
  }

  return (
    <div className="flex flex-1 flex-col bg-(--parchment) rounded-t-4xl inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3 relative">
      {/* TODO: Remove this once proper backend & role-based access control is working. */}
      <div className="mx-auto flex w-full max-w-md justify-end absolute top-2 right-8">
        <button
          type="button"
          onClick={() => setIsAdmin((current) => !current)}
          className="body-copy text-sm text-(--soft-black)/70 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
        >
          {isAdmin ? "Switch to Student View" : "Switch to Organization Admin View"}
        </button>
      </div>

      {isAdmin ? (
        loadingOrganizations ? (
          <p className="body-copy p-8">Loading organizations…</p>
        ) : organizationError ? (
          <p role="alert" className="body-copy p-8">{organizationError}</p>
        ) : (
          <AddFlyerForm mode="add" organizations={organizations} onSubmit={handlePost} />
        )
      ) : (
        <section className="flex flex-1 flex-col p-8 text-(--soft-black) justify-center">
          <div className="mx-auto w-full max-w-md">
            <NotAnAdmin />
          </div>
        </section>
      )}
    </div>
  );
}
