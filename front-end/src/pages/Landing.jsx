import { Link } from 'react-router-dom';
import flierLogoTitle from "../assets/flier-logo-title.svg";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="landing-page h-screen w-full bg-(--parchment) flex flex-col justify-center p-12 text-(--soft-black)">
      <div className="landing-content w-full h-full flex flex-col justify-end">
        <img src={flierLogoTitle} alt="Flier logo" className="w-48 -ml-5"/>

        {/* Headline */}
        <h1 className="heading">
          Ready to fly through the clutter?
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full mt-4">
          <Link
            to="/register"
            className="feature-copy w-full p-4 bg-(--nyu-indigo) text-(--paper) rounded-xl shadow-md inset-shadow-sm text-center"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="feature-copy w-full p-4 bg-(--paper) text-(--soft-black) rounded-xl shadow-md inset-shadow-sm text-center"
          >
            Login
          </Link>

        </div>
      </div>
    </main>
  );
}
