import { Button, Checkbox, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { useBlog } from "./useBlog";
import "./index.scss";

export { BlogDetail } from "./Detail";

export const COLORS = {
  events: "#1bb411",
  release: "#e01b5d",
  trends: "#52c41a",
  tech: "#0097e0",
  user: "#eca924",
  tutorial: "#972ddf",
};

const Blog = () => {
  const { locale, t } = useTranslation();
  const { blogs, categorys, loading, checked, onCheckboxChange, onClear } =
    useBlog(locale);
  const navigate = useNavigate();

  return (
    <section className="blog">
      <div className="blog-top">
        <div className="blog-top-text">
          <div className="blog-title">{t("blog")}</div>
          <div className="blog-subtitle">{t("blog_subtitle")}</div>
        </div>
        <div className="blog-top-bg"></div>
      </div>
      <div className="blog-content">
        <div className="blog-filter">
          <div className="blog-filter-title">{t("filter")}</div>
          <div className="blog-filter-clear">
            <Button type="link" onClick={onClear}>
              {t("clear_all")}
            </Button>
          </div>
          <div className="blog-filter-content">
            {categorys.map((category, i) => (
              <div className="blog-filter-category" key={i}>
                <div className="blog-filter-category-title">
                  {category.label}
                </div>
                {category.children.map((item, i) => (
                  <div className="blog-filter-category-item" key={i}>
                    <Checkbox
                      checked={checked.includes(item.value)}
                      onChange={(e) => void onCheckboxChange(e, item.value)}
                    >
                      {item.label}
                    </Checkbox>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="blog-result">
          <Spin spinning={loading}>
            <div className="blog-result-number">
              {blogs.length} {t("results")}
            </div>
            <div className="blog-list">
              {blogs.map((blog, i) => (
                <div
                  className="blog-item"
                  key={i}
                  onClick={() => {
                    if (!blog.link) {
                      navigate(`/${locale}/blog/${blog.name}`);
                    } else {
                      window.open(blog.link, "_blank");
                    }
                  }}
                >
                  <div
                    className="blog-item-tag"
                    style={{
                      backgroundColor: COLORS[blog.type] || "rgb(59, 89, 153)",
                    }}
                  >
                    {blog.typeLabel}
                  </div>
                  <Typography.Paragraph
                    ellipsis={{ rows: 3 }}
                    className="blog-item-title"
                  >
                    {blog.title}
                  </Typography.Paragraph>
                  <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                    className="blog-item-desc"
                  >
                    {blog.desc}
                  </Typography.Paragraph>
                  <div className="blog-item-footer">
                    <div className="blog-item-author">{blog.author}</div>
                    <div className="blog-item-time">{blog.dateStr}</div>
                  </div>
                </div>
              ))}
            </div>
          </Spin>
        </div>
      </div>
    </section>
  );
};

export default Blog;
