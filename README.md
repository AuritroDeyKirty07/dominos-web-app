# Domino's Clone

## Team Allocation

| Team | Members | Assigned Module |
|------|---------|-----------------|
| Team 1 | Auritro, Tanish, Gyanender | Authentication & RBAC |
| Team 2 | Saranshi, Mahi, Pragya | Customer |
| Team 3 | Aman, Anirudh, Aanchal| Delivery |
| Team 4 | Aditya, Piyush, Rachit | Cook + Admin |
| Team 5 | Ayush, Himanshu, Savan, Animesh | Cook |

> **Note:** Team 4 and Team 5 will independently develop the **Cook Module**. After completion, both implementations will be reviewed and compared, and the better version will be merged into the main branch.

---

## Branch Naming Convention

| Module | Branch Name |
|--------|-------------|
| Authentication & RBAC | `feature/auth` |
| Customer | `feature/customer` |
| Delivery | `feature/delivery` |
| Cook | `feature/cook-team4` / `feature/cook-team5` |
| Admin | `feature/admin` |

---

## Workflow

1. Create a feature branch from `main`.
2. Work only on your assigned module.
3. Commit your changes with meaningful commit messages.
4. Push your feature branch.
5. Create a Pull Request.
6. Wait for approval before merging into `main`.

---

## Rules

- Do not push directly to `main`.
- Always work on your assigned feature branch.
- Every change must be submitted through a Pull Request.
- Wait for approval before merging.
- Resolve merge conflicts before requesting a review.
- Do not modify another team's module without prior discussion.

---

## Commit Message Examples

```bash
feat(auth): add login API
feat(customer): add profile page
feat(delivery): implement order tracking
feat(cook): add order queue
feat(admin): create dashboard
fix(auth): resolve JWT validation issue
docs: update README
```
