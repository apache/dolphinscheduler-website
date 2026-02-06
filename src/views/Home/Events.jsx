import { useEffect } from "react";
import { Button, Typography, Image } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation, useEvents } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import "./events.scss";

export const Events = () => {
  const { locale, t } = useTranslation();
  const navigate = useNavigate();
  const { getEvents, homeEvents } = useEvents(locale);
  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="home-events">
      {homeEvents.map(
        (event, i) =>
          event && (
            <div className="home-events-item" key={i}>
              <div className="home-events-item-img">
                {event.imgName ? (
                  <Image
                    src={`/img/${event.imgName}`}
                    preview={false}
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="home-events-item-detail">
                <div className="home-events-item-title">
                  <div>{i === 0 ? "Upcoming" : "Latest"}</div>
                  <div className="gradient-text">
                    {i === 0 ? "Events" : "Post"}
                  </div>
                </div>
                {event.startTime && i === 0 && (
                  <div className="home-events-item-time">
                    {formatDate(event.startTime, locale)}
                  </div>
                )}
                <Typography.Paragraph
                  className="home-events-item-text"
                  ellipsis={{ rows: 4 }}
                >
                  {event.desc}
                </Typography.Paragraph>
                <div className="home-events-item-btn">
                  <Button
                    size="large"
                    shape="round"
                    onClick={() => {
                      if (i === 0) {
                        navigate(`/${locale}/events/${event.more}`);
                        return;
                      }
                      if (i === 1) {
                        navigate(`/${locale}/blog/${event.post.name}`);
                        return;
                      }
                    }}
                  >
                    {t("learn_more")}
                    <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};
