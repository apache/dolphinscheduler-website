import { Breadcrumb, Button, Spin, Collapse } from "antd";
import {
  ArrowRightOutlined,
  LinkOutlined,
  DownloadOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation, useVersions } from "../../hooks";
import { useDeployment } from "./useDeployment";
import "./deployment.scss";

export const Deployment = () => {
  const { locale, t } = useTranslation();
  const {
    deployments,
    current,
    loading,
    changelogs,
    changeType,
    handleChangelog,
  } = useDeployment(locale);
  const { currentVersion } = useVersions();
  const navigate = useNavigate();
  return !loading ? (
    <section className="deployment">
      <div className="deployment-top">
        <div className="deployment-box">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href={`/${locale}/download`}>{t("download")}</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{deployments[current].type}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="deployment-list">
            {deployments.map((item, i) => (
              <div
                className={`deployment-item ${current === i && "active"}`}
                key={i}
                onClick={() => {
                  changeType(item.type);
                }}
              >
                <div
                  className="deployment-item-icon"
                  style={{
                    backgroundImage: `url(./images/deployment/${
                      current === i ? item.icon + "_on" : item.icon
                    }.png)`,
                  }}
                />
                <div className="deployment-item-text">{item.type}</div>
              </div>
            ))}
          </div>
          <div className="deployment-release">
            <Button
              type="link"
              onClick={() => {
                navigate(`/${locale}/download/${currentVersion}`);
              }}
            >
              {t("view_all_release")}
              <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>
      <div className="deployment-content deployment-box">
        <div className="deployment-content-versions">
          <div className="deployment-content-title">
            {deployments[current].type} {t("deployment")}
          </div>
          <DeploymentHints
            type={deployments[current].icon}
            changeType={changeType}
            t={t}
          />
          {!!deployments[current]?.versions.length && (
            <>
              <div className="deployment-content-bold">
                {deployments[current].versions[0].version} {t("release_tips")}{" "}
                {deployments[current].versions[0].version}.
              </div>
              <Collapse
                defaultActiveKey={[0]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                accordion={true}
                onChange={(version) => {
                  if (version) handleChangelog(version);
                }}
              >
                {deployments[current].versions.map((item, i) => (
                  <Collapse.Panel header={item.version} key={item.version}>
                    <div className="deployment-content-version">
                      <Button
                        className="deployment-content-documentation"
                        type="link"
                        onClick={() => {
                          const title = deployments[current].type
                            .toLowerCase()
                            .replace(/\s/g, "-");
                          navigate(
                            `/${locale}/docs/${item.version}/guide/installation/${title}`
                          );
                        }}
                      >
                        {t("read_documentation")}
                        <LinkOutlined />
                      </Button>
                      <div
                        className="deployment-content-log-content"
                        dangerouslySetInnerHTML={{
                          __html: changelogs[item.version],
                        }}
                      ></div>
                      <div className="deployment-content-tips">
                        {t("download_total_source_code")}
                        <Button type="link" href={item.src.src}>
                          src <DownloadOutlined />
                        </Button>
                        {t("verify")}
                        <Button type="link" href={item.src.asc}>
                          asc <DownloadOutlined />
                        </Button>
                        <Button type="link" href={item.src.sha512}>
                          sha512 <DownloadOutlined />
                        </Button>
                      </div>
                      <div className="deployment-content-tips">
                        {t("download_total_binary_distribution")}
                        <Button type="link" href={item.bin.src}>
                          bin <DownloadOutlined />
                        </Button>
                        {t("verify")}
                        <Button type="link" href={item.bin.asc}>
                          asc <DownloadOutlined />
                        </Button>
                        <Button type="link" href={item.bin.sha512}>
                          sha512 <DownloadOutlined />
                        </Button>
                      </div>
                    </div>
                  </Collapse.Panel>
                ))}
              </Collapse>{" "}
            </>
          )}
        </div>
        {/* <div className="deployment-content-img"></div> */}
      </div>
    </section>
  ) : (
    <div className="ds-spin">
      <Spin size="large" />
    </div>
  );
};

const getTips = (type, changeType, t) => {
  if (type === "standalone") {
    return {
      bold: [t("standalone_title"), t("standalone_user")],
      tips: [
        () => t("standalone_demo"),
        () => (
          <>
            {t("standalone_tips1")}
            <Button
              type="link"
              onClick={() => {
                changeType("Pseudo Cluster");
              }}
            >
              Pseudo Cluster {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("standalone_tips2")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cluster");
              }}
            >
              Cluster {t("deployment")}
              <ArrowRightOutlined />
            </Button>
            {t("or")}
            <Button
              type="link"
              onClick={() => {
                changeType("Kubernetes");
              }}
            >
              Kubernetes {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
      ],
    };
  }
  if (type === "cloud") {
    return {
      bold: [t("cloud_title"), t("cloud_user")],
      tips: [
        () => t("cloud_demo"),
        () => (
          <>
            {t("cloud_tips1")}
            <Button
              type="link"
              onClick={() => {
                changeType("Standalone");
              }}
            >
              Standalone {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("cloud_tips2")}
            <Button
              type="link"
              onClick={() => {
                changeType("Pseudo Cluster");
              }}
            >
              Pseudo Cluster {t("deployment")}
              <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("cloud_tips3")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cluster");
              }}
            >
              Cluster {t("deployment")}
              <ArrowRightOutlined />
            </Button>
            {t("or")}
            <Button
              type="link"
              onClick={() => {
                changeType("Kubernetes");
              }}
            >
              Kubernetes {t("deployment")}
              <ArrowRightOutlined />
            </Button>
          </>
        ),
      ],
    };
  }
  if (type === "cluster") {
    return {
      bold: [t("cluster_title"), t("cluster_user")],
      tips: [
        () => t("cluster_demo"),
        () => (
          <>
            {t("cluster_tips1")}
            <Button
              type="link"
              onClick={() => {
                changeType("Standalone");
              }}
            >
              Standalone {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("cluster_tips2")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cloud");
              }}
            >
              Cloud {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("cluster_tips3")}
            <Button
              type="link"
              onClick={() => {
                changeType("Pseudo Cluster");
              }}
            >
              Pseudo Cluster {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("cluster_tips4")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cluster");
              }}
            >
              Cluster {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
      ],
    };
  }
  if (type === "kubernetes") {
    return {
      bold: [t("kubernetes_title"), t("kubernetes_user")],
      tips: [
        () => (
          <>
            {t("kubernetes_tips1")}
            <Button
              type="link"
              onClick={() => {
                changeType("Standalone");
              }}
            >
              Standalone {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("kubernetes_tips2")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cloud");
              }}
            >
              Cloud {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("kubernetes_tips3")}
            <Button
              type="link"
              onClick={() => {
                changeType("Pseudo Cluster");
              }}
            >
              Pseudo Cluster {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("kubernetes_tips4")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cluster");
              }}
            >
              Cluster {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
      ],
    };
  }
  if (type === "pseudo_cluster") {
    return {
      bold: [t("pseudo_cluster_title"), t("pseudo_cluster_user")],
      tips: [
        () => t("pseudo_cluster_demo"),
        () => (
          <>
            {t("pseudo_cluster_tips1")}
            <Button
              type="link"
              onClick={() => {
                changeType("Standalone");
              }}
            >
              Standalone {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("pseudo_cluster_tips2")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cloud");
              }}
            >
              Cloud {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
        () => (
          <>
            {t("pseudo_cluster_tips3")}
            <Button
              type="link"
              onClick={() => {
                changeType("Cluster");
              }}
            >
              Cluster {t("deployment")} <ArrowRightOutlined />
            </Button>
            {t("or")}
            <Button
              type="link"
              onClick={() => {
                changeType("Kubernetes");
              }}
            >
              Kubernetes {t("deployment")} <ArrowRightOutlined />
            </Button>
          </>
        ),
      ],
    };
  }
};

const DeploymentHints = ({ type, changeType, t }) => {
  const tips = getTips(type, changeType, t);
  return tips ? (
    <div className="deployment-content-hints">
      {tips.bold.map((item, i) => (
        <div key={i} className="deployment-content-bold">
          {item}
        </div>
      ))}
      {tips.tips.map((item, i) => (
        <div key={i} className="deployment-content-tips">
          {item()}
        </div>
      ))}
    </div>
  ) : null;
};
