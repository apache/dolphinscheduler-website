import { Breadcrumb, Spin, Empty, Space, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentationDetail } from './useDocumentationDetail';
import { useTranslation } from '../../hooks';
import { formatDate } from '../../utils/formatDate';
import { getLinkFromLocation } from './helpers';
import './detail.scss';

export const DocumentationDetail = () => {
  const params = useParams();
  const { detail, detailLoading } = useDocumentationDetail(params);
  const navigate = useNavigate();
  const { locale, t } = useTranslation();
  return !detailLoading ? (
    <section className="documentation-detail" id="documentation-detail">
      {detail.__html ? (
        <>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href={`#/${params.locale}/docs/${params.version}`}>
                Version {params.version}
              </a>
            </Breadcrumb.Item>
            {detail.location &&
              detail.location.map((item, i) => (
                <Breadcrumb.Item key={i}>
                  {i < detail.location.length - 1 ? (
                    <a
                      href={`#/${params.locale}/docs/${
                        params.version
                      }${getLinkFromLocation(detail.location, i)}`}
                    >
                      {item}
                    </a>
                  ) : (
                    item
                  )}
                </Breadcrumb.Item>
              ))}
          </Breadcrumb>
          <div className="documentation-detail-title">{detail.title}</div>
          <div className="documentation-detail-desc">
            <Space className="documentation-detail-time">
              <span>{t('last_updated')}</span>
              <span>{formatDate(detail.time, locale)}</span>
            </Space>
            <Space className="documentation-detail-support">
              <span>{t('not_helpful')}</span>
              <Button
                type="link"
                onClick={() => {
                  navigate(`/${params.locale}/support`);
                }}
              >
                {t('get_support')} <LinkOutlined />
              </Button>
            </Space>
          </div>
          <div
            className="documentation-detail-content"
            dangerouslySetInnerHTML={{ __html: detail.__html }}
          ></div>
        </>
      ) : (
        <Empty />
      )}
    </section>
  ) : (
    <div className="ds-spin">
      <Spin size="large" />
    </div>
  );
};
