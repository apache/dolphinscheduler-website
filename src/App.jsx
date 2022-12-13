import {
  createHashRouter,
  createRoutesFromElements,
  json,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./views/Layout";
import Home from "./views/Home";
import Documentation, { DocumentationDetail } from "./views/Documentation";
import Community from "./views/Community";
import UseCase from "./views/UseCase";
import Search from "./views/Search";
import Download, { Deployment, Version } from "./views/Download";
import Blog, { BlogDetail } from "./views/Blog";
import Event, { EventDetail } from "./views/Event";
import Support from "./views/Support";
import NotFound from "./views/NotFound";
import getLocales from "./api/getLocales";
import getVersions from "./api/getVersions";

const router = createHashRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />} />
      <Route
        path=":locale"
        element={<Layout />}
        loader={async ({ params }) => {
          if (params.locale) {
            if (!window.WORKER) {
              window.WORKER = new Worker("worker/db.js", {
                name: params.locale,
              });
            }
            return Promise.all([getLocales(params.locale), getVersions()]);
          }
          return new Promise();
        }}
        action={async () => {
          return json({ ok: true });
        }}
      >
        <Route index element={<Home />} />
        <Route path="docs" element={<Documentation />} />
        <Route path="docs/:version" element={<Documentation />}>
          <Route path="*" element={<DocumentationDetail />} />
        </Route>
        <Route path="community" element={<Community />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:name" element={<BlogDetail />} />
        <Route path="events" element={<Event />}></Route>
        <Route path="events/:name" element={<EventDetail />} />
        <Route path="use_case" element={<UseCase />} />
        <Route path="search" element={<Search />}></Route>
        <Route path="download" element={<Download />} />
        <Route path="download/deployment" element={<Deployment />} />
        <Route path="download/:version" element={<Version />} />
        <Route path="support" element={<Support />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export default function App() {
  return <RouterProvider router={router} />;
}
