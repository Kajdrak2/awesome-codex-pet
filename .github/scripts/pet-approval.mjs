const PUBLISH_COMMAND = "/publish-pet";
const REPORT_LABEL = "pet-report";
const STATUS_MARKER = "<!-- pet-approval-status -->";
const PET_PREVIEW_WORKFLOW = "pet-previews.yml";
const PET_PATH_PATTERN =
  /^pets\/([a-z0-9][a-z0-9._-]*--[a-z0-9][a-z0-9._-]*)\/(submission\.json|pet\.json|spritesheet\.webp)$/;
const ALLOWED_FILE_STATUSES = new Set(["added", "modified"]);
const MAX_JSON_BYTES = 128 * 1024;
const MAX_SPRITESHEET_BYTES = 80 * 1024 * 1024;

function timeValue(value) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function validatePetChangeSet(files, treeEntries, options = {}) {
  if (!Array.isArray(files) || files.length === 0) {
    return {
      ok: false,
      reason: "The pull request does not change a Pet package.",
    };
  }
  if (files.length > 3) {
    return {
      ok: false,
      reason: "A Pet submission may change at most three package files.",
    };
  }
  if (options.treeTruncated) {
    return { ok: false, reason: "The repository tree response was truncated." };
  }

  const treeByPath = new Map(
    (treeEntries || []).map((entry) => [entry.path, entry]),
  );
  const packageIds = new Set();
  const packageFiles = new Set();

  for (const file of files) {
    if (!ALLOWED_FILE_STATUSES.has(file.status)) {
      return {
        ok: false,
        reason: `Pet package files cannot be ${file.status || "removed"}.`,
      };
    }

    const match = PET_PATH_PATTERN.exec(file.filename || "");
    if (!match) {
      return {
        ok: false,
        reason:
          "Only submission.json, pet.json, and spritesheet.webp inside one Pet package may change.",
      };
    }

    packageIds.add(match[1]);
    packageFiles.add(match[2]);

    const treeEntry = treeByPath.get(file.filename);
    if (
      !treeEntry ||
      treeEntry.type !== "blob" ||
      treeEntry.mode !== "100644"
    ) {
      return {
        ok: false,
        reason: `${file.filename} must be a regular repository file.`,
      };
    }

    const maximum =
      match[2] === "spritesheet.webp" ? MAX_SPRITESHEET_BYTES : MAX_JSON_BYTES;
    if (
      !Number.isFinite(treeEntry.size) ||
      treeEntry.size <= 0 ||
      treeEntry.size > maximum
    ) {
      return {
        ok: false,
        reason: `${file.filename} has an invalid package size.`,
      };
    }
  }

  if (packageIds.size !== 1 || packageFiles.size !== files.length) {
    return {
      ok: false,
      reason: "A pull request must contain one focused Pet package change.",
    };
  }

  return {
    ok: true,
    packageId: [...packageIds][0],
    files: [...packageFiles].sort(),
  };
}

export function selectPetPreviewRun(runs, headSha) {
  return [...(runs || [])]
    .filter(
      (run) =>
        run?.head_sha === headSha &&
        run?.event === "pull_request" &&
        run?.status === "completed",
    )
    .sort(
      (left, right) =>
        timeValue(right.updated_at || right.created_at) -
          timeValue(left.updated_at || left.created_at) ||
        Number(right.id || 0) - Number(left.id || 0),
    )[0];
}

export function decidePetMerge({ pullRequest, scope, validationRun }) {
  if (pullRequest?.state !== "open") return { merge: false, state: "closed" };
  if (pullRequest?.draft) return { merge: false, state: "draft" };
  if (pullRequest?.base?.ref !== "main")
    return { merge: false, state: "wrong-base" };
  if (!scope?.ok) return { merge: false, state: "unsafe-scope" };
  if (!validationRun) return { merge: false, state: "checks-pending" };
  if (validationRun.conclusion !== "success")
    return { merge: false, state: "checks-failed" };
  return { merge: true, state: "validated" };
}

async function ensureReportLabel(github, context, core) {
  try {
    await github.rest.issues.getLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: REPORT_LABEL,
    });
  } catch (error) {
    if (error?.status !== 404) throw error;
    await github.rest.issues.createLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: REPORT_LABEL,
      color: "D73A4A",
      description: "A community member reported a published Pet for review",
    });
    core.info(`Created the ${REPORT_LABEL} repository label.`);
  }
}

async function resolvePullRequestNumber(github, context) {
  if (context.eventName === "pull_request_target") {
    return context.payload.pull_request?.number || null;
  }

  if (context.eventName === "issue_comment") {
    if (!context.payload.issue?.pull_request) return null;
    if (String(context.payload.comment?.body || "").trim() !== PUBLISH_COMMAND)
      return null;
    return context.payload.issue.number;
  }

  if (context.eventName !== "workflow_run") return null;
  const workflowRun = context.payload.workflow_run;
  if (!workflowRun || workflowRun.event !== "pull_request") return null;
  const associated = workflowRun.pull_requests || [];
  if (associated.length > 0) return associated[0].number;

  const response = await github.rest.repos.listPullRequestsAssociatedWithCommit(
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_sha: workflowRun.head_sha,
    },
  );
  return (
    response.data.find((pullRequest) => pullRequest.state === "open")?.number ||
    null
  );
}

async function findValidationRun(github, context, pullRequest) {
  const eventRun = context.payload.workflow_run;
  if (
    context.eventName === "workflow_run" &&
    eventRun?.name === "Pet previews" &&
    eventRun?.head_sha === pullRequest.head.sha &&
    eventRun?.event === "pull_request" &&
    eventRun?.status === "completed"
  ) {
    return eventRun;
  }

  const response = await github.rest.actions.listWorkflowRuns({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: PET_PREVIEW_WORKFLOW,
    event: "pull_request",
    head_sha: pullRequest.head.sha,
    status: "completed",
    per_page: 20,
  });
  return (
    selectPetPreviewRun(response.data.workflow_runs, pullRequest.head.sha) ||
    null
  );
}

async function previewArtifactUrl(github, context, pullRequest, validationRun) {
  if (!validationRun?.id) return null;
  try {
    const response = await github.rest.actions.listWorkflowRunArtifacts({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: validationRun.id,
      per_page: 100,
    });
    const artifact = response.data.artifacts.find(
      (candidate) => candidate.name === `pr-${pullRequest.number}-pet-previews`,
    );
    return artifact
      ? `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${validationRun.id}/artifacts/${artifact.id}`
      : null;
  } catch {
    return null;
  }
}

function reviewStatusBody({
  pullRequest,
  scope,
  validationRun,
  previewUrl,
  mergeState,
}) {
  const scopeLine = scope.ok
    ? `- Package scope: ✅ \`${scope.packageId}\` (${scope.files.join(", ")})`
    : `- Package scope: ❌ ${scope.reason}`;
  const checksLine = !validationRun
    ? "- Automated checks: ⏳ waiting for Pet previews"
    : validationRun.conclusion === "success"
      ? `- Automated checks: ✅ [passed](${validationRun.html_url})`
      : `- Automated checks: ❌ [${validationRun.conclusion || "failed"}](${validationRun.html_url})`;
  const previewLine = previewUrl
    ? `- Visual preview: [download CI artifact](${previewUrl})`
    : null;

  let resultLine = "- Publication: ⏳ waiting";
  if (mergeState === "merged")
    resultLine = "- Publication: ✅ merged; catalog rebuild queued";
  if (mergeState === "merge-failed")
    resultLine = "- Publication: ❌ GitHub could not merge this PR";
  if (mergeState === "dispatch-failed") {
    resultLine =
      "- Publication: ⚠️ merged, but the catalog rebuild could not be queued";
  }

  return [
    STATUS_MARKER,
    "## Pet publication assistant",
    "",
    `PR #${pullRequest.number} is tracked by the protected publication workflow.`,
    "",
    scopeLine,
    checksLine,
    ...(previewLine ? [previewLine] : []),
    resultLine,
  ].join("\n");
}

async function upsertStatusComment(github, context, pullRequest, body, core) {
  try {
    const comments = await github.paginate(github.rest.issues.listComments, {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      per_page: 100,
    });
    const existing = comments.find(
      (comment) =>
        comment.user?.type === "Bot" && comment.body?.includes(STATUS_MARKER),
    );
    if (existing) {
      await github.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: existing.id,
        body,
      });
    } else {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pullRequest.number,
        body,
      });
    }
  } catch (error) {
    core.warning(`Could not update the Pet review comment: ${error.message}`);
  }
}

export async function runPetApproval({ github, context, core }) {
  const pullNumber = await resolvePullRequestNumber(github, context);
  if (!pullNumber) {
    core.info("No open Pet pull request is associated with this event.");
    return;
  }

  await ensureReportLabel(github, context, core);

  const pullResponse = await github.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullNumber,
  });
  const pullRequest = pullResponse.data;
  if (pullRequest.state !== "open") {
    core.info(`PR #${pullNumber} is no longer open.`);
    return;
  }

  const [files, gitCommitResponse, validationRun] = await Promise.all([
    github.paginate(github.rest.pulls.listFiles, {
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullNumber,
      per_page: 100,
    }),
    github.rest.git.getCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_sha: pullRequest.head.sha,
    }),
    findValidationRun(github, context, pullRequest),
  ]);

  const treeResponse = await github.rest.git.getTree({
    owner: context.repo.owner,
    repo: context.repo.repo,
    tree_sha: gitCommitResponse.data.tree.sha,
    recursive: "true",
  });
  const scope = validatePetChangeSet(files, treeResponse.data.tree, {
    treeTruncated: treeResponse.data.truncated,
  });
  const previewUrl = await previewArtifactUrl(
    github,
    context,
    pullRequest,
    validationRun,
  );
  const decision = decidePetMerge({
    pullRequest,
    scope,
    validationRun,
  });

  const status = (mergeState) =>
    reviewStatusBody({
      pullRequest,
      scope,
      validationRun,
      previewUrl,
      mergeState,
    });

  if (!decision.merge) {
    await upsertStatusComment(
      github,
      context,
      pullRequest,
      status(decision.state),
      core,
    );
    core.info(`PR #${pullNumber} was not merged: ${decision.state}.`);
    return;
  }

  const mergeResponse = await github.rest.pulls.merge({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullNumber,
    sha: pullRequest.head.sha,
    merge_method: "squash",
    commit_title: `${pullRequest.title} (#${pullRequest.number})`,
    commit_message: "Published automatically after protected Pet validation.",
  });
  if (!mergeResponse.data.merged) {
    await upsertStatusComment(
      github,
      context,
      pullRequest,
      status("merge-failed"),
      core,
    );
    core.setFailed(
      mergeResponse.data.message || `PR #${pullNumber} could not be merged.`,
    );
    return;
  }

  try {
    await github.rest.actions.createWorkflowDispatch({
      owner: context.repo.owner,
      repo: context.repo.repo,
      workflow_id: PET_PREVIEW_WORKFLOW,
      ref: pullRequest.base.ref,
    });
  } catch (error) {
    await upsertStatusComment(
      github,
      context,
      pullRequest,
      status("dispatch-failed"),
      core,
    );
    core.setFailed(
      `The PR was merged, but the catalog rebuild could not start: ${error.message}`,
    );
    return;
  }

  await upsertStatusComment(
    github,
    context,
    pullRequest,
    status("merged"),
    core,
  );
  core.notice(`PR #${pullNumber} merged; catalog generation was dispatched.`);
}

export const PET_APPROVAL_CONSTANTS = Object.freeze({
  publishCommand: PUBLISH_COMMAND,
  reportLabel: REPORT_LABEL,
  statusMarker: STATUS_MARKER,
});
