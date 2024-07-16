import { memo, useState, useEffect } from "react";
import { Modal, Input, Button, Breadcrumb, Empty, Spin } from "antd";
import { useParams } from "react-router-dom";
import { getSearchItemLinkFromLocation } from "./helpers";

const SearchModal = ({ open, list, value, onClose, loading, handleSearch }) => {
  const params = useParams();
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      className="documentation-search"
      onCancel={onClose}
      width="50vw"
    >
      <div className="documentation-search-top">
        <Input
          className="documentation-content-input"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <Button
          type="primary"
          shape="round"
          onClick={() => {
            handleSearch(searchValue);
          }}
          loading={loading}
        >
          Search
        </Button>
      </div>
      <Spin spinning={loading}>
        <div className="documentation-search-total">{list.length} Results</div>
        <div className="documentation-search-list">
          {list.map((item, i) => (
            <div
              className="documentation-search-item"
              key={i}
              onClick={() => {
                onClose();
              }}
            >
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a href={`/${params.locale}/docs/${params.version}`}>
                    Version {params.version}
                  </a>
                </Breadcrumb.Item>
                {item.location &&
                  item.location.map((slip, i) => (
                    <Breadcrumb.Item key={i}>
                      <a
                        href={`/${params.locale}/docs/${
                          params.version
                        }${getSearchItemLinkFromLocation(item, i)}`}
                      >
                        {slip}
                      </a>
                    </Breadcrumb.Item>
                  ))}
              </Breadcrumb>
              <div
                dangerouslySetInnerHTML={{ __html: item.title }}
                className="search-result-title"
              ></div>
              <div
                dangerouslySetInnerHTML={{ __html: item.desc }}
                className="search-snapshoot"
              ></div>
            </div>
          ))}
          {!list.length && <Empty />}
        </div>
      </Spin>
    </Modal>
  );
};

export default memo(SearchModal);
