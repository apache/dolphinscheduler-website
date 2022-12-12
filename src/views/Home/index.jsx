import { Main } from "./Main";
import { Tasks } from "./Tasks";
import { Why } from "./Why";
import { Features } from "./Features";
import { Community } from "./Community";
import { Events } from "./Events";
import Connect from "../../components/Connect";
import { useHome } from "./useHome";
import "./index.scss";

const Home = () => {
  const { star, fork } = useHome();
  return (
    <section className="home">
      <Main star={star} fork={fork} />
      <Tasks />
      <Why />
      <div className="home-remain">
        <div className="home-remain-bg" />
        <div className="home-remain-content">
          <Features />
          <Community star={star} fork={fork} />
        </div>
      </div>
      <Events />
      <Connect />
    </section>
  );
};

export default Home;
