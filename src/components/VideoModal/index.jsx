import { memo, useEffect, useState } from "react";
import { Modal } from "antd";
import ReactPlayer from "react-player";

const VideoModal = ({ show, onClose, url }) => {
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (show) setPlaying(true);
  }, [show]);
  return (
    <Modal
      open={show}
      title={null}
      footer={null}
      width="80vw"
      className="home-video-modal"
      onCancel={() => {
        setPlaying(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }}
      bodyStyle={{ padding: 0 }}
    >
      <ReactPlayer
        url={url}
        playing={playing}
        controls
        width="80vw"
        height="44.6vw"
        onPause={() => {
          setPlaying(false);
        }}
        onPlay={() => {
          setPlaying(true);
        }}
        onEnablePIP={() => {
          onClose();
        }}
        onDisablePIP={() => {
          setPlaying(false);
        }}
      />
    </Modal>
  );
};

export default memo(VideoModal);
