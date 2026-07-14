# Submission Guide

[简体中文](../zh-CN/submission-guide.md) | English

This repository welcomes community-made Codex pet submissions.

## Submit with Codex

The website submission page includes a **Start in Codex** button. It opens a prepared task through `codex://new?prompt=...`. Codex first asks for the reference, pet name, author credit, source URL, and license, then carries the creation, validation, and pull request through end to end.

You can also give Codex this task directly:

```text
Help me create and submit a Codex pet to https://github.com/legeling/awesome-codex-pet.

Before starting, ask me for any missing character reference, pet name, author credit, source URL, and license. Do not submit an asset without explicit redistribution permission. Clone or open the repository, read AGENTS.md and the submission guide, then follow the repository-local .agents/skills/hatch-pet-v2/SKILL.md workflow. Do not assume that skill is globally installed. Keep only submission.json, pet.json, and spritesheet.webp in the final pet folder. Run npm run previews, npm run readmes, npm run validate, and npm run lint. When complete, create a focused branch and commit, then open one pull request containing only this pet.
```

AI assistance does not relax the licensing or attribution requirements. The submitter must still confirm redistribution rights and provide accurate authorship, source, and license information.

## Goals

Each submission should be:

- Easy to review
- Easy to preview
- Easy to reuse
- Clear about authorship and licensing

## Recommended folder layout

```text
pets/
└── pet-slug--author-slug/
    ├── submission.json
    ├── pet.json
    ├── spritesheet.webp
```

The pet folder should contain only these three files.

## Choose v1 or v2

| Version | Spritesheet               | Runtime field                         | Content                                 |
| ------- | ------------------------- | ------------------------------------- | --------------------------------------- |
| v1      | `1536x1872`, 8 × 9 cells  | omit `spriteVersionNumber` or use `1` | 9 standard animation rows               |
| v2      | `1536x2288`, 8 × 11 cells | use `spriteVersionNumber: 2`          | 9 standard rows plus 16 look directions |

Use [.agents/skills/hatch-pet-v1](../../.agents/skills/hatch-pet-v1) to preserve or repair legacy v1 pets. Use [.agents/skills/hatch-pet-v2](../../.agents/skills/hatch-pet-v2) for new v2 pets or v1-to-v2 upgrades.

To upgrade a locally installed v1 pet, open Codex **Settings → Pets**, choose **Update**, and review the Hatch Pet result. The upgrade keeps approved standard rows, adds the direction rows, and updates the local `pet.json`; it does not submit the result to this repository.

## Required information

Please include:

- Folder slug in `pet-slug--author-slug` format
- Primary category
- Pet name
- Author name or handle
- Short description
- Source or original post link if available
- License for the asset
- Optional collection slugs from `collections.json`

## Collections

Collections are repository metadata, not website-only configuration. Add the relevant collection slug to the pet's `submission.json`:

```json
{
  "collections": ["genshin-impact"]
}
```

Collection titles, descriptions, featured state, and cover pets live in the root [`collections.json`](../../collections.json). The website groups pets from these files during its build; do not maintain a separate frontend pet list.

## Review expectations

- `pet.json` must remain installable
- `pet.json` `id` must match the folder name
- `spriteVersionNumber` must match the atlas dimensions
- `spritesheet.webp` should be included for Codex runtime use
- Repository-only metadata should go into `submission.json`, not `pet.json`
- Generated preview assets should be kept under `assets/previews/<pet-id>/`
- Generated previews, QA output, references, and README files should not be placed in `pets/<pet-id>/`
- One pet per pull request is strongly preferred

## Preview generation

Previews are generated from `spritesheet.webp`:

```bash
python -m pip install -r requirements.txt
npm run previews
```

This creates:

```text
assets/previews/<pet-id>/contact-sheet.png
assets/previews/<pet-id>/gifs/<state>.gif
```

Maintainers and CI run the same command after merge. Contributor pull requests should not commit generated preview binaries.
All generated action GIFs use the same pixel size: `384x416`.

## Quick install check

Before opening a pull request, verify that the pet can be installed:

```bash
npm run install:pet -- pet-slug--author-slug --codex-home /tmp/codex-pet-test
```

This should create:

```text
/tmp/codex-pet-test/pets/<pet-id>/
├── pet.json
└── spritesheet.webp
```

After the pull request is merged, users can install the pet without cloning the repository:

```bash
curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- pet-slug--author-slug
```

## Asset recommendations

- Keep the required filenames exactly `submission.json`, `pet.json`, and `spritesheet.webp`
- Submit the final runtime WebP, not an intermediate PNG or Hatch Pet run directory
- Do not include generated previews; maintainers and CI create them from the submitted spritesheet
- Review every standard animation and, for v2, the complete 16-direction loop before submission

## Notes

The exact validation rules for pet files may evolve as the Codex pet ecosystem becomes more stable.

For now, consistency and clarity matter more than strict format enforcement.
