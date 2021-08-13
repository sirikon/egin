import config from "../config"
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: config.sentryDSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
