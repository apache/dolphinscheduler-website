import { useEffect, useState } from 'react';
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
} from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useSearchParams, useParams } from 'react-router-dom';
import { useSearch } from './useSearch';
import './index.scss';

const Search = () => {
  const params = useParams();
  const { tabs, loading, handleSearch, handleSort } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState();

  useEffect(() => {
    if (searchParams.get('t')) {
      handleSearch(searchParams.get('t'));
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
              value={searchVal}
              defaultValue={searchParams.get('t')}
              onChange={(e) => {
                setSearchVal(e.target.value);
              }}
            />
            <Button
              className="search-btn"
              type="primary"
              shape="round"
              onClick={() => {
                handleSearch(searchVal);
                setSearchParams(`t=${searchVal}`);
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
                      { value: '0', label: 'Relevancy' },
                      { value: '1', label: 'Date' },
                    ]}
                    onSelect={(value) => {
                      handleSort(value, i);
                    }}
                    size="small"
                  />
                </Space>
                {tab.key !== 'faq' && (
                  <List
                    dataSource={tab.list}
                    renderItem={(item) => {
                      if (tab.key === 'doc') {
                        const link = `${window.location.origin}/#/${params.locale}/docs/${item.version}${item.link}`;
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
                      if (tab.key === 'blog') {
                        const link = `${window.location.origin}/#/${params.locale}/blog/${item.name}`;
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
                      if (tab.key === 'event') {
                        return (
                          <div className="search-item">
                            <div
                              dangerouslySetInnerHTML={{ __html: item.title }}
                              className="search-result-title"
                            ></div>
                          </div>
                        );
                      }
                    }}
                  />
                )}
                {tab.key === 'faq' && (
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
