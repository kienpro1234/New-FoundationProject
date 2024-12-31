import React from "react";
import classes from "./LandingHome.module.css";
import { NavLink } from "react-router-dom";
export default function LandingHome() {
  return (
    <section className={classes["landing-home"]}>
      <div className={classes["landing-home-captions"]}>
        <h3>TASTY KITCHEN</h3>
        <p>
          GET HIGH-END
          <br /> CUISINE
          <br /> TO YOUR HOME
        </p>
        <NavLink to={"/menu"}>
          <button className="text-white">ORDER NOW!</button>
        </NavLink>
      </div>
    </section>
  );
}
