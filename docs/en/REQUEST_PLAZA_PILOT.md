# Request plaza voting pilot

This one-week pilot validates demand before building a dedicated request plaza or adding another statistics service. Voting and claiming stay on GitHub, so the experiment adds no real-time Worker traffic.

## Pilot window

- Start: July 28, 2026
- End: August 4, 2026 at 10:00 UTC
- Requests: #69, #62, #50, #47, and #45
- Vote: add a 👍 reaction to the issue's pilot comment
- Claim: a contributor comments that they want to make the pet; a maintainer applies `status: in-progress` after confirming the claim

One GitHub account contributes at most one visible reaction per issue. A vote shows community interest; it is not an acceptance or delivery promise. Existing pets and requests for the same character must be linked rather than hidden. A new request remains valid when it asks for a clearly different, independently produced interpretation.

## Snapshot and review

Record one final snapshot after the window closes. Real-time aggregation is intentionally out of scope.

Review:

- votes per request and how concentrated they are
- new claims and the vote-to-claim relationship
- duplicate requests discovered during the pilot
- moderation effort and unclear claim states

Build a static request plaza only if the pilot produces useful voting or claim signals. The first implementation should consume a bounded GitHub-generated snapshot during the site build, reuse the existing status labels, and avoid a continuously polling Worker.
