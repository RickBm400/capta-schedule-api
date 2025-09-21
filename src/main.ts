import { app } from "./configs/server";
import environment from "./configs/environment";

app.listen(environment.PORT, async () => {
    console.log("Process listening on port " + environment.PORT);
});
