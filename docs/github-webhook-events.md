# GitHub Webhook Events

This document lists the GitHub webhook events we collect and process. We focus on events that are meaningful for tracking repository activity, releases, and community engagement.

## Collected Events

### Release Events (`release`)

| Action        | Description                             |
| ------------- | --------------------------------------- |
| `published`   | A release is published (most important) |
| `created`     | A draft release is created              |
| `edited`      | A release is edited                     |
| `prereleased` | A pre-release is published              |

### Push Events (`push`)

We only process pushes to the **default branch** (usually `main` or `master`).

| Filter              | Description                                 |
| ------------------- | ------------------------------------------- |
| Default branch only | Ignores feature branches, PR branches, etc. |
| Non-empty commits   | Ignores force pushes with no new commits    |

### Star Events (`star`)

| Action    | Description           |
| --------- | --------------------- |
| `created` | Repository is starred |

---

## Ignored Events

We intentionally ignore:

- Pushes to non-default branches
- PR reviews and comments
- Pull requests (all actions)
- Issue comments
- Commit comments
- Tag create/delete
- Forks
- Issues
- Discussions
- Workflow runs
- Check runs/suites
- Deployments
- Wiki changes
- Project/milestone changes
- Team/member changes
- Repository settings changes

---

## Webhook Configuration

When setting up the webhook in GitHub, select these events:

1. **Releases** - For release tracking
2. **Pushes** - For commit tracking on default branch
3. **Stars** - For star tracking

Content type: `application/json`

---

## Event Payload Examples

### Release Published

```json
{
  "action": "published",
  "release": {
    "tag_name": "v1.0.0",
    "name": "Version 1.0.0",
    "body": "Release notes...",
    "prerelease": false,
    "draft": false,
    "published_at": "2024-01-15T10:00:00Z"
  }
}
```

### Push to Default Branch

```json
{
  "ref": "refs/heads/main",
  "commits": [...],
  "repository": {
    "default_branch": "main"
  }
}
```

### Star Created

```json
{
  "action": "created",
  "starred_at": "2024-01-15T10:00:00Z",
  "sender": {
    "login": "username"
  }
}
```

### Star Created

```json
{
  "action": "created",
  "starred_at": "2024-01-15T10:00:00Z",
  "sender": {
    "login": "username"
  }
}
```

### PR Merged

```json
{
  "action": "closed",
  "pull_request": {
    "merged": true,
    "merged_at": "2024-01-15T10:00:00Z",
    "base": {
      "ref": "main"
    }
  }
}
```
