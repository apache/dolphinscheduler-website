import { ConfigProvider, FloatButton } from "antd";
import { useParams, Navigate, Outlet } from "react-router-dom";
import { NavBar, Footer } from "../../components";
import { getLanguageCodeFromLS } from "../../utils/getLanguageCodeFromLS";
import { LocaleContext } from "../../LocaleContext";
import { useTitle } from "./useTitle";
import "./index.scss";

const Content = () => {
  useTitle();

  return (
    <section className="ds-content">
      <Outlet />
    </section>
  );
};

const Layout = () => {
  const params = useParams();
  if (params.locale && ["en-us", "zh-cn"].includes(params.locale)) {
    const locales = JSON.parse(sessionStorage.getItem("locales")) || {};

    return (
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorActiveBarHeight: 0,
              colorSubItemBg: "#fff",
              colorItemBg: "#fff",
            },
          },
          token: {
            colorPrimary: "rgb(0, 151, 224)",
          },
        }}
      >
        <LocaleContext.Provider
          value={{ locales: locales, locale: params.locale }}
        >
          <NavBar />
          <article className="ds-main" id="ds-scroll-content">
            <Content />
            <FloatButton.BackTop
              target={() => document.getElementById("ds-scroll-content")}
            />
            <Footer />
          </article>
        </LocaleContext.Provider>
      </ConfigProvider>
    );
  }

  const locale = getLanguageCodeFromLS();
  return <Navigate to={`/${locale}`} />;
};

export default Layout;
