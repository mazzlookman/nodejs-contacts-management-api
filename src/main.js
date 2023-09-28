import {web} from "./app/web.js"
import {logger} from "./app/log.js";

web.listen(2802,() => {
    logger.info("App listen in port 2802")
})