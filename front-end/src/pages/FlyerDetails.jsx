import { Link, useParams } from "react-router-dom";
import Flyer from "../components/Flyer";
import { useFlyer } from "../hooks/useFlyer";

export default function FlyerDetails() {
  /* Grab the id from the URL params */
  const { flyerId } = useParams();
  const { flyer, loading, error } = useFlyer(flyerId);

  if (loading || error || !flyer) {
    return (
      <section className="flex flex-1 flex-col bg-(--parchment) p-8 text-(--soft-black)">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <p className="body-copy">{loading ? "Loading flyer…" : error || "This flyer was not found."}</p>
          <Link to="/home" className="body-copy underline underline-offset-4">Back to Main Feed</Link>
        </div>
      </section>
    );
  }

  return (
    <Flyer key={flyerId} flyer={flyer} mode="full"/>
  );
}
