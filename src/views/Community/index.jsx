import { Button } from "antd";
import {
  GithubOutlined,
  SlackOutlined,
  TwitterOutlined,
  MailFilled,
  YoutubeOutlined,
} from "@ant-design/icons";
import { ArrowRightOutlined } from "@ant-design/icons";
import { SLACK_LINK, GITHUB_LINK, TWITTER_LINK, EMAIL, YOUTUBE_LINK } from "../../config";
import { useTranslation } from "../../hooks";
import "./index.scss";

// ... (keep the subs array as is)

const Community = () => {
  const { t } = useTranslation();

  return (
    <section className="community">
      <div className="community-top">
        {/* ... (keep this section as is) */}
      </div>
      <div className="community-content">
        <div className="community-contacts">
          <div className="community-contact">
            <div className="community-contact-icon">
              <GithubOutlined />
            </div>
            <div className="community-contact-desc">
              {t("participate_on_gitHub")}
            </div>
            <Button
              type="primary"
              shape="round"
              size="large"
              ghost
              onClick={() => {
                window.open(GITHUB_LINK, "_blank");
              }}
            >
              {t("view_on_github")}
            </Button>
          </div>
          <div className="community-contact">
            <div className="community-contact-icon">
              <SlackOutlined />
            </div>
            <div className="community-contact-desc">{t("chat_slack")}</div>
            <Button
              type="primary"
              shape="round"
              size="large"
              ghost
              onClick={() => {
                window.open(SLACK_LINK, "_blank");
              }}
            >
              {t("join_slack")}
            </Button>
          </div>
          <div className="community-contact">
            <div className="community-contact-icon">
              <TwitterOutlined />
            </div>
            <div className="community-contact-desc">{t("twitter_tips")}</div>
            <Button
              type="primary"
              shape="round"
              size="large"
              ghost
              onClick={() => {
                window.open(TWITTER_LINK, "_blank");
              }}
            >
              {t("follow_twitter")}
            </Button>
          </div>
          {/* Add YouTube Section */}
          <div className="community-contact">
            <div className="community-contact-icon">
              <YoutubeOutlined />
            </div>
            <div className="community-contact-desc">{t("youtube_tips")}</div>
            <Button
              type="primary"
              shape="round"
              size="large"
              ghost
              onClick={() => {
                window.open(YOUTUBE_LINK, "_blank");
              }}
            >
              {t("subscribe_youtube")}
            </Button>
          </div>
          <div className="community-contact">
            <div className="community-contact-icon">
              <MailFilled />
            </div>
            <div className="community-contact-mail-desc">
              <span>{t("support_email")}</span>
              <a
                href={`mailto:${EMAIL}`}
                target="_blank"
                rel="noreferrer"
                className="community-contact-mail-link"
              >
                users-subscribe@dolphinscheduler.apache.org
              </a>{" "}
              <span>{t("email_tips")}</span>
            </div>
          </div>
        </div>

        {/* ... (keep the rest of the code as is) */}
      </div>
    </section>
  );
};

export default Community;