import { Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useVersions, useTranslation } from "../../hooks";
import "./index.scss";

export { Deployment } from "./Deployment";
export { Version } from "./Version";

const Download = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { versions } = useVersions();
  const { t } = useTranslation();

  return (
    <section className="download">
      <div className="download-top">
        <div className="download-title">
          <div>Download the</div>
          <div className="download-subtitle">
            <div className="gradient-text">DolphinScheduler</div>
            <div>Release</div>
          </div>
        </div>
        <div className="download-top-bg"></div>
      </div>
      <div className="download-content">
        <div className="download-item">
          <div className="download-item-info">
            <div className="download-item-title">
              {t("by_deployment_environment")}
            </div>
            <div className="download-item-desc">
              {t("choose_by_your_deployment_requirement")}
            </div>
            <Button
              className="download-item-more"
              type="link"
              onClick={() => {
                navigate(`/${params.locale}/download/deployment`);
              }}
            >
              {t("learn_more")}
            </Button>
          </div>
          <div className="download-item-img-deployment"></div>
        </div>
        <div className="download-item">
          <div className="download-item-info">
            <div className="download-item-title">
              {t("by_released_versions")}
            </div>
            <div className="download-item-desc"></div>
            <Button
              className="download-item-more"
              type="link"
              onClick={() => {
                navigate(`/${params.locale}/download/${versions[0]}`);
              }}
            >
              {t("learn_more")}
            </Button>
          </div>
          <div className="download-item-img-version"></div>
        </div>
      </div>
    </section>
  );
};

export default Download;
