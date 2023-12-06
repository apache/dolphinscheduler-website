import { useState } from "react";
import { Button, List, Skeleton, Avatar } from "antd";
import {
  GithubOutlined,
  SlackOutlined,
  TwitterOutlined,
  MailFilled,
} from "@ant-design/icons";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { SLACK_LINK, GITHUB_LINK, TWITTER_LINK, EMAIL } from "../../config";
import { useTranslation } from "../../hooks";
import "./index.scss";

const subs = [
  {
    label: "report_security_issue",
    key: "security",
  },
  {
    label: "code_of_conduct",
    key: "code-conduct",
  },
  {
    label: "review_issue_or_pull_requests",
    key: "review",
  },
  {
    label: "e2e_test_contribution_guide",
    key: "e2e-guide",
  },
  {
    label: "submit_code",
    key: "submit-code",
  },
  {
    label: "license_notice",
    key: "DS-License",
  },
  {
    label: "documentation_notice",
    key: "document",
  },
  {
    label: "issue_notice",
    key: "issue",
  },
  {
    label: "pull_request_notice",
    key: "pull-request",
  },
  {
    label: "commit_message_notice",
    key: "commit-message",
  },
  {
    label: "micro_benchMark_notice",
    key: "microbench",
  },
  {
    label: "unit_test_writing",
    key: "unit-test",
  },
];

const PMCMembers = [
  {githubId: 'William-GuoWei',	publicName: 'Guo William'},
  {githubId: 'davidzollo',	publicName: 'Lidong Dai', image: 'lidong'},
  {githubId: 'CalvinKirs',	publicName: 'Calvin Kirs'},
  {githubId: 'zhongjiajie',	publicName: 'Jiajie Zhong', image: 'zhongjiajie'},
  {githubId: 'kamaci',	publicName: 'Furkan Kamaci'},
  {githubId: 'gaojun2048',	publicName: 'EricJoy2048	Jun Gao', image: 'gaojun'},
  {githubId: 'lgcareer',	publicName: 'Gang Li'},
  {githubId: 'caishunfeng',	publicName: 'ShunFeng Cai', image: 'caishunfeng'},
  {githubId: 'ruanwenjun',	publicName: 'Wenjun Ruan', image: 'wenjun'},
  {githubId: 'lenboo',	publicName: 'Leon Bao', image: 'leonbao'},
  {githubId: 'Technoboy-',	publicName: 'Guo Jiwei'},
  {githubId: 'wu-sheng',	publicName: 'Sheng Wu'},
  {githubId: 'calvinjiang',	publicName: 'Hua Jiang'},
  {githubId: 'songjianet',	publicName: 'Jian Song'},
  {githubId: 'zhuangchong',	publicName: 'Chong Zhuang'},
  {githubId: 'JinyLeeChina',	publicName: 'JinyLeeChina'},
  {githubId: 'djkevincr',	publicName: 'Kevin Ratnasekera'},
  {githubId: 'EricGao888',	publicName: 'Chufeng Gao'},
  {githubId: 'chenliang613',	publicName: 'Liang Chen'},
  {githubId: 'qiaozhanwei',	publicName: 'Qiao Zhanwei'},
  {githubId: 'shaofengshi',	publicName: 'Shao Feng Shi'},
  {githubId: 'Baoqi',	publicName: 'Wu Baoqi'},
  {githubId: 'khadgarmage',	publicName: 'Xiaochun Liu'},
  {githubId: 'kezhenxu94',	publicName: 'Zhenxu Ke'},
  {githubId: 'SbloodyS',	publicName: 'Zihao Xiang'},
  {githubId: 'millionfor',	publicName: 'ZijJian Gong'},
]

const committerMembers = [
{githubId: 'nielifeng', publicName: 'Lifeng Nie', image: 'lifeng'},
{githubId: 'Amy0104', publicName: 'Amy Wang'},
{githubId: 'break60', publicName: 'Caibiao Xiang'},
{githubId: 'yifei', publicName: 'Yifei Chen', image: 'yifei'},
{githubId: 'chongchongzi', publicName: 'Cong Huang'},
{githubId: 'devosend', publicName: 'Dongkai Liu', image: 'dongkai'},
{githubId: 'liuli', publicName: 'Li Liu', image: 'liuli'},
{githubId: 'wen-hemin', publicName: 'Hemin Wen'},
{githubId: 'Niko-Zeng', publicName: 'Hui Zeng', image: 'zenghui'},
{githubId: 'jieguangzhou', publicName: 'Jieguang Zhou'},
{githubId: 'WangJPLeo', publicName: 'Jipeng Wang'},
{githubId: 'labbomb', publicName: 'JunJie Xu'},
{githubId: 'nauu', publicName: 'Kai Zhu'},
{githubId: 'Jave-Chen', publicName: 'Kejia Chen'},
{githubId: 'Eights-Li', publicName: 'Li Huang'},
{githubId: 'samz406', publicName: 'Lin Li'},
{githubId: 'qingwli', publicName: 'Qingwang Li'},
{githubId: 'clay4444', publicName: 'Shang Lou'},
{githubId: 'gabrywu', publicName: 'Shaojie Wu'},
{githubId: 'chengshiwen', publicName: 'Shiwen Cheng'},
{githubId: 'Tianqi-Dotes', publicName: 'Tianqi Yan'},
{githubId: 'wangxj3', publicName: 'Wang Xingjie'},
{githubId: 'liwenhe1993', publicName: 'Wenhe Li'},
{githubId: 'xingchun-chen', publicName: 'Xingchun Chen'},
{githubId: 'yangyichao-mango', publicName: 'Yichao Yang'},
{githubId: 'Wangyizhi1', publicName: 'Yizhi Wang'},
{githubId: 'BoYiZhang', publicName: 'BoYi Zhang'},
{githubId: 'zixi0825', publicName: 'Zhaohe Sun'},
{githubId: 'lfyee', publicName: 'Zongyao Zhang'}]

const Community = () => {
  const params = useParams();
  const { t } = useTranslation();
  const [PMCLoading, setPMCLoading] = useState(false);
  const [committerLoading, setcommitterLoading] = useState(false);
  const loadMore =
    !PMCLoading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => setPMCLoading(true)}
        >
          {t("show_more")}
        </Button>
      </div>
    ) : null;

  const loadCommitterMore =
    !committerLoading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={() => setcommitterLoading(true)}
        >
          {t("show_more")}
        </Button>
      </div>
    ) : null;

  return (
    <section className="community">
      <div className="community-top">
        <div className="community-title">
          <div>DolphinScheduler</div>
          <div className="gradient-text">Community</div>
        </div>
        <div className="community-top-bg"></div>
      </div>
      <div className="community-content">
        <div className="community-contacts">
          <div className="community-contact">
            <div className="community-contact-icon">
              <GithubOutlined />
            </div>
            <div className="community-contact-desc">
              {t("participate_on_gitHub")}
            </div>
            <Button
              type="primary"
              shape="round"
              size="large"
              ghost
              onClick={() => {
                window.open(GITHUB_LINK, "_blank");
              }}
            >
              {t("view_on_github")}
            </Button>
          </div>
          <div className="community-contact">
            <div className="community-contact-icon">
              <SlackOutlined />
            </div>
            <div className="community-contact-desc">{t("chat_slack")}</div>
            <Button
              type="primary"
              shape="round"
              size="large"
              ghost
              onClick={() => {
                window.open(SLACK_LINK, "_blank");
              }}
            >
              {t("join_slack")}
            </Button>
          </div>
          <div className="community-contact">
            <div className="community-contact-icon">
              <TwitterOutlined />
            </div>
            <div className="community-contact-desc">{t("twitter_tips")}</div>
            <Button
              type="primary"
              shape="round"
              size="large"
              ghost
              onClick={() => {
                window.open(TWITTER_LINK, "_blank");
              }}
            >
              {t("follow_twitter")}
            </Button>
          </div>
          <div className="community-contact">
            <div className="community-contact-icon">
              <MailFilled />
            </div>
            <div className="community-contact-mail-desc">
              <span>{t("support_email")}</span>
              <a
                href={`mailto:${EMAIL}`}
                target="_blank"
                rel="noreferrer"
                className="community-contact-mail-link"
              >
                users-subscribe@dolphinscheduler.apache.org
              </a>{" "}
              <span>{t("email_tips")}</span>
            </div>
          </div>
        </div>
        <div className="community-contribute">
          <div className="community-contribute-title">
            {t("contribute_to_dolphinScheduler")}
          </div>
          <div className="community-contribute-desc">
            {t("contribute_tips")}
            <Button
              type="link"
              href="https://github.com/apache/dolphinscheduler/blob/dev/docs/docs/en/contribute/join/contribute.md"
              target="_blank"
            >
              {t("participate_in_contributing")}
              <ArrowRightOutlined />
            </Button>
          </div>
          <div className="community-contribute-list">
            {subs.map((sub) => (
              <div className="community-contribute-item" key={sub.key}>
                <div className="community-contribute-item-title">
                  {t(sub.label)}
                </div>
                <Button
                  type="link"
                  href={`https://github.com/apache/dolphinscheduler/blob/dev/docs/docs/en/contribute/join/${sub.key}.md`}
                  target="_blank"
                >
                  {t("read_guides")}
                  <ArrowRightOutlined />
                </Button>
              </div>
            ))}
          </div>
        </div>
        {params.locale === 'zh-cn' && <div className="community-team">
          <div className="community-team-title">
            团队
          </div>
          <div className="community-team-desc">
            PMC
          </div>
          <div className="community-team-list">
            <List
              className="demo-loadmore-list"
              loadMore={loadMore}
              grid={{ gutter: 16, column: 5 }}
              dataSource={PMCLoading ? PMCMembers : PMCMembers.slice(0, 10)}
              renderItem={(item) => (
                <List.Item
                >
                  <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image ? `/images/contributor/${item.image}.jpeg` : `https://www.github.com/${item.githubId}.png`} size={64} />}
                      title={item.publicName}
                    />
                  </Skeleton>
                </List.Item>
              )}/>
          </div>
          <div className="community-team-desc">
            Committer
          </div>
          <div className="community-team-list">
            <List
              className="demo-loadmore-list"
              loadMore={loadCommitterMore}
              grid={{ gutter: 16, column: 5 }}
              dataSource={committerLoading ? committerMembers : committerMembers.slice(0, 10)}
              renderItem={(item) => (
                <List.Item
                >
                  <Skeleton avatar title={false} loading={false} active>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image ? `/images/contributor/${item.image}.jpeg` : `https://www.github.com/${item.githubId}.png`} size={64} />}
                      title={item.publicName}
                    />
                  </Skeleton>
                </List.Item>
              )}/>
          </div>
        </div>}
      </div>
      <div className="community-committer">
        <div className="community-committer-title">
          {t("becoming_a_committer")}
        </div>
        <div className="community-committer-desc">
          <p className="community-committer-p">
            {t("committer_p")}
            <Button
              type="link"
              href={
                "https://github.com/apache/dolphinscheduler/blob/dev/docs/docs/en/contribute/join/become-a-committer.md"
              }
              target="_blank"
            >
              {t("read_guides")}
            </Button>
          </p>
          <p className="community-committer-p">
            {t("committer_process")}{" "}
            <Button
              type="link"
              href={"https://community.apache.org/newcommitter.html"}
              target="_blank"
            >
              {t("read_community_process")}
            </Button>
          </p>
          <ul className="community-committer-list">
            <li className="community-committer-item">{t("commiter_tips1")}</li>
            <li className="community-committer-item">{t("commiter_tips2")}</li>
            <li className="community-committer-item">{t("commiter_tips3")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Community;
