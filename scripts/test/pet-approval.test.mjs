import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  decidePetMerge,
  runPetApproval,
  selectPetPreviewRun,
  validatePetChangeSet,
} from "../../.github/scripts/pet-approval.mjs";

const packageId = "minuit--kajdrak2";
const packageFiles = ["submission.json", "pet.json", "spritesheet.webp"];

function changedFiles(id = packageId) {
  return packageFiles.map((name) => ({
    filename: `pets/${id}/${name}`,
    status: "added",
  }));
}

function treeEntries(id = packageId) {
  return packageFiles.map((name) => ({
    path: `pets/${id}/${name}`,
    type: "blob",
    mode: "100644",
    size: name === "spritesheet.webp" ? 1024 * 1024 : 512,
  }));
}

function pullRequest(overrides = {}) {
  return {
    number: 3,
    state: "open",
    draft: false,
    user: { login: "Kajdrak2" },
    head: {
      ref: "codex-avatars/submit-minuit-20260809155839",
      sha: "head-sha",
      repo: { full_name: "Kajdrak2/awesome-codex-pet" },
    },
    base: { ref: "main" },
    ...overrides,
  };
}

test("accepts a focused regular-file Pet package change", () => {
  assert.deepEqual(validatePetChangeSet(changedFiles(), treeEntries()), {
    ok: true,
    packageId,
    files: [...packageFiles].sort(),
  });
});

test("rejects unrelated files, multiple packages, removals, and symlinks", () => {
  const unrelated = validatePetChangeSet(
    [{ filename: ".github/workflows/pet-previews.yml", status: "modified" }],
    [
      {
        path: ".github/workflows/pet-previews.yml",
        type: "blob",
        mode: "100644",
        size: 10,
      },
    ],
  );
  assert.equal(unrelated.ok, false);
  assert.match(unrelated.reason, /Only/);

  const secondPackage = changedFiles().slice(0, 2);
  secondPackage.push({
    filename: "pets/other--author/spritesheet.webp",
    status: "added",
  });
  const mixed = validatePetChangeSet(secondPackage, [
    ...treeEntries(),
    {
      path: "pets/other--author/spritesheet.webp",
      type: "blob",
      mode: "100644",
      size: 1024,
    },
  ]);
  assert.equal(mixed.ok, false);
  assert.match(mixed.reason, /one focused/);

  const removed = changedFiles();
  removed[0].status = "removed";
  assert.equal(validatePetChangeSet(removed, treeEntries()).ok, false);

  const symlinkTree = treeEntries();
  symlinkTree[1].mode = "120000";
  assert.equal(validatePetChangeSet(changedFiles(), symlinkTree).ok, false);
});

test("rejects empty, truncated, duplicate, and oversized change sets", () => {
  assert.equal(validatePetChangeSet([], []).ok, false);
  assert.equal(
    validatePetChangeSet(changedFiles(), treeEntries(), { treeTruncated: true })
      .ok,
    false,
  );

  const duplicate = changedFiles();
  duplicate[2] = { ...duplicate[1] };
  assert.equal(validatePetChangeSet(duplicate, treeEntries()).ok, false);

  const oversized = treeEntries();
  oversized[2].size = 81 * 1024 * 1024;
  assert.equal(validatePetChangeSet(changedFiles(), oversized).ok, false);
});

test("selects the newest completed Pet preview run for the exact head", () => {
  const selected = selectPetPreviewRun(
    [
      {
        id: 1,
        head_sha: "head-sha",
        event: "pull_request",
        status: "completed",
        conclusion: "failure",
        updated_at: "2026-08-09T10:00:00Z",
      },
      {
        id: 2,
        head_sha: "other-sha",
        event: "pull_request",
        status: "completed",
        conclusion: "success",
        updated_at: "2026-08-09T12:00:00Z",
      },
      {
        id: 3,
        head_sha: "head-sha",
        event: "pull_request",
        status: "completed",
        conclusion: "success",
        updated_at: "2026-08-09T11:00:00Z",
      },
    ],
    "head-sha",
  );
  assert.equal(selected.id, 3);
});

test("automatically merges only safe, green, ready Pet revisions", () => {
  const pr = pullRequest();
  const scope = validatePetChangeSet(changedFiles(), treeEntries());
  const green = { conclusion: "success" };

  assert.deepEqual(
    decidePetMerge({
      pullRequest: pr,
      scope,
      validationRun: green,
    }),
    { merge: true, state: "validated" },
  );
  assert.equal(
    decidePetMerge({
      pullRequest: { ...pr, draft: true },
      scope,
      validationRun: green,
    }).state,
    "draft",
  );
  assert.equal(
    decidePetMerge({
      pullRequest: pr,
      scope,
      validationRun: { conclusion: "failure" },
    }).state,
    "checks-failed",
  );
});

test("the privileged workflow imports only protected default-branch code", async () => {
  const workflow = await readFile(".github/workflows/pet-approval.yml", "utf8");
  assert.match(workflow, /pull_request_target:/);
  assert.match(workflow, /workflow_run:/);
  assert.match(workflow, /push:\s+branches:\s+- main/);
  assert.match(workflow, /ready_for_review/);
  assert.match(workflow, /\/publish-pet/);
  assert.doesNotMatch(workflow, /approved-pet|\/approve-pet/);
  assert.match(
    workflow,
    /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/,
  );
  assert.match(workflow, /persist-credentials: false/);
  assert.doesNotMatch(workflow, /ref:.*head\.sha/);
});

test("the protected main-branch deployment prepares the Pet report label", async () => {
  const labels = [];
  const github = {
    rest: {
      issues: {
        getLabel: async () => {
          const error = new Error("Missing label");
          error.status = 404;
          throw error;
        },
        createLabel: async (parameters) => {
          labels.push(parameters);
          return { data: {} };
        },
      },
    },
  };
  const messages = [];
  await runPetApproval({
    github,
    context: {
      eventName: "push",
      repo: { owner: "Kajdrak2", repo: "awesome-codex-pet" },
      payload: {},
    },
    core: {
      info(message) {
        messages.push(message);
      },
    },
  });

  assert.equal(labels.length, 1);
  assert.equal(labels[0].name, "pet-report");
  assert.match(messages.at(-1), /No open Pet pull request/);
});

test("the public Pet report form carries the moderation label and privacy warning", async () => {
  const form = await readFile(".github/ISSUE_TEMPLATE/pet-report.yml", "utf8");
  assert.match(form, /name: Report a published Pet/);
  assert.match(form, /- pet-report/);
  assert.match(form, /Reports are public/);
  assert.match(form, /Copyright or attribution concern/);
  assert.match(form, /Inappropriate or unsafe content/);
  assert.match(form, /Do not include passwords, tokens, private conversations/);
});

test("manual catalog dispatches run the generated-listing commit path", async () => {
  const workflow = await readFile(".github/workflows/pet-previews.yml", "utf8");
  assert.match(workflow, /if: github\.event_name != 'pull_request'/);
  assert.doesNotMatch(
    workflow,
    /name: Commit generated files on main\s+id: commit-generated\s+if: github\.event_name == 'push'/,
  );
});

test("the protected runtime merges a green external submission and dispatches the catalog", async () => {
  const calls = { comments: [], dispatches: [], labels: [], merges: [] };
  const pr = pullRequest({
    title: "[Pet] Minuit by an external author",
    user: { login: "external-author" },
    head: {
      ...pullRequest().head,
      ref: "submit-minuit",
      repo: { full_name: "external-author/awesome-codex-pet" },
    },
  });
  const workflowRun = {
    id: 42,
    name: "Pet previews",
    event: "pull_request",
    status: "completed",
    conclusion: "success",
    head_sha: pr.head.sha,
    html_url: "https://github.example/actions/runs/42",
    pull_requests: [{ number: pr.number }],
  };

  const rest = {
    actions: {
      createWorkflowDispatch: async (parameters) => {
        calls.dispatches.push(parameters);
        return { data: {} };
      },
      listWorkflowRunArtifacts: async () => ({
        data: { artifacts: [{ id: 99, name: `pr-${pr.number}-pet-previews` }] },
      }),
      listWorkflowRuns: async () => ({ data: { workflow_runs: [] } }),
    },
    git: {
      getCommit: async () => ({ data: { tree: { sha: "tree-sha" } } }),
      getTree: async () => ({
        data: { tree: treeEntries(), truncated: false },
      }),
    },
    issues: {
      createComment: async (parameters) => {
        calls.comments.push(parameters.body);
        return { data: {} };
      },
      createLabel: async (parameters) => {
        calls.labels.push(parameters);
        return { data: {} };
      },
      getLabel: async () => {
        const error = new Error("Missing label");
        error.status = 404;
        throw error;
      },
      listComments: async () => ({ data: [] }),
      listEventsForTimeline: async () => ({ data: [] }),
      updateComment: async () => ({ data: {} }),
    },
    pulls: {
      get: async () => ({ data: pr }),
      listFiles: async () => ({ data: changedFiles() }),
      merge: async (parameters) => {
        calls.merges.push(parameters);
        return { data: { merged: true } };
      },
    },
    repos: {
      getCommit: async () => ({
        data: { commit: { committer: { date: "2026-08-09T11:00:00Z" } } },
      }),
      listPullRequestsAssociatedWithCommit: async () => ({ data: [pr] }),
    },
  };
  const github = {
    rest,
    paginate: async (method, parameters) => (await method(parameters)).data,
  };
  const failures = [];
  const context = {
    eventName: "workflow_run",
    repo: { owner: "Kajdrak2", repo: "awesome-codex-pet" },
    payload: { workflow_run: workflowRun },
  };
  const core = {
    info() {},
    notice() {},
    warning() {},
    setFailed(message) {
      failures.push(message);
    },
  };

  await runPetApproval({ github, context, core });

  assert.equal(calls.merges.length, 1);
  assert.equal(calls.merges[0].sha, pr.head.sha);
  assert.equal(calls.dispatches.length, 1);
  assert.equal(calls.dispatches[0].workflow_id, "pet-previews.yml");
  assert.equal(calls.labels.length, 1);
  assert.equal(calls.labels[0].name, "pet-report");
  assert.equal(calls.comments.length, 1);
  assert.match(calls.comments[0], /catalog rebuild queued/);
  assert.deepEqual(failures, []);
});
