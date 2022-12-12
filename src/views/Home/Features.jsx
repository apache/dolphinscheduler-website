import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation, useVersions } from "../../hooks";
import "./features.scss";

export const Features = () => {
  const { locale, t } = useTranslation();
  const navigate = useNavigate();
  const { currentVersion } = useVersions();
  return (
    <div className="home-features">
      <div className="home-features-title">{t("features")}</div>
      <div className="home-features-list">
        {FEATURES.map((item, index) => (
          <div className="home-features-item" key={index}>
            <div
              className="home-features-item-img"
              style={{ backgroundImage: `url(${item.img})` }}
            />
            <div className="home-features-item-title">{t(item.title)}</div>
            <div className="home-features-item-desc">{t(item.desc)}</div>
          </div>
        ))}
      </div>
      <Button
        className="home-features-btn"
        type="primary"
        size="large"
        shape="round"
        onClick={() => {
          navigate(`/${locale}/docs/${currentVersion}`);
        }}
      >
        {t("read_the_documentation")}
      </Button>
    </div>
  );
};

const FEATURES = [
  {
    img: "./images/features/ha.png",
    title: "features_1_title",
    desc: "features_1_desc",
  },
  {
    img: "./images/features/easyuse.png",
    title: "features_2_title",
    desc: "features_2_desc",
  },
  {
    img: "./images/features/scene.png",
    title: "features_3_title",
    desc: "features_3_desc",
  },
  {
    img: "./images/features/scaleout.png",
    title: "features_4_title",
    desc: "features_4_desc",
  },
];
