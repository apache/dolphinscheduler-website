import { useState, useRef } from "react";
import {
  Select,
  Button,
  Tree,
  Input,
  Breadcrumb,
  Typography,
  Space,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { Outlet, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "../../hooks";
import { useDocumentation } from "./useDocumentation";
import { getLinkFromLocation } from "./helpers";
import SearchModal from "./SearchModal";
import { useSearch } from "./useSearch";
import "./index.scss";

export { DocumentationDetail } from "./Detail";

const Documentation = () => {
  const params = useParams();
  const [expandedKeys, setExpandedKeys] = useState(["/" + params["*"]]);
  const { locale, t } = useTranslation();
  const {
    showModal,
    setShowModal,
    searchList,
    searchValue,
    handleSearch,
    loading,
  } = useSearch(params.version);
  const {
    menu,
    menuLoading,
    versions,
    structures,
    currentAnchor,
    child,
    setChild,
    handleAnchor,
    navigate,
  } = useDocumentation(params);
  let downloadButtonIsDisabled = false;
  const searchRef = useRef();

  if (!versions.includes(params.version)) {
    return <Navigate to={`/${locale}/docs/${versions[0]}`} replace={true} />;
  }
  if (params.version === "dev") {
    downloadButtonIsDisabled = true;
  }
  return (
    <section className="documentation" id="documentation">
      <div className="documentation-sider">
        <div className="documentation-sider-title">{t("select_version")}</div>
        <Select
          className="documentation-sider-select"
          defaultValue={params.version}
          options={versions.map((version) => ({
            label: version,
            value: version,
          }))}
          onChange={(value) => {
            navigate(`/${locale}/docs/${value}`);
          }}
          showSearch
        />
        <Button
          className="documentation-sider-download"
          type="primary"
          shape="round"
          ghost
          size="large"
          disabled={downloadButtonIsDisabled}
          onClick={() => {
            navigate(`/${locale}/download/${params.version}`);
          }}
        >
          {t("download")} {params.version}
          <LinkOutlined />
        </Button>
        <div className="documentation-sider-content">
          <div className="documentation-sider-content-title">
            {t("content")}
          </div>
          {!menuLoading && (
            <Tree
              className="documentation-sider-content-tree"
              treeData={menu}
              defaultSelectedKeys={["/" + params["*"]]}
              onSelect={(keys, { node }) => {
                setChild(node.children.length === 0 ? null : node);
                navigate(`/${params.locale}/docs/${params.version}${node.key}`);
                document.getElementById("ds-scroll-content").scrollTop = 0;
                const parentKeys = [];
                for (let i = 0, len = node.location.length; i < len - 1; i++) {
                  parentKeys.push(getLinkFromLocation(node.location, i));
                }
                setExpandedKeys(parentKeys);
              }}
              expandedKeys={expandedKeys}
              onExpand={(keys) => {
                setExpandedKeys(keys);
              }}
            />
          )}
        </div>
      </div>
      <div className="documentation-content">
        <div className="documentation-content-search">
          <Input className="documentation-content-input" ref={searchRef} />
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              handleSearch(searchRef.current.input.value);
              setShowModal(true);
            }}
          >
            {t("search")}
          </Button>
        </div>
        <Space className="documentation-content-version">
          <Select
            className="documentation-sider-select"
            defaultValue={params.version}
            options={versions.map((version) => ({
              label: version,
              value: version,
            }))}
            onChange={(value) => {
              navigate(`/${locale}/docs/${value}`);
            }}
          />
          <Button
            type="primary"
            shape="round"
            ghost
            size="medium"
            onClick={() => {
              navigate(`/${locale}/download/${params.version}`);
            }}
          >
            {t("download")} {params.version}
            <LinkOutlined />
          </Button>
        </Space>
        {!!child ? (
          <>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href={`/${params.locale}/docs/${params.version}`}>
                  Version {params.version}
                </a>
              </Breadcrumb.Item>
              {child.location &&
                child.location.map((item, i) => (
                  <Breadcrumb.Item key={i}>
                    <a
                      href={`/${params.locale}/docs/${
                        params.version
                      }${getLinkFromLocation(child.location, i)}`}
                    >
                      {item}
                    </a>
                  </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            {child.title && (
              <div className="documentation-detail-title">{child.title}</div>
            )}
            <List
              list={child.children}
              onClick={(link) => {
                navigate(`/${params.locale}/docs/${params.version}${link}`);
                setChild(null);
              }}
            />
          </>
        ) : (
          <Outlet />
        )}
      </div>
      <div className="documentation-structure">
        <div className="documentation-structure-content">
          <div className="documentation-structure-title">
            {t("introduction")}
          </div>
          {structures?.map((item, i) => (
            <Button
              key={i}
              type="link"
              className={`${item.anchor === currentAnchor ? "active" : ""}`}
              onClick={() => {
                handleAnchor(item.anchor);
              }}
            >
              {item.title}
            </Button>
          ))}
        </div>
      </div>
      <SearchModal
        open={showModal}
        list={searchList}
        value={searchValue}
        loading={loading}
        onClose={() => {
          setShowModal(false);
        }}
        handleSearch={handleSearch}
      />
    </section>
  );
};

const List = ({ list, onClick }) => {
  return (
    <ul>
      {list.map((item, i) => (
        <li key={i} className="documentation-detail-link">
          <Typography.Link onClick={() => void onClick(item.key)}>
            {item.title}
          </Typography.Link>
          {item.children && <List list={item.children} onClick={onClick} />}
        </li>
      ))}
    </ul>
  );
};

export default Documentation;
