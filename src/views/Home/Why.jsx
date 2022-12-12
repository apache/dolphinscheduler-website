import { useState, useEffect, useRef } from 'react';
import { Carousel, Space, Button, Image } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation, useVersions } from '../../hooks';
import VideoModal from '../../components/VideoModal';
import './why.scss';

export const Why = () => {
  const { locale, t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState(7000);
  const navigate = useNavigate();
  const timerRef = useRef();
  const carouselRef = useRef();
  const { currentVersion } = useVersions();

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
    <div className="home-why">
      <div className="home-why-title">
        <div>Why</div>
        <div className="gradient-text">DolphinScheduler</div>
      </div>
      <Carousel
        ref={carouselRef}
        className="home-why-content"
        dots={{ className: 'home-why-dots' }}
        afterChange={() => {
          setTime(30000);
        }}
      >
        {ITEMS.map((item, index) => (
          <div className="home-why-item" key={index}>
            <div className="home-why-item-desc">
              <div className="home-why-item-title">{t(item.title)}</div>
              <ul className="home-why-item-slip">
                {item.subs.map((sub, j) => (
                  <li className="home-why-item-text" key={j}>
                    {t(sub.text)}
                  </li>
                ))}
              </ul>
              <Space size={28}>
                <Button
                  type="primary"
                  shape="round"
                  size={window.innerWidth > 640 ? 'large' : 'medium'}
                  onClick={() => {
                    navigate(`/${locale}/docs/${currentVersion}`);
                  }}
                >
                  {t('read_the_documentation')}
                </Button>
                <Button
                  icon={<PlayCircleOutlined />}
                  shape="round"
                  size={window.innerWidth > 640 ? 'large' : 'medium'}
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  {t('quick_start')}
                </Button>
              </Space>
            </div>
            <Image src={item.img} preview={false} />
          </div>
        ))}
      </Carousel>
      <VideoModal
        url="https://www.youtube.com/embed/0B9qzn3eMGc"
        show={showModal}
        onClose={() => void setShowModal(false)}
      />
    </div>
  );
};

const ITEMS = [
  {
    title: 'why_1_title',
    img: '/images/home/home-3-1.png',
    subs: [
      {
        text: 'why_1_tips1',
      },
      {
        text: 'why_1_tips2',
      },
      {
        text: 'why_1_tips3',
      },
    ],
  },
  {
    title: 'why_2_title',
    img: '/images/home/home-3-2.png',
    subs: [
      {
        text: 'why_2_tips1',
      },
      {
        text: 'why_2_tips2',
      },
      {
        text: 'why_2_tips3',
      },
    ],
  },
  {
    title: 'why_3_title',
    img: '/images/home/home-3-3.png',
    subs: [
      {
        text: 'why_3_tips1',
      },
      {
        text: 'why_3_tips2',
      },
      {
        text: 'why_3_tips3',
      },
    ],
  },
  {
    title: 'why_4_title',
    img: '/images/home/home-3-4.png',
    subs: [
      {
        text: 'why_4_tips1',
      },
      {
        text: 'why_4_tips2',
      },
      {
        text: 'why_4_tips3',
      },
      {
        text: 'why_4_tips4',
      },
    ],
  },
];
