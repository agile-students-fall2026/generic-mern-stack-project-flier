import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import arrowBack from "../assets/arrow-back-40px.svg";
import { useOrgs } from "../hooks/useOrgs";

function ClubDetailPanel({ club }) {
  const [adminRequested, setAdminRequested] = useState(false);

  return (
    <section className="flex flex-1 flex-col bg-(--parchment) p-8 pb-26 text-(--soft-black) rounded-4xl inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3">
      <div className="mx-auto flex w-full flex-1 flex-col items-center">
        <div className="relative flex w-full items-center justify-center">
          <img
            src={club.logo}
            alt=""
            className="size-36 rounded-full object-cover"
          />
          <Link
            to="/organizations"
            aria-label="Back to organization list"
            className="absolute right-0 top-0 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
          >
            <img src={arrowBack} alt="" className="size-8 brightness-0" />
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <h1 className="heading text-center">{club.name}</h1>
        </div>
        <a
          href={`mailto:${club.email}`}
          className="body-copy mt-2 underline underline-offset-4"
        >
          {club.email}
        </a>

        <div className="mt-8 flex min-h-72 w-full flex-1 flex-col bg-white px-6 py-6">
          <p className="body-copy">{club.description}</p>
          <div className="mt-auto flex flex-col items-start gap-4 pt-10">
            <button
              type="button"
              onClick={() => setAdminRequested(true)}
              disabled={adminRequested}
              className="body-copy underline underline-offset-4 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
            >
              {adminRequested ? "Admin access requested" : "Request Admin Access"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ClubDetails() {
  const { clubId } = useParams();
  const { organization, loading, error } = useOrgs({ id: clubId });

  if (loading || error || !organization) {
    return (
      <section className="flex flex-1 flex-col bg-(--parchment) px-5 pt-8 pb-10 text-(--soft-black)">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <p className="body-copy">
            {loading ? "Loading organization…" : error || "This organization was not found."}
          </p>
          <Link to="/organizations" className="body-copy underline underline-offset-4">
            Back to organization list
          </Link>
        </div>
      </section>
    );
  }

  return <ClubDetailPanel key={organization.id} club={organization} />;
}
