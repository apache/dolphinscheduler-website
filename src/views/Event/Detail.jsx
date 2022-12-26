import { Breadcrumb, Spin, Result, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks";
import { useEventDetail } from "./useEventDetail";
import { formatDate, isAfter } from "../../utils/formatDate";
import Connect from "../../components/Connect";
import "./detail.scss";

export const EventDetail = () => {
  const { locale } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { detail, loading } = useEventDetail(locale, params.name);

  return !loading ? (
    <>
      <section className="event-detail">
        {detail.__html ? (
          <>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href={`/${locale}/events`}>Event</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{detail.title}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="event-detail-title">
              {detail.startTime && (
                <div
                  className="event-detail-tag"
                  style={{
                    backgroundColor: isAfter(detail.startTime)
                      ? "#7d4efc"
                      : "#8b8b8b",
                  }}
                >
                  {isAfter(detail.startTime) ? "Coming Soon" : "Previous"}
                </div>
              )}
              {detail.title}
            </div>
            {detail.startTime && (
              <div className="event-detail-desc">
                {formatDate(detail.startTime, locale)}
                {detail.endTime
                  ? ` - ${formatDate(detail.endTime, locale)}`
                  : ""}
              </div>
            )}

            <div
              className="event-detail-content"
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
                  navigate(`/${locale}/event`);
                }}
                shape="round"
              >
                Back Event
              </Button>
            }
          />
        )}
      </section>
      <Connect />
    </>
  ) : (
    <div className="ds-spin">
      <Spin size="large" />
    </div>
  );
};
