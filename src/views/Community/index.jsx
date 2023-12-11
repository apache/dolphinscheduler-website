import { Button } from "antd";
import {
  GithubOutlined,
  SlackOutlined,
  TwitterOutlined,
  MailFilled,
} from "@ant-design/icons";
import { ArrowRightOutlined } from "@ant-design/icons";
import { SLACK_LINK, GITHUB_LINK, TWITTER_LINK, EMAIL } from "../../config";
import { useTranslation } from "../../hooks";
import "./index.scss";

const subs = [
  {
    label: "report_security_issue",
    key: "security",
  },
  {
    label: "code_of_conduct",
    key: "code-conduct",
  },
  {
    label: "review_issue_or_pull_requests",
    key: "review",
  },
  {
    label: "e2e_test_contribution_guide",
    key: "e2e-guide",
  },
  {
    label: "submit_code",
    key: "submit-code",
  },
  {
    label: "license_notice",
    key: "DS-License",
  },
  {
    label: "documentation_notice",
    key: "document",
  },
  {
    label: "issue_notice",
    key: "issue",
  },
  {
    label: "pull_request_notice",
    key: "pull-request",
  },
  {
    label: "commit_message_notice",
    key: "commit-message",
  },
  {
    label: "micro_benchMark_notice",
    key: "microbench",
  },
  {
    label: "unit_test_writing",
    key: "unit-test",
  },
];

const Community = () => {
  const { t } = useTranslation();

  return (
    <section className="community">
      <div className="community-top">
        <div className="community-title">
          <div>DolphinScheduler</div>
          <div className="gradient-text">Community</div>
        </div>
        <div className="community-top-bg"></div>
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
        <div className="community-contribute">
          <div className="community-contribute-title">
            {t("contribute_to_dolphinScheduler")}
          </div>
          <div className="community-contribute-desc">
            {t("contribute_tips")}
            <Button
              type="link"
              href="https://github.com/apache/dolphinscheduler/blob/dev/docs/docs/en/contribute/join/contribute.md"
              target="_blank"
            >
              {t("participate_in_contributing")}
              <ArrowRightOutlined />
            </Button>
          </div>
          <div className="community-contribute-list">
            {subs.map((sub) => (
              <div className="community-contribute-item" key={sub.key}>
                <div className="community-contribute-item-title">
                  {t(sub.label)}
                </div>
                <Button
                  type="link"
                  href={`https://github.com/apache/dolphinscheduler/blob/dev/docs/docs/en/contribute/join/${sub.key}.md`}
                  target="_blank"
                >
                  {t("read_guides")}
                  <ArrowRightOutlined />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="community-committer">
        <div className="community-committer-title">
          {t("becoming_a_committer")}
        </div>
        <div className="community-committer-desc">
          <p className="community-committer-p">
            {t("committer_p")}
            <Button
              type="link"
              href={
                "https://github.com/apache/dolphinscheduler/blob/dev/docs/docs/en/contribute/join/become-a-committer.md"
              }
              target="_blank"
            >
              {t("read_guides")}
            </Button>
          </p>
          <p className="community-committer-p">
            {t("committer_process")}{" "}
            <Button
              type="link"
              href={"https://community.apache.org/newcommitter.html"}
              target="_blank"
            >
              {t("read_community_process")}
            </Button>
          </p>
          <ul className="community-committer-list">
            <li className="community-committer-item">{t("commiter_tips1")}</li>
            <li className="community-committer-item">{t("commiter_tips2")}</li>
            <li className="community-committer-item">{t("commiter_tips3")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Community;
