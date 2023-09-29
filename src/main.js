import {web} from "./app/web.js"
import {logger} from "./app/log.js";

web.listen(3000,() => {
    logger.info("App listen in port 3000")
})