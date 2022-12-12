import { Divider, Button, Space, Image } from "antd";
import {
  GithubOutlined,
  SlackOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks";
import "./community.scss";
import { GITHUB_LINK, SLACK_LINK, TWITTER_LINK } from "../../config";

export const Community = ({ star, fork }) => {
  const { locale, t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="home-community">
      <div className="home-community-title">
        DolphinScheduler {t("community")}
      </div>
      <div className="home-community-content">
        <div className="home-community-info">
          <div className="home-community-total">
            <div className="home-community-item">
              <div className="home-community-amount">
                {star ? star.toLocaleString("en-us") : "-"}
              </div>
              <div className="home-community-text">Github Stars</div>
            </div>
            <Divider type="vertical" />
            <div className="home-community-item">
              <div className="home-community-amount">
                {fork ? fork.toLocaleString("en-us") : "-"}
              </div>
              <div className="home-community-text">Github Forks</div>
            </div>
          </div>
          <Space className="home-community-icons" size={20}>
            <Button
              icon={<GithubOutlined />}
              type="text"
              size="large"
              shape="circle"
              href={GITHUB_LINK}
              target="_blank"
            />
            <Button
              icon={<SlackOutlined />}
              type="text"
              size="large"
              shape="circle"
              href={SLACK_LINK}
              target="_blank"
            />
            <Button
              icon={<TwitterOutlined />}
              type="text"
              size="large"
              shape="circle"
              href={TWITTER_LINK}
              target="_blank"
            />
          </Space>
          <div>
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={() => {
                navigate(`/${locale}/community`);
              }}
            >
              {t("join_our_community")}
            </Button>
          </div>
        </div>
        <Image src="/images/home/community.png" preview={false} />
      </div>
    </div>
  );
};
