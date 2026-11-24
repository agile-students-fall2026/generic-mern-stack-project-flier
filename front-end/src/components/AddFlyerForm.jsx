import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowBack from "../assets/arrow-back-40px-black.svg";
import CustomDropdown from "./CustomDropdown";
import DateTimeFields from "./DateTimeFields";
import FlyerFileUpload from "./FlyerFileUpload";
import { localDateTimeToIso } from "../utils/flyerDate";
import { FLYER_CATEGORIES } from "../constants/flyerCategories";

/* Used for data entry validation & restrictions */
const LOCATION_OPTIONS = [
  "Kimmel Center",
  "Bobst Library",
  "Tisch (721 Broadway)",
  "Global Center for Academic and Spiritual Life (GCASL)",
  "370 Jay Street",
];
/* Shared TailwindCSS styles in the form */
const labelClass = "flex flex-col feature-copy text-(--soft-black) gap-2";
const inputClass = "w-full rounded-2xl px-4 py-3 bg-(--paper) inset-shadow-sm shadow-md body-copy";

/* 
 * Takes the list of organizations and an onSubmit handler as parameters.
 * Organizations are passed to render the possible options in a dropdown and for ID assignment.
*/
export default function AddFlyerForm({ organizations = [], onSubmit, mode = "add", heading, submitLabel, notice = "", initialValues }) {
  const navigate = useNavigate();
  const initialDate = initialValues?.starts_at ? new Date(initialValues.starts_at) : null;
  const [inputs, setInputs] = useState({
    title: "",
    categories: [],
    location: "",
    organizationId: "",
    description: "",
    ...(initialValues || {}),
  });
  /* Separated date and time fields since they need to be parsed into an ISO timestamp */
  const [date, setDate] = useState(initialDate && !Number.isNaN(initialDate.getTime()) ? [initialDate.getFullYear(), String(initialDate.getMonth() + 1).padStart(2, "0"), String(initialDate.getDate()).padStart(2, "0")].join("-") : "");
  const [time, setTime] = useState(initialDate && !Number.isNaN(initialDate.getTime()) ? [String(initialDate.getHours()).padStart(2, "0"), String(initialDate.getMinutes()).padStart(2, "0")].join(":") : "");
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* Helper to update what the backend should receive as form inputs change. */
  function setField(name, value) {
    setInputs((current) => ({ ...current, [name]: value }));
  }

  /* Data validation before passing off to backend with the provided onSubmit. */
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const startsAt = localDateTimeToIso(date, time);
    // Error handling: bad file type, no organization or categories chosen, and no time input
    if (mode === "add" && !imageFile) {return setFormError("Please upload a flyer image.");}
    if (!inputs.organizationId) {return setFormError("Choose an organization.");}
    if (inputs.categories.length === 0) {return setFormError("Choose at least one category.");}
    if (!inputs.location) {return setFormError("Enter a location.");}
    if (!startsAt) {return setFormError("Pick a valid date and time.");}

    setSubmitting(true);
    try {
      await onSubmit({ ...inputs, starts_at: startsAt, imageFile, image: inputs.image });
    } catch (error) {
      setFormError(error.message || "Could not post flyer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col p-8 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="heading text-(--soft-black)">{heading || (mode === "edit" ? "Edit Flyer" : "Add a Flyer")}</h1>
        <button
          type="button"
          onClick={() => navigate("/home")}
          aria-label="Back"
          className="flex items-center justify-center focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
        >
          <img src={arrowBack} alt="" className="size-8" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <FlyerFileUpload file={imageFile} onChange={setImageFile} />

        <label className={labelClass}>
          Title*
          <input type="text" value={inputs.title} onChange={(e) => setField("title", e.target.value)} className={inputClass} placeholder="Event name" required />
        </label>

        <CustomDropdown
          fieldLabel="Organization*"
          label="Choose an organization"
          options={organizations.map((org) => ({ value: String(org.id), label: org.name }))}
          value={inputs.organizationId}
          onChange={(value) => setField("organizationId", value)}
          placeholder="Choose an organization"
        />

        <CustomDropdown
          fieldLabel="Categories* (choose one or more)"
          label="Choose flyer categories"
          options={FLYER_CATEGORIES.map((category) => ({ value: category, label: category }))}
          value={inputs.categories}
          onChange={(value) => setField("categories", value)}
          placeholder="Choose categories"
          multiple
        />

        <DateTimeFields date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

        <CustomDropdown
          fieldLabel="Location*"
          label="Choose a location"
          options={LOCATION_OPTIONS.map((locationOption) => ({ value: locationOption, label: locationOption }))}
          value={inputs.location}
          onChange={(value) => setField("location", value)}
          placeholder="Choose a location"
        />

        <label className={labelClass}>
          Description*
          <textarea value={inputs.description} onChange={(e) => setField("description", e.target.value)} className={inputClass} rows={4} placeholder="The next big event!" required />
        </label>

        {(formError || notice) && <p role={formError ? "alert" : "status"} className="body-copy text-sm text-red-700">{formError || notice}</p>}
        <button type="submit" disabled={submitting} className="subheading mt-2 flex w-full items-center justify-center rounded-2xl py-2 bg-(--nyu-indigo) text-(--paper) shadow-md disabled:opacity-60 inset-shadow-sm">
          {submitting ? "Saving…" : submitLabel || (mode === "edit" ? "Save" : "Post!")}
        </button>
      </form>
    </div>
  );
}
