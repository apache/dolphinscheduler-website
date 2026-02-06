import { useState, useEffect, useRef } from "react";
import { Button, Divider, Space, Carousel, Image } from "antd";
import { PlayCircleOutlined, GithubOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks";
import { GITHUB_LINK } from "../../config";

export const Main = ({ star, fork }) => {
  const { t, locale } = useTranslation();
  const [time, setTime] = useState(7000);
  const navigate = useNavigate();
  const timerRef = useRef();
  const carouselRef = useRef();

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      carouselRef.current.next();
    }, time);
    return () => {
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [time]);

  return (
    <div className="home-desc">
      <div className="home-desc-text">
        <h1 className="home-desc-title">
          <div>Agile to Create</div>
          <div className="gradient-text">High-Performance Workflow</div>
          <div>With Low-Code</div>
        </h1>
        <div className="home-desc-subtitle">{t("desc")}</div>
        <div className="home-desc-buttons">
          <Space wrap size={[12, 12]}>
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => {
                navigate(`/${locale}/download`);
              }}
            >
              {t("download")}
            </Button>
            <Button
              icon={<PlayCircleOutlined />}
              shape="round"
              size="large"
              onClick={() => {
                window.open(
                  "https://www.youtube.com/watch?v=RV62U2mMEx4",
                  "_blank"
                );
              }}
            >
              {t("what")}
            </Button>
          </Space>
        </div>
        <div className="home-github-buttons">
          <Space>
            <Button
              className="github-button"
              shape="round"
              size="medium"
              onClick={() => {
                window.open(GITHUB_LINK, "_blank");
              }}
            >
              <div className="github-button-left">
                <GithubOutlined />
              </div>
              <div className="github-button-right">
                <span>Star {star ? star.toLocaleString("en-us") : "-"}</span>
                <Divider type="vertical" />
                <span>Fork {fork ? fork.toLocaleString("en-us") : "-"}</span>
              </div>
            </Button>
          </Space>
        </div>
      </div>
      <Carousel
        ref={carouselRef}
        dots={{ className: "home-why-dots" }}
        effect="fade"
        afterChange={() => {
          setTime(30000);
        }}
        className="home-main-carousel"
      >
        <Image src="/images/home/home-1-1.png" preview={false} />
        <Image src="/images/home/home-1-2.png" preview={false} />
        <Image src="/images/home/home-1-3.png" preview={false} />
        <Image src="/images/home/home-1-4.png" preview={false} />
      </Carousel>
    </div>
  );
};
