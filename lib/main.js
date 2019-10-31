"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const request = __importStar(require("request-promise-native"));
function createDirewolfRun(jobId, creator) {
    const direwolfToken = core.getInput("direwolfToken");
    const direwolfUrl = core.getInput("direwolfUrl");
    core.warning(`Direwolf URL: ${direwolfUrl}`);
    core.warning(`Direwolf Token: ${direwolfToken}`);
    var url = `https://${direwolfUrl}/jobs/${jobId}/runs`;
    core.warning(`Direwolf full: ${url}`);
    return request.post(url, {
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobId = core.getInput("jobId");
            const environment = core.getInput("environment");
            if (github.context.eventName == "deployment_status" &&
                github.context.payload.deployment_status.state == "success" &&
                github.context.payload.deployment_status.environment == environment) {
                // Create a Direwolf Run and comment on the PR
                var body = yield createDirewolfRun(jobId, github.context.actor);
                core.setOutput("direwolfRunId", body.id);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
