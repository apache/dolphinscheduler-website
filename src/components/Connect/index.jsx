import { Button } from "antd";
import { EMAIL } from "../../config";
import { useTranslation } from "../../hooks";
import "./index.scss";

const Connect = () => {
  const { t } = useTranslation();
  return (
    <div className="connect">
      <div className="connect-title">
        {t("Stay Connect with DolphinScheduler")}
      </div>
      <div className="connect-desc">{t("subscribe_tips")}</div>
      <Button size="large" type="link" href={`mailto:${EMAIL}`}>
        {t("email_to")}
      </Button>
    </div>
  );
};

export default Connect;
