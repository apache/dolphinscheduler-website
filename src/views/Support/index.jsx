import { memo } from "react";
import { Space, Typography, Select, Collapse, Spin } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { useTranslation } from "../../hooks";
import { SLACK_LINK, EMAIL, GITHUB_LINK } from "../../config";
import { useSupport } from "./useSupport";
import "./index.scss";

const Support = () => {
  const { t, locale } = useTranslation();
  const { versions, version, faqs, loading, handleVersion } =
    useSupport(locale);
  return (
    <section className="support">
      <div className="support-top">
        <div className="support-title">
          <div>Our</div>
          <div className="gradient-text">Support</div>
        </div>
      </div>
      <div className="support-content">
        <div className="support-desc">
          <div className="support-desc-hints">{t("support_hints")}</div>
          <div className="support-desc-item">
            <span>1. </span>
            <span>{t("submit")}</span>
            <Typography.Link
              href={`${GITHUB_LINK}/issues/new/choose`}
              target="_blank"
            >
              {" "}
              an issue{" "}
            </Typography.Link>
            <span>{t("on_github")}</span>
          </div>
          <div className="support-desc-item">
            <span>2. </span>
            <span>{t("support_slack")}</span>
            <Typography.Link href={SLACK_LINK} target="_blank">
              {" "}
              #general
            </Typography.Link>
          </div>
          <div className="support-desc-item">
            <span>3. </span>
            <span>{t("support_email")}</span>
            <Typography.Link href={`mailto:${EMAIL}`} target="_blank">
              {EMAIL}
            </Typography.Link>
          </div>
        </div>
        <div className="support-faq">
          <div className="support-faq-top">
            <div className="support-faq-title">FAQs</div>
            <Space className="support-faq-version">
              <div className="support-faq-version-label">Select Version</div>
              <Select
                value={version}
                style={{ width: 90 }}
                options={versions.map((version) => ({
                  label: version,
                  value: version,
                }))}
                size="medium"
                onChange={handleVersion}
              />
            </Space>
          </div>
          <Spin spinning={loading}>
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              {faqs.map((faq, i) => (
                <Collapse.Panel
                  key={i}
                  header={<div dangerouslySetInnerHTML={{ __html: faq.q }} />}
                  className="support-faq-panel"
                >
                  <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                </Collapse.Panel>
              ))}
            </Collapse>
          </Spin>
        </div>
      </div>
    </section>
  );
};

export default memo(Support);
