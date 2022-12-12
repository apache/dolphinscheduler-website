import { useEffect } from "react";
import { Select, Button, Image, Space, Tag, Empty } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation, useEvents } from "../../hooks";
import { formatDate, isAfter } from "../../utils/formatDate";
import "./index.scss";

const Event = () => {
  const { locale, t } = useTranslation();
  const { events, getEvents, filterEvents } = useEvents(locale);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);

  return (
    <section className="events">
      <div className="events-top">
        <div className="events-title">
          <div>DolphinScheduler</div>
          <div className="gradient-text">Events</div>
        </div>
      </div>
      <div className="events-content">
        <div className="events-search">
          <Select
            className="events-select"
            defaultValue="all"
            onChange={filterEvents}
            options={[
              { label: t("all_events"), value: "all" },
              { label: "Coming Soon", value: "coming" },
              { label: "Previous", value: "previous" },
            ]}
          />
          <Button
            type="link"
            size="small"
            href="https://apachecon.com/?ref=dolphinscheduler.apache.org#events-section"
            target="_blank"
          >
            {t("see_apache_events")}
          </Button>
        </div>
        <div className="events-list">
          {events.map((event, i) => (
            <div className="events-item" key={i}>
              <div className="events-img">
                {event.imgName ? (
                  <Image
                    src={`/img/${event.imgName}`}
                    width={500}
                    height={280}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="events-desc">
                <div className="events-name">{event.title}</div>
                {event.startTime && (
                  <div className="events-time">
                    {formatDate(event.startTime, locale)}
                    {event.endTime
                      ? ` - ${formatDate(event.endTime, locale)}`
                      : ""}
                  </div>
                )}
                {event.startTime && (
                  <div className="events-tag">
                    {isAfter(event.startTime) ? (
                      <Tag color="#7d4efc">Coming Soon</Tag>
                    ) : (
                      <Tag color="#8b8b8b">Previous</Tag>
                    )}
                  </div>
                )}

                <Space className="events-buttons" size={2}>
                  {event.startTime &&
                    isAfter(event.startTime) &&
                    event.more && (
                      <Button
                        size="large"
                        shape="round"
                        onClick={() => {
                          navigate(`/${locale}/events/${event.more}`);
                        }}
                      >
                        {t("learn_more")}
                        <ArrowRightOutlined />
                      </Button>
                    )}
                  {event.vedio_url && (
                    <Button
                      size="large"
                      shape="round"
                      type="link"
                      onClick={() => {
                        window.open(event.vedio_url, "_blank");
                      }}
                    >
                      {t("watch_now")}
                      <ArrowRightOutlined />
                    </Button>
                  )}
                  {event.post && (
                    <Button
                      size="large"
                      shape="round"
                      type="link"
                      onClick={() => {
                        navigate(`/${locale}/blog/${event.post.name}`);
                      }}
                    >
                      {t("view_post")}
                      <ArrowRightOutlined />
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          ))}
        </div>
        {!events.length && (
          <div className="events-empty">
            <Empty />
          </div>
        )}
      </div>
    </section>
  );
};

export { EventDetail } from "./Detail";
export default Event;
