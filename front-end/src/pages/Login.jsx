import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import flierLogoTitle from "../assets/flier-logo-title.svg";
import arrowBack from "../assets/arrow-back-40px-black.svg";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/home");
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--paper) text-(--soft-black)">
      <div className="flex justify-center">
        <img src={flierLogoTitle} alt="Flier logo" className="w-54 h-24" />
      </div>

      <div className="flex flex-1 flex-col items-center rounded-t-4xl bg-(--parchment) p-8 inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3">
        <div className="flex w-full flex-1 flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="heading text-(--soft-black)">Welcome back!</h1>
              <Link to="/" aria-label="Back to landing page">
                <img src={arrowBack} alt="" className="size-8" />
              </Link>
            </div>

            <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="login-identifier" className="feature-copy">Username/Email</label>
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Username or email"
                className="-mt-2 w-full rounded-xl bg-(--paper) px-4 py-3 body-copy inset-shadow-sm shadow-md"
                required
              />

              <label htmlFor="login-password" className="feature-copy">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="-mt-2 w-full rounded-xl bg-(--paper) px-4 py-3 body-copy inset-shadow-sm shadow-md"
                required
              />

              <div className="flex flex-col gap-2 text-(--soft-black)">
                <label className="flex cursor-pointer items-center gap-2 body-copy">
                  <input
                    type="checkbox"
                    checked={staySignedIn}
                    onChange={(event) => setStaySignedIn(event.target.checked)}
                    className="size-4 accent-(--nyu-indigo)"
                  />
                  <span>Stay signed in?</span>
                </label>
                <Link to="/forgot-password" className="body-copy text-(--nyu-indigo) underline">
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              form="login-form"
              className="feature-copy flex w-full items-center justify-center rounded-xl bg-(--nyu-indigo) py-4 text-(--paper) shadow-md active:scale-[0.99]"
            >
              Login
            </button>
            <div className="text-center body-copy">
              Don&apos;t have an account? <Link to="/register" className="text-(--nyu-indigo) underline">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
