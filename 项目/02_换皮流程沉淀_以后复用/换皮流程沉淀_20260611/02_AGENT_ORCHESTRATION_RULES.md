# Agent Orchestration Rules

This project used multiple agents for planning, generation, postprocess, acceptance, repair, and delivery packaging. The biggest workflow wins came from narrowing agent scope. The biggest failures came from long-context agents and over-trusting their accepted reports.

## 1. Split By Ownership

Use separate agents for independent domains:

- gameplay assets
- menu assets
- modal assets
- final QA
- delivery packaging

Do not let one agent own everything after context becomes long.

## 2. Keep Each Agent Task Small

Good task:

```text
Only fix these three files:
modal_panel_large.png
btn_modal_primary.png
btn_modal_secondary.png
```

Bad task:

```text
Finish all remaining assets and verify the whole project.
```

Small tasks reduce hallucination, stale context, and accidental overwrites.

## 3. Use Short Context For Repair Agents

When an agent stalls or context becomes too long:

- close it
- open a new short-context agent
- pass only the target files, spec, known failure, and allowed write paths

This worked for the modal 3-file repair.

## 4. Use Cheaper Models For Narrow Workers

For narrow production/repair/QA workers, `gpt-5.4-mini` was enough and saved cost.

Escalate only when:

- the task requires broad reasoning across many reports
- image/art direction judgment is ambiguous
- code integration requires complex local project understanding

## 5. Always Define Write Scope

Every worker prompt should include:

- allowed files/folders
- forbidden files/folders
- whether code changes are allowed
- whether image generation is allowed
- whether procedural generation is allowed

Example boundary:

```text
Allowed to overwrite only:
modal_work/processed/modal_p0/modal_panel_large.png
modal_work/processed/modal_p0/btn_modal_primary.png
modal_work/processed/modal_p0/btn_modal_secondary.png

Do not touch menu, gameplay, or game code.
```

## 6. Do Not Let Agents Self-Certify Without Review

An agent may write `ACCEPTED_FOR_INTEGRATION` while visual assets still fail.

Required follow-up:

- inspect contact sheets
- open sample failed assets directly
- run independent broad residue checks
- compare against actual in-game slots

## 7. Stalled Agent Protocol

An agent is likely stalled if:

- repeated wait calls time out
- no file timestamps change for 10-20 minutes
- expected output directories are missing
- previous status remains `running`

Then:

1. close the agent
2. inspect filesystem state
3. spawn a new shorter worker

## 8. Final Delivery Agent Must Be Read-Only

Final QA and delivery packaging agents should not repair art.

If they find a hard fail:

- mark delivery as failed
- list minimal repair items
- stop

Do not let the final QA agent silently fix and accept in one pass.
