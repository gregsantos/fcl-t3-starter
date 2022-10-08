import path from "path"
import {emulator, init} from "@onflow/flow-js-testing"

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000)

describe("basic-test", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../contracts")
    // You can specify different port to parallelize execution of describe blocks
    const logging = false

    await init(basePath)
    return emulator.start({logging})
  })

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop()
  })

  test("+++", async () => {
    // WRITE YOUR ASSERTS HERE
  })
})
