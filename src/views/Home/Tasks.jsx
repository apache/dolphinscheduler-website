import { formatName } from "../../utils/formatName";
import { useTranslation } from "../../hooks/useTranslation";
import "./tasks.scss";

const TASKS = [
  "CHUNJUN",
  "CONDITIONS",
  "DATA QUALITY",
  "DATAX",
  "DEPENDENT",
  "DVC",
  "EMR",
  "FLINK STREAM",
  "HIVECLI",
  "HTTP",
  "JUPYTER",
  "K8S",
  "MLFLOW",
  "OPENMLDB",
  "PIGEON",
  "PROCEDURE",
  "PYTORCH",
  "SAGEMAKER",
  "SEATUNNEL",
  "SHELL",
  "SPARK",
  "SQL",
  "SQOOP",
  "SUB PROCESS",
  "SWITCH",
  "ZEPPELIN",
];

export const Tasks = () => {
  const splitIndex = Math.floor(TASKS.length / 2);
  const { t } = useTranslation();
  return (
    <div className="home-tasks">
      <div className="home-tasks-bg"></div>
      <div className="home-tasks-content">
        <div className="home-tasks-title">
          <div>{t("we_provide_more_than")}</div>
          <div className="home-tasks-total gradient-text">30+</div>
          <div>{t("types_of_jobs_out_of_box")}</div>
        </div>
        <div className="home-tasks-wrap">
          <div className="home-tasks-animation home-tasks-right">
            {[1, 2].map((item) => (
              <div className="home-tasks-list" key={item}>
                {TASKS.filter((item, i) => i < splitIndex).map((task, i) => (
                  <div className="home-tasks-item" key={i}>
                    <div
                      className="home-tasks-item-img"
                      style={{
                        backgroundImage: `url(./images/tasks/${formatName(
                          task
                        )}.png)`,
                      }}
                    />
                    <div className="home-tasks-item-text">{task}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="home-tasks-wrap">
          <div className="home-tasks-animation home-tasks-left">
            {[1, 2].map((item) => (
              <div className="home-tasks-list" key={item}>
                {TASKS.filter((item, i) => i >= splitIndex).map((task, i) => (
                  <div className="home-tasks-item" key={i}>
                    <div
                      className="home-tasks-item-img"
                      style={{
                        backgroundImage: `url(./images/tasks/${formatName(
                          task
                        )}.png)`,
                      }}
                    />
                    <div className="home-tasks-item-text">{task}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
