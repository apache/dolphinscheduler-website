export const useMenu = (t) => {
  return [
    {
      label: t("doc"),
      key: "docs",
    },
    {
      label: t("community"),
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
      label: "Apache",
      key: "apache",
      children: [
        {
          label: (
            <a
              href="https://www.apache.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
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
              rel="noopener noreferrer"
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
              Events
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
