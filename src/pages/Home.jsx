import { Link } from "react-router-dom";
// import Header from "../components/Header/Header";
import Modal from "../components/UI/Modal";
import LandingHome from "../components/Home/LandingHome";
import Footer from "../components/Footer/Footer";

/**
 * The Home component is the main page of the app.
 * It displays a landing page with a hero section and a call to action.
 * The hero section contains a background image, a title, a subtitle and a button.
 * The call to action is a button that links to the menu page.
 */
export default function Home() {
  return (
    <section className="home">
      <LandingHome />
    </section>
  );
}
