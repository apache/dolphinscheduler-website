import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Dropdown, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation, useVersions } from "../../hooks";
import { SLACK_LINK, TWITTER_LINK, GITHUB_LINK, EMAIL } from "../../config";
import { useMenu } from "./useMenu";
import "./index.scss";

const getSelectedKey = (location) => {
  if (location.includes("docs")) return "docs";
  if (location.includes("use_case")) return "use_case";
  if (location.includes("support")) return "support";
  if (location.includes("community")) return "community-menu";
  if (location.includes("events")) return "events";
  if (location.includes("blog")) return "blog";
};

const NavBar = () => {
  const [isSearch, setIsSearch] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(
    getSelectedKey(location.pathname)
  );
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const { versions } = useVersions();
  const menu = useMenu(t);
  return (
    <nav className="navbar">
      <section className="navbar-content">
        <div className="navbar-item navbar-item-left">
          <div
            className="ds-logo"
            onClick={() => {
              navigate(`/${locale}`);
              setSelectedKeys("");
            }}
          />
          {!isSearch && (
            <div className="navbar-menu">
              <Menu
                onSelect={({ key }) => {
                  if (
                    [
                      "apache",
                      "foundation",
                      "license",
                      "apache-events",
                      "security",
                      "sponsorship",
                      "thanks",
                    ].includes(key)
                  )
                    return;
                  navigate(
                    key !== "docs"
                      ? `/${locale}/${key}`
                      : `/${locale}/${key}/${versions[0]}`
                  );
                  setSelectedKeys(key);
                }}
                mode="horizontal"
                items={menu}
                selectedKeys={[selectedKeys]}
              />
            </div>
          )}
        </div>
        <Space className="navbar-item navbar-item-right" size={14}>
          {!isSearch ? (
            <Button
              icon={<SearchOutlined />}
              shape="circle"
              type="text"
              size="large"
              onClick={() => void setIsSearch(true)}
            />
          ) : (
            <Input.Search
              style={{ width: "30vw" }}
              placeholder={t("search_placeholder")}
              allowClear
              onSearch={(value) => {
                if (value) navigate(`/${locale}/search?t=${value}`);
                setIsSearch(false);
              }}
            />
          )}
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <a
                      href={GITHUB_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Github
                    </a>
                  ),
                  key: "github",
                },
                {
                  label: (
                    <a
                      href={SLACK_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("join_our_slack")}
                    </a>
                  ),
                  key: "slack",
                },
                {
                  label: (
                    <a
                      href={TWITTER_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("follow_twitter")}
                    </a>
                  ),
                  key: "twitter",
                },
                {
                  label: (
                    <a
                      href={`mailto:${EMAIL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("contact_emails")}
                    </a>
                  ),
                  key: "email",
                },
              ],
            }}
          >
            <Button shape="round">{t("contacts")}</Button>
          </Dropdown>
        </Space>
      </section>
    </nav>
  );
};

export default NavBar;
