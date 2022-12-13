import { Result, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";

const NotFound = () => {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate(`/${params.locale || "en-us"}`);
          }}
          shape="round"
        >
          Back Home
        </Button>
      }
    />
  );
};

export default NotFound;
