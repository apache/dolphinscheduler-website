import { useState } from "react";
import { Breadcrumb, Button, Collapse, Spin, Space } from "antd";
import {
  LinkOutlined,
  CaretRightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks";
import { useDownloadVersion } from "./useDownloadVersion";
import { formatName } from "../../utils/formatName";
import { formatDate } from "../../utils/formatDate";
import "./version.scss";

export const Version = () => {
  const [more, setMore] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { locale, t } = useTranslation();
  const { detail, versions, loading, changelog } = useDownloadVersion(
    params,
    navigate
  );

  return !loading ? (
    <section className="download-version">
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href={`/${params.locale}/download`}>{t("download")}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{params.version}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="download-version-title">{t("released_versions")}</div>
      <div className="download-version-subtitle"></div>
      <div className="download-version-content">
        <div className="download-version-panel">
          <div className="download-version-panel-title">V{params.version}</div>
          <div className="download-version-panel-time">
            {t("release_date")} {formatDate(detail?.time, locale)}
          </div>
        </div>
        <div className="download-version-main">
          <div className="download-version-main-title">
            {versions[0]} {t("release_tips")} 3.3.*/3.4.*
          </div>
          <div className="download-version-log">
            <Button
              className="download-version-documentation"
              type="link"
              onClick={() => {
                navigate(`/${params.locale}/docs/${params.version}`);
              }}
            >
              {t("read_documentation")}
              <LinkOutlined />
            </Button>
            <div className="download-version-log-title">
              {t("change_log")}
              <Button
                type="link"
                onClick={() => {
                  navigate(
                    `/${params.locale}/docs/${params.version}/changelog`
                  );
                }}
              >
                {t("full_changlog")}
                <LinkOutlined />
              </Button>
            </div>
            <div
              className="download-version-log-content"
              dangerouslySetInnerHTML={{ __html: changelog }}
            ></div>
          </div>
          <div className="download-version-deployment-title">
            {t("supported_deployment_environment")}
          </div>
          <div className="download-version-deployments">
            {detail.deployment?.map((item, i) => (
              <div className="download-version-deployment" key={i}>
                <div
                  className="download-version-deployment-icon"
                  style={{
                    backgroundImage: `url(./images/deployment/${formatName(
                      item
                    )}_on.png)`,
                  }}
                />
                <div className="download-version-deployment-text">{item}</div>
              </div>
            ))}
          </div>
          <Collapse
            defaultActiveKey={[0]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined size={28} rotate={isActive ? 90 : 0} />
            )}
            bordered={false}
          >
            <Collapse.Panel header={t("source_code_download")}>
              <div className="download-version-item">
                <div className="download-version-item-title">
                  {t("download")}
                </div>
                <Button type="link" href={detail.src.src}>
                  {detail.src.src?.split("/").at(-1)}
                </Button>
              </div>
              <div className="download-version-item">
                <div className="download-version-item-title">
                  {t("checksums")}
                </div>
                <Button type="link" href={detail.src.sha512}>
                  {detail.src.sha512?.split("/").at(-1)}
                </Button>
              </div>
              <div className="download-version-item">
                <div className="download-version-item-title">
                  {t("signature")}
                </div>
                <Button type="link" href={detail.src.asc}>
                  {detail.src.asc?.split("/").at(-1)}
                </Button>
              </div>
              <div className="download-version-item">
                <div className="download-version-item-title">GPG key</div>
                <Button
                  type="link"
                  href="https://downloads.apache.org/dolphinscheduler/KEYS"
                  target="_blank"
                >
                  PGP signatures KEYS
                </Button>
              </div>
            </Collapse.Panel>
            <Collapse.Panel header={t("binary_download")}>
              <div className="download-version-item">
                <div className="download-version-item-title">
                  {t("download")}
                </div>
                <Button type="link" href={detail.bin.src}>
                  {detail.bin.src?.split("/").at(-1)}
                </Button>
              </div>
              <div className="download-version-item">
                <div className="download-version-item-title">
                  {t("checksums")}
                </div>
                <Button type="link" href={detail.bin.sha512}>
                  {detail.bin.sha512?.split("/").at(-1)}
                </Button>
              </div>
              <div className="download-version-item">
                <div className="download-version-item-title">
                  {t("signature")}
                </div>
                <Button type="link" href={detail.bin.asc}>
                  {detail.bin.asc?.split("/").at(-1)}
                </Button>
              </div>
              <div className="download-version-item">
                <div className="download-version-item-title">GPG key</div>
                <Button
                  type="link"
                  href="https://downloads.apache.org/dolphinscheduler/KEYS"
                  target="_blank"
                >
                  PGP signatures KEYS
                </Button>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="download-version-sider">
          <div className="download-version-sider-content">
            <div className="download-version-sider-title">
              {t("released_versions")}
            </div>
            <ul>
              {versions
                .filter((item, i) => (more ? true : i < 3))
                .map((item, i) => (
                  <li key={i}>
                    <Button
                      type="link"
                      onClick={() => {
                        navigate(`/${params.locale}/download/${item}`);
                      }}
                    >
                      v{item}
                    </Button>
                  </li>
                ))}
            </ul>
            {!more && (
              <Space
                className="download-version-more"
                onClick={() => {
                  setMore(true);
                }}
              >
                {t("show_more_versions")}
                <DownOutlined rotate={more ? 180 : 0} />
              </Space>
            )}
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div className="ds-spin">
      <Spin size="large" />
    </div>
  );
};
