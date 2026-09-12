import app from "./index";
import { registerAuthRoutes } from "./auth";

registerAuthRoutes(app);

export default app;
