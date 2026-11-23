import { useCallback, useRef, useState } from "react";
import uploadIcon from "../assets/upload-40px-black.svg";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export default function FlyerFileUpload({ file, onChange }) {
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);
  const previewUrl = useRef(null);

  // Attach the object URL directly to the preview image and release it with the ref.
  const setPreviewImage = useCallback((image) => {
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = null;
    }
    if (image && file) {
      previewUrl.current = URL.createObjectURL(file);
      image.src = previewUrl.current;
    }
  }, [file]);

  function handleFile(fileToCheck) {
    if (!fileToCheck) {return;}
    if (!ALLOWED_TYPES.includes(fileToCheck.type)) {
      setError("Choose a JPEG, PNG, GIF, or WebP image.");
      return;
    }
    if (fileToCheck.size > MAX_FILE_SIZE) {
      setError("File must be 25 MB or smaller.");
      return;
    }
    onChange(fileToCheck);
    setError("");
  }

  function removeFile() {
    onChange(null);
    setError("");
    if (fileInput.current) {fileInput.current.value = "";}
  }

  return (
    <>
      <section
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files[0]);
        }}
        className={`rounded-2xl p-4 text-center transition-colors inset-shadow-sm shadow-md ${dragging ? "border-2 border-dashed border-(--nyu-indigo) bg-(--nyu-indigo)/4" : "bg-(--paper)"}`}
      >
        <input
          ref={fileInput}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={(event) => handleFile(event.target.files[0])}
          className="sr-only"
          aria-label="Choose flyer image"
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <img ref={setPreviewImage} alt="Flyer preview" className="max-h-64 w-full rounded-xl object-contain" />
            <p className="body-copy break-all text-sm">{file.name}</p>
            <button type="button" onClick={removeFile} className="feature-copy rounded-xl bg-(--nyu-indigo) px-6 py-2 text-(--paper)">
              Remove Image
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6">
            <img src={uploadIcon} alt="" className="size-8" />
            <p className="body-copy">Choose an image or drag it here</p>
            <p className="body-copy text-(--soft-black)/60">JPEG, PNG, GIF, or WebP<br />(up to 25 MB)</p>
            <button type="button" onClick={() => fileInput.current?.click()} className="rounded-xl border border-(--soft-black)/20 px-6 py-2 body-copy">
              Browse Files
            </button>
          </div>
        )}
      </section>
      {error && <p role="alert" className="body-copy text-sm text-red-700">{error}</p>}
    </>
  );
}
