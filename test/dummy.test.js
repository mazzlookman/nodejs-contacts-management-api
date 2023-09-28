import {createUserTest} from "./test-util.test.js";
import {logger} from "../src/app/log.js";
import {prismaClient} from "../src/app/db.js";

it("create user", async () => {
    const user = await createUserTest()
    logger.info(user)
})

it('should can get user', async () => {
    const user = await prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    })

    logger.info(user)
});