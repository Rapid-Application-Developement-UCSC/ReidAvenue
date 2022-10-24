import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LandingHeader from "../components/layout/LandingHeader";

export default function IndexPage() {
  return (
    <div className="index-page">
      <section id="hero">
        <LandingHeader />
        <main>
          <h1>
            The Platform <br /> for UOC photographers{" "}
          </h1>
          <h2>Share your creativity with your fellow students!</h2>
          <a href="#features">
            <FontAwesomeIcon icon="fa-angles-down" className="see-more" />
          </a>
        </main>
      </section>

      <section id="features">
        <div className="feature">
          <FontAwesomeIcon icon="fa-camera" />
          <h3>Upload your photos as posts!</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            condimentum, nisl ut aliquam lacinia, nunc nisl aliquet nisl, quis
            aliquam nisl nisl sit amet nisl.
          </p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon="fa-folder-plus" />
          <h3>Add posts to collection </h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            condimentum, nisl ut aliquam lacinia, nunc nisl aliquet nisl, quis
            aliquam nisl nisl sit amet nisl.
          </p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon="fa-user-friends" />
          <h3>Make friends</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            condimentum, nisl ut aliquam lacinia, nunc nisl aliquet nisl, quis
            aliquam nisl nisl sit amet nisl.
          </p>
        </div>
      </section>
    </div>
  );
}
