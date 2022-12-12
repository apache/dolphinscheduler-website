import { Breadcrumb, Spin, Result, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks";
import { useBlogDetail } from "./useBlogDetail";
import { COLORS } from ".";
import "./detail.scss";

export const BlogDetail = () => {
  const { locale } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { detail, loading } = useBlogDetail(locale, params.name);

  return !loading ? (
    <section className="blog-detail">
      {detail.__html ? (
        <>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href={`#/${locale}/blog`}>Blog</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{detail.title}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="blog-detail-title">
            <div
              className="blog-detail-tag"
              style={{
                backgroundColor: COLORS[detail.type] || "rgb(59, 89, 153)",
              }}
            >
              {detail.label}
            </div>
            <span>{detail.title}</span>
          </div>
          <div className="blog-detail-desc">
            <div className="blog-detail-author">{detail.author}</div>
            <div className="blog-detail-time">{detail.time}</div>
          </div>
          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: detail.__html }}
          ></div>
        </>
      ) : (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button
              type="primary"
              onClick={() => {
                navigate(`/${locale}/blog`);
              }}
              shape="round"
            >
              Back Blog
            </Button>
          }
        />
      )}
    </section>
  ) : (
    <div className="ds-spin">
      <Spin size="large" />
    </div>
  );
};
