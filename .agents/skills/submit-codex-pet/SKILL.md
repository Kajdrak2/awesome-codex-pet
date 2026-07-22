---
name: submit-codex-pet
description: Request or submit pets to Awesome Codex Pet without a full repository clone. Use when a user wants the community to make a pet, wants AI to create or finish their own pet from references, wants to submit existing pet files, needs duplicate and permission review, or wants a focused GitHub issue or pull request created and followed through CI.
---

# Submit Codex Pet

Use GitHub APIs or an authenticated GitHub CLI by default. Do not make the user clone the full catalog unless API-based contribution is unavailable and they approve the fallback.

## Choose the route

- **Request**: the user wants the community or maintainers to make a pet. Search for duplicates and create a `[Request]` issue containing `<!-- pet-flow: request -->`; do not make or submit the pet in this route.
- **Submission**: the user owns the submission and wants AI to create or finish it from references, or already has a spritesheet, pet folder, or finished assets. Complete production as needed, validate the result, then open a focused pull request through the GitHub API.
- **Blocked submission**: attribution, permission, duplicate status, or GitHub authorization cannot be resolved. Create a `[Submission]` issue containing `<!-- pet-flow: submission -->` instead of forcing a pull request.
- **Advanced PR**: the user explicitly prefers Git, GitHub, or Codespaces. Follow `CONTRIBUTING.md`; use a sparse, blob-filtered clone when a local checkout is needed.

Repository: `https://github.com/legeling/awesome-codex-pet`

## Request workflow

1. Read `pets.json`, `collections.json`, and open pet issues through GitHub. Search canonical identity, localized names, franchise, author, and tags.
2. Ask for the character or concept, original work, V1/V2 preference, references, visual direction, naming language, and any available attribution or usage terms.
3. Treat third-party art without redistribution permission as reference only. Never imply that a request is accepted or scheduled.
4. Follow `.github/ISSUE_TEMPLATE/pet-request.yml`. Include the duplicate result and unresolved questions.
5. Create the issue and return its URL. Repository automation manages type, status, version, and category labels.

## Submission workflow

1. Read `AGENTS.md`, `CONTRIBUTING.md`, the relevant Hatch Pet skill, schemas, validation scripts, `pets.json`, and `collections.json` through GitHub before editing.
2. Ask whether the user wants to create a pet now from a character or references, finish an in-progress pet, or submit an existing final package. For new production, collect the character, references, visual direction, V1/V2 choice, naming language, author, source, and usage permission before running the relevant Hatch Pet workflow.
3. Inspect all supplied references and files. Determine the true author, source, permission, canonical identity, category, collection membership, version, and bilingual-name choice. Do not invent missing facts.
4. Search for duplicate canonical characters or concepts. A materially different authorized variant may proceed only when its distinction is documented.
5. Produce exactly:

   ```text
   pets/<pet-slug>--<author-slug>/
   ├── submission.json
   ├── pet.json
   └── spritesheet.webp
   ```

6. Use Hatch Pet v1 for an 8x9, `1536x1872` atlas. Use Hatch Pet v2 for an 8x11, `1536x2288` atlas with `spriteVersionNumber: 2` and 16 look directions.
7. Inspect all frames and animations on checkerboard, dark, and light backgrounds. Repair the smallest failing scope. Do not globally remove colors that belong to the character.
8. Run `npm run validate:pr`, `npm run lint`, and an isolated install test in a temporary workspace. Contributor changes must not include generated README files, `pets.json`, previews, QA, references, prompts, or temporary output.
9. With upstream write access, create a focused branch directly. Otherwise create or reuse the user's fork, construct blobs/tree/commit through the GitHub API, push one submission branch, and open a pull request against upstream `main`.
10. Document duplicate research, author, source, permission, version, validation, and any linked request. Follow CI until it passes; fix deterministic failures and stop for human judgment on identity, permission, or curation.

## Safety and scope

- Never expose GitHub tokens or store credentials in repository files.
- Never upload unrelated local files or a complete Hatch Pet run directory.
- Never contact source authors or open unrelated issues without explicit user instruction.
- Keep one pet per pull request.
- Preserve existing user changes and temporary production material outside the focused submission.
