import { useEffect, useRef } from "react";
import {
  Input,
  Space,
  Button,
  Tabs,
  Select,
  List,
  Typography,
  Spin,
  Collapse,
  Tag,
} from "antd";
import { useTranslation } from "../../hooks";
import { CaretRightOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useSearch } from "./useSearch";
import { formatTimestamp, isAfter } from "../../utils/formatDate";
import "./index.scss";

const Search = () => {
  const params = useParams();
  const { tabs, loading, handleSearch, handleSort } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchRef = useRef(searchParams.get("t"));
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (searchParams.get("t")) {
      handleSearch(searchParams.get("t"));
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Spin spinning={loading}>
      <section className="search">
        <div className="search-top">
          <div className="search-title">Search</div>
          <Space size={20}>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              defaultValue={searchParams.get("t")}
            />
            <Button
              className="search-btn"
              type="primary"
              shape="round"
              onClick={() => {
                const searchValue = searchRef.current.input.value;
                handleSearch(searchValue);
                setSearchParams(`t=${searchValue}`);
              }}
            >
              Search
            </Button>
          </Space>
        </div>
        <Tabs
          className="search-content"
          defaultActiveKey="doc"
          items={tabs.map((tab, i) => ({
            label: tab.label,
            key: tab.key,
            children: (
              <>
                <Space className="search-sort">
                  <div>Sorted by</div>
                  <Select
                    value={tab.sort}
                    style={{ width: 110 }}
                    options={[
                      { value: "0", label: "Relevancy" },
                      { value: "1", label: "Date" },
                    ]}
                    onSelect={(value) => {
                      handleSort(value, i);
                    }}
                    size="small"
                  />
                </Space>
                {tab.key !== "faq" && (
                  <List
                    dataSource={tab.list}
                    renderItem={(item) => {
                      if (tab.key === "doc") {
                        const link = `${window.location.origin}/${params.locale}/docs/${item.version}${item.link}`;
                        return (
                          <div className="search-item">
                            <div
                              dangerouslySetInnerHTML={{ __html: item.title }}
                              className="search-result-title"
                            ></div>
                            <Typography.Link href={link}>
                              {link}
                            </Typography.Link>
                            <div
                              dangerouslySetInnerHTML={{ __html: item.desc }}
                              className="search-snapshoot"
                            ></div>
                          </div>
                        );
                      }
                      if (tab.key === "blog") {
                        const link = `${window.location.origin}/${params.locale}/blog/${item.name}`;
                        return (
                          <div className="search-item">
                            <div
                              dangerouslySetInnerHTML={{ __html: item.title }}
                              className="search-result-title"
                            ></div>
                            <Typography.Link href={link}>
                              {link}
                            </Typography.Link>
                            <div
                              dangerouslySetInnerHTML={{ __html: item.desc }}
                              className="search-snapshoot"
                            ></div>
                          </div>
                        );
                      }
                      if (tab.key === "event") {
                        return (
                          <div className="events-desc">
                            <div
                              dangerouslySetInnerHTML={{ __html: item.title }}
                              className="search-result-title"
                            ></div>
                            {item.time && (
                              <div className="events-time">
                                {formatTimestamp(item.time, params.locale)}
                              </div>
                            )}
                            {item.time && (
                              <div className="events-tag">
                                {isAfter(item.time) ? (
                                  <Tag color="#7d4efc">Coming Soon</Tag>
                                ) : (
                                  <Tag color="#8b8b8b">Previous</Tag>
                                )}
                              </div>
                            )}

                            <Space className="events-buttons" size={2}>
                              {item.time && isAfter(item.time) && item.more && (
                                <Button
                                  size="large"
                                  shape="round"
                                  onClick={() => {
                                    navigate(
                                      `/${params.locale}/events/${item.more}`
                                    );
                                  }}
                                >
                                  {t("learn_more")}
                                  <ArrowRightOutlined />
                                </Button>
                              )}
                              {item.vedio_url && (
                                <Button
                                  size="large"
                                  shape="round"
                                  type="link"
                                  onClick={() => {
                                    window.open(item.vedio_url, "_blank");
                                  }}
                                >
                                  {t("watch_now")}
                                  <ArrowRightOutlined />
                                </Button>
                              )}
                              {item.post && (
                                <Button
                                  size="large"
                                  shape="round"
                                  type="link"
                                  onClick={() => {
                                    navigate(
                                      `/${params.locale}/blog/${item.post}`
                                    );
                                  }}
                                >
                                  {t("view_post")}
                                  <ArrowRightOutlined />
                                </Button>
                              )}
                            </Space>
                          </div>
                        );
                      }
                    }}
                  />
                )}
                {tab.key === "faq" && (
                  <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    {tab.list.map((faq, i) => (
                      <Collapse.Panel
                        key={i}
                        header={
                          <div dangerouslySetInnerHTML={{ __html: faq.q }} />
                        }
                        className="support-faq-panel"
                      >
                        <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                      </Collapse.Panel>
                    ))}
                  </Collapse>
                )}
              </>
            ),
          }))}
          animated
        />
      </section>
    </Spin>
  );
};

export default Search;
