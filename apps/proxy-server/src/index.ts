import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const mainSite = {
  target: "http://localhost:3001",
  changeOrigin: true,
};
const apiSite = {
  target: "http://localhost:3002",
  changeOrigin: true,
};

app.use("/api", createProxyMiddleware(apiSite));
app.use("/", createProxyMiddleware(mainSite));

app.listen(3000, () => {
  console.log("Service proxy online");
});
