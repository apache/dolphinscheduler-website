import React, { useEffect } from "react";
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
  useEffect(() => {
    // Polyfill for crypto.randomUUID (required for kapa.ai in non-secure contexts like HTTP localhost)
    if (typeof window.crypto.randomUUID !== "function") {
      window.crypto.randomUUID = function () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
        );
      };
    }

    // Prevent duplicate script injection
    if (document.getElementById("kapa-ai-widget")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "kapa-ai-widget";
    script.src = "https://widget.kapa.ai/kapa-widget.bundle.js";
    script.setAttribute("data-website-id", "e3268e5d-c0f1-4e71-819c-c60ebb2215a7");
    script.setAttribute("data-project-name", "Apache DolphinScheduler");
    script.setAttribute("data-project-color", "#0097E0");
    script.setAttribute("data-project-logo", "https://dolphinscheduler.apache.org/images/logo_400x400.jpg");
    script.setAttribute("data-modal-disclaimer", "This is a custom LLM for Apache DolphinScheduler with access to all developer Documentation, Blog, GitHub issues and discussions.");
    script.setAttribute("data-modal-example-questions", "Why we need DolphinScheduler?,How to deploy DolphinScheduler?,How to submit task?,How to contribute?");
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById("kapa-ai-widget");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

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
              target={() =>
                document.getElementById("ds-scroll-content")
              }
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