import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  collaboratorPermissionValue,
  collectApprovalActors,
  decidePetMerge,
  isTrustedOwnerSubmission,
  permissionCanMerge,
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

test("trusts only repository-owner submissions created by Codex Avatars", () => {
  assert.equal(
    isTrustedOwnerSubmission(pullRequest(), "Kajdrak2", "awesome-codex-pet"),
    true,
  );
  assert.equal(
    isTrustedOwnerSubmission(
      pullRequest({ user: { login: "someone-else" } }),
      "Kajdrak2",
      "awesome-codex-pet",
    ),
    false,
  );
  assert.equal(
    isTrustedOwnerSubmission(
      pullRequest({
        head: { ...pullRequest().head, ref: "feature/manual-change" },
      }),
      "Kajdrak2",
      "awesome-codex-pet",
    ),
    false,
  );
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

test("uses only approval signals created after the current head commit", () => {
  const actors = collectApprovalActors({
    headCommittedAt: "2026-08-09T11:00:00Z",
    comments: [
      {
        body: "/approve-pet",
        created_at: "2026-08-09T10:00:00Z",
        user: { login: "Old" },
      },
      {
        body: " /approve-pet ",
        created_at: "2026-08-09T11:01:00Z",
        user: { login: "Alice" },
      },
      {
        body: "/approve-pet later",
        created_at: "2026-08-09T11:02:00Z",
        user: { login: "Noise" },
      },
    ],
    timelineEvents: [
      {
        event: "labeled",
        label: { name: "approved-pet" },
        created_at: "2026-08-09T11:03:00Z",
        actor: { login: "Bob" },
      },
      {
        event: "labeled",
        label: { name: "different-label" },
        created_at: "2026-08-09T11:04:00Z",
        actor: { login: "Noise" },
      },
    ],
  });

  assert.deepEqual(actors.sort(), ["alice", "bob"]);
});

test("allows merge permissions but rejects read and triage permissions", () => {
  for (const permission of ["admin", "maintain", "write"]) {
    assert.equal(permissionCanMerge(permission), true);
  }
  for (const permission of ["triage", "read", "none", undefined]) {
    assert.equal(permissionCanMerge(permission), false);
  }
});

test("reads the collaborator permission level instead of the nested capability object", () => {
  assert.equal(
    collaboratorPermissionValue({
      permission: "write",
      user: { permissions: { pull: true, push: true } },
    }),
    "write",
  );
  assert.equal(
    collaboratorPermissionValue({ role_name: "maintain" }),
    "maintain",
  );
  assert.equal(collaboratorPermissionValue({}), "none");
});

test("merges only safe, green, approved Pet revisions", () => {
  const pr = pullRequest();
  const scope = validatePetChangeSet(changedFiles(), treeEntries());
  const green = { conclusion: "success" };

  assert.deepEqual(
    decidePetMerge({
      pullRequest: pr,
      scope,
      validationRun: green,
      trustedOwner: true,
      approvedMaintainer: null,
    }),
    { merge: true, state: "owner-approved" },
  );
  assert.deepEqual(
    decidePetMerge({
      pullRequest: pr,
      scope,
      validationRun: green,
      trustedOwner: false,
      approvedMaintainer: "maintainer",
    }),
    { merge: true, state: "maintainer-approved" },
  );
  assert.equal(
    decidePetMerge({
      pullRequest: pr,
      scope,
      validationRun: green,
      trustedOwner: false,
      approvedMaintainer: null,
    }).state,
    "approval-required",
  );
  assert.equal(
    decidePetMerge({
      pullRequest: pr,
      scope,
      validationRun: { conclusion: "failure" },
      trustedOwner: true,
      approvedMaintainer: null,
    }).state,
    "checks-failed",
  );
});

test("the privileged workflow imports only protected default-branch code", async () => {
  const workflow = await readFile(".github/workflows/pet-approval.yml", "utf8");
  assert.match(workflow, /pull_request_target:/);
  assert.match(workflow, /workflow_run:/);
  assert.match(
    workflow,
    /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/,
  );
  assert.match(workflow, /persist-credentials: false/);
  assert.doesNotMatch(workflow, /ref:.*head\.sha/);
});

test("manual catalog dispatches run the generated-listing commit path", async () => {
  const workflow = await readFile(".github/workflows/pet-previews.yml", "utf8");
  assert.match(workflow, /if: github\.event_name != 'pull_request'/);
  assert.doesNotMatch(
    workflow,
    /name: Commit generated files on main\s+id: commit-generated\s+if: github\.event_name == 'push'/,
  );
});

test("the protected runtime merges a green owner submission and dispatches the catalog", async () => {
  const calls = { comments: [], dispatches: [], merges: [] };
  const pr = pullRequest({ title: "[Pet] Minuit by Kajdrak2" });
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
      createLabel: async () => ({ data: {} }),
      getLabel: async () => ({ data: { name: "approved-pet" } }),
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
      getCollaboratorPermissionLevel: async () => ({
        data: { permission: "write" },
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
  assert.equal(calls.comments.length, 1);
  assert.match(calls.comments[0], /catalog rebuild queued/);
  assert.deepEqual(failures, []);
});
