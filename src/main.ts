import * as core from "@actions/core";
import * as github from "@actions/github";
import * as request from "request-promise-native";

function createDirewolfRun(jobId: string, creator: string) {
  const direwolfToken = core.getInput("direwolfToken");
  const direwolfUrl = core.getInput("direwolfUrl");
  return request.post(`https://${direwolfUrl}/jobs/${jobId}/runs`, {
    auth: {
      user: direwolfToken,
      pass: "random"
    },
    json: true,
    body: {
      created_by: `github action: ${creator}`
    }
  });
}

async function run() {
  try {
    const jobId = core.getInput("jobId");
    const environment = core.getInput("environment");
    if (
      github.context.eventName == "deployment_status" &&
      github.context.payload.deployment_status.state == "success" &&
      github.context.payload.deployment_status.environment == environment
    ) {
      // Create a Direwolf Run and comment on the PR
      var body = await createDirewolfRun(jobId, github.context.actor);
      core.setOutput("direwolfRunId", body.id);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
