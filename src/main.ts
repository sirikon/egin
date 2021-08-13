import "style.scss"
import "./tracing/sentry"

import { createElement } from "react";
import { render } from "react-dom";

import App from "./view/App";

render(createElement(App), document.getElementById("app"));
