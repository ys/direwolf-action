import * as process from "process";
import * as cp from "child_process";
import * as path from "path";

// shows how the runner will run a javascript action with env / stdout protocol
test("test runs", () => {
  process.env["INPUT_JOB_ID"] = "123";
  process.env["INPUT_DIREWOLF_TOKEN"] = "token";
  process.env["INPUT_ENVIRONMENT"] = "staging";
  const ip = path.join(__dirname, "..", "lib", "main.js");
  const options: cp.ExecSyncOptions = {
    env: process.env
  };
  console.log(cp.execSync(`node ${ip}`, options).toString());
});
