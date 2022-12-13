import { Space } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

export const useMenu = (t) => {
  return [
    {
      label: t("doc"),
      key: "docs",
    },
    {
      label: (
        <Space size="small" align="center">
          <span>{t("community")}</span>
          <CaretDownOutlined />
        </Space>
      ),
      key: "community-menu",
      children: [
        {
          label: t("community"),
          key: "community",
        },
        {
          label: t("events"),
          key: "events",
        },
        {
          label: t("blog"),
          key: "blog",
        },
      ],
    },
    {
      label: t("use_case"),
      key: "use_case",
    },
    {
      label: t("support"),
      key: "support",
    },
    {
      label: (
        <Space size="small" align="center">
          <span>Apache</span>
          <CaretDownOutlined />
        </Space>
      ),
      key: "apache",
      children: [
        {
          label: (
            <a href="https://www.apache.org/" target="_blank" rel="noreferrer">
              Foundation
            </a>
          ),
          key: "foundation",
        },
        {
          label: (
            <a
              href="https://www.apache.org/licenses/"
              target="_blank"
              rel="noreferrer"
            >
              License
            </a>
          ),
          key: "license",
        },
        {
          label: (
            <a
              href="https://www.apache.org/events/current-event"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Events
            </a>
          ),
          key: "apache-events",
        },
        {
          label: (
            <a
              href="https://www.apache.org/security/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Security
            </a>
          ),
          key: "security",
        },
        {
          label: (
            <a
              href="https://www.apache.org/foundation/sponsorship.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sponsorship
            </a>
          ),
          key: "sponsorship",
        },
        {
          label: (
            <a
              href="https://www.apache.org/foundation/thanks.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Thanks
            </a>
          ),
          key: "thanks",
        },
      ],
    },
  ];
};
