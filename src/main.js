import {web} from "./app/web.js"
import {logger} from "./app/log.js";

web.listen(process.env.APP_PORT,() => {
    logger.info(`App listen in port: ${process.env.APP_PORT}`)
})