import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import flierLogoTitle from "../assets/flier-logo-title.svg";
import arrowBack from "../assets/arrow-back-40px-black.svg";

export default function Register() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("student");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-(--paper) text-(--soft-black)">
      <div className="flex justify-center">
        <img src={flierLogoTitle} alt="Flier logo" className="h-24 w-54"/>
      </div>

      <div className="flex flex-1 flex-col items-center rounded-t-4xl bg-(--parchment) inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] p-8 mt-3">
        <div className="flex w-full flex-1 flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="heading text-(--soft-black)">Create an Account</h1>
              <Link to="/">
                <img src={arrowBack} alt="Back arrow" className="size-8" />
              </Link>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); navigate("/home"); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-(--soft-black)">
                <label className="feature-copy">I am a...</label>
                <div className="flex flex-row gap-2">
                  <label className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-(--paper) px-4 py-3 body-copy">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === "student"}
                      onChange={() => setAccountType("student")}
                      className="accent-(--nyu-indigo)"
                    />
                    Student
                  </label>

                  <label className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-(--paper) px-4 py-3 body-copy">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === "club"}
                      onChange={() => setAccountType("club")}
                      className="accent-(--nyu-indigo)"
                    />
                    Club/Organization
                  </label>
                </div>
              </div>

              <label className="feature-copy">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-xl bg-(--paper) px-4 py-3 inset-shadow-sm shadow-md body-copy -mt-2"
              />

              <label className="feature-copy">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nyu-student@nyu.edu"
                className="w-full rounded-xl bg-(--paper) px-4 py-3 inset-shadow-sm shadow-md body-copy -mt-2"
              />

              <label className="feature-copy">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl bg-(--paper) px-4 py-3 inset-shadow-sm shadow-md body-copy -mt-2"
              />

              <label className="feature-copy">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-xl bg-(--paper) px-4 py-3 inset-shadow-sm shadow-md body-copy -mt-2"
              />
            </form>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              onClick={() => navigate("/home")}
              className="feature-copy text-(--paper) flex w-full py-4 items-center justify-center rounded-xl bg-(--nyu-indigo) shadow-md active:scale-[0.99]"
            >
              Register
            </button>
            <div className="text-center body-copy">
              Already have an account? <Link to="/login" className="text-(--nyu-indigo) underline">Log In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
