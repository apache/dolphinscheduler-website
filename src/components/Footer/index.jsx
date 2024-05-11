import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { Divider, Button, Space } from "antd";
import {
  GithubOutlined,
  SlackOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useTranslation } from "../../hooks";
import { GITHUB_LINK, TWITTER_LINK, SLACK_LINK } from "../../config";
import "./index.scss";

const Footer = () => {
  const { locale, t } = useTranslation();
  useEffect(() => {
    const script = document.createElement('script');

    script.src = "https://widget.kapa.ai/kapa-widget.bundle.js";
    script.async = true;
    script.dataset.websiteId = "e3268e5d-c0f1-4e71-819c-c60ebb2215a7";
    script.dataset.projectName = "Apache DolphinScheduler";
    script.dataset.projectColor = "#0097E0";
    script.dataset.projectLogo = "images/logo_400x400.jpg";
    script.dataset.modalDisclaimer = "This is a custom LLM for Apache DolphinScheduler with access to all developer Documentation, Blog, GitHub issues and discussions.";
    script.dataset.modalExampleQuestions = "Why we need DolphinScheduler?,How to deploy DolphinScheduler?,How to submit task?,How to contribute?";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);
  return (
    <footer className="footer">
      <section className="footer-content">
        <div className="footer-links">
          <Link className="footer-link" to={`/${locale}/download`}>
            {t("download")}
          </Link>
          <Divider type="vertical" />
          <Link className="footer-link" to={`/${locale}/docs`}>
            {t("doc")}
          </Link>
          <Divider type="vertical" />
          <Link className="footer-link" to={`/${locale}/community`}>
            {t("community")}
          </Link>
          <Divider type="vertical" />
          <Link className="footer-link" to={`/${locale}/events`}>
            {t("events")}
          </Link>
          <Divider type="vertical" />
          <Link className="footer-link" to={`/${locale}/blog`}>
            {t("blog")}
          </Link>
          <Divider type="vertical" />
          <Link className="footer-link" to={`/${locale}/use_case`}>
            {t("use_case")}
          </Link>
          <Divider type="vertical" />
          <Link className="footer-link" to={`/${locale}/support`}>
            {t("support")}
          </Link>
        </div>
        <div className="footer-desc">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="footer-logo-white"></div>
            </div>
            <div className="footer-copyright">
              Copyright © 2019-{new Date().getFullYear()} The Apache Software
              Foundation. Apache DolphinScheduler, DolphinScheduler, and its
              feather logo are trademarks of The Apache Software Foundation.
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-contacts">
              <div className="footer-contacts-label">Contacts</div>
              <Space>
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
            </div>
            <div className="footer-email">
              {`${t("email")}: users-subscribe@dolphinscheduler.apache.org`}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
