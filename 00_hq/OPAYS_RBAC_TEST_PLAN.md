# OPAYS HQ RBAC Test Plan

Purpose: verify that CEO, COO, Associate, Employee, Sales, Engineer, and Admin see only what they should see.

## Accounts To Create

- CEO
- COO
- Admin
- Associate
- Sales
- Engineer
- Employee

## Test Matrix

### 1. Profiles

- CEO/COO/Admin can read all profiles.
- Employee can read only their own profile.
- Associate can read their own profile and should not see private admin fields from others.

### 2. Leads

- Sales/CEO/COO/Admin can create and update leads.
- Engineer/Employee cannot create leads.
- Assigned user can see their own lead.
- `NEW` leads must show a qualification SLA deadline.

### 3. Projects

- Associate can read operational project data.
- Non-associate task assignees can only see projects if linked through tasks.
- Financial fields must come from `project_billing`, not the project row.
- Contract URL must come from `project_contracts`.

### 4. Trésorerie

- Only CEO/COO/Admin can read treasury logs.
- Employee, Engineer, Sales, Associate should be blocked.

### 5. RH

- Employee can read their own HR records.
- Non-admins must not see other employees' records.
- Admin can read everything.

### 6. Equity

- Associate can read their own vesting logs.
- CEO/COO/Admin can read all vesting logs.
- Employee should not see associate equity data.

### 7. Knowledge

- Articles with `target_role = SALES` visible only to Sales and Admin.
- Articles with `target_role = CTO` visible only to CTO and Admin.
- Articles with no target role visible to all authenticated users.

### 8. Documents

- Global documents visible only when role/type matches allowlist.
- Uploaded-by owner can always see their own upload.
- Admin can see all.

### 9. Invitations

- Only Admin can create or read invitation records.
- Other roles must be blocked.

## Concrete Queries To Run

- Open app as each role and check route access.
- Query `project_contracts` as Employee and verify zero rows.
- Query `project_billing` as Sales and verify zero rows unless Admin/Associate.
- Insert a lead as Engineer and confirm failure.
- Insert a task as Associate and confirm success.
- Update a foreign task as Employee and confirm failure.

## Pass Criteria

- No sensitive financial or HR table leaks.
- No unauthorized inserts succeed.
- No dashboard route displays a field the row policy would not allow.
- The app still builds and the UI continues to work with the new schema.
