import { useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, Image, Typography } from "antd";
import { useTranslation } from "../../hooks/useTranslation";
import { useCase } from "./useCase";
import "./index.scss";

const UseCase = () => {
  const [more, setMore] = useState(false);
  const { locale, t } = useTranslation();
  const navigate = useNavigate();
  const { users, cases } = useCase(locale);

  return (
    <section className="usecase">
      <div className="usecase-top">
        <div className="usecase-title">
          <div>DolphinScheduler</div>
          <div className="gradient-text">Use Case</div>
        </div>
        <div className="usecase-top-bg"></div>
      </div>
      <div className="usecase-user">
        <div className="usecase-user-title">{t("user_title")}</div>
        <div className="usecase-user-list">
          {users
            .filter((item, i) => (more ? true : i < 21))
            .map((item, i) => (
              <Image key={i} src={item} preview={false} />
            ))}
        </div>
        {users.length >= 21 && !more && (
          <div className="usecase-user-more">
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => {
                setMore(true);
              }}
            >
              {t("show_more")}
            </Button>
          </div>
        )}
      </div>
      <div className="usecase-cases">
        <div className="usecase-cases-title">Use Cases</div>
        <div className="usecase-cases-list">
          {cases.map((item, i) => (
            <div className="usecase-cases-item" key={i}>
              <Image preview={false} src={item.img} />
              <Typography.Paragraph
                ellipsis={{ rows: 1 }}
                className="usecase-cases-item-title"
              >
                {item.title}
              </Typography.Paragraph>
              <Typography.Paragraph
                ellipsis={{ rows: 2 }}
                className="usecase-cases-item-text"
              >
                {item.desc}
              </Typography.Paragraph>
              <div className="usecase-cases-item-footer">
                <div>
                  {item.logo && <div className="usecase-cases-item-logo"></div>}
                </div>
                <Button
                  type="link"
                  onClick={() => {
                    navigate(`/${locale}/blog/${item.name}`);
                  }}
                >
                  {t("explore_the_story")} <ArrowRightOutlined />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCase;
