# Permission Matrix

This document defines the permission matrix for the MLS application, outlining what each user role can access and modify.

## Roles

- **student**: Regular student users
- **teacher**: Teachers with branch-scoped access
- **super_admin**: Super administrators with full system access

## Permission Matrix

### Student Management

| Action | Student | Teacher | Super Admin |
|--------|---------|---------|-------------|
| View students list | ❌ | ✅ (own branch only) | ✅ (all) |
| Create student | ❌ | ✅ (own branch only) | ✅ (all) |
| Edit student | ❌ | ✅ (own branch only) | ✅ (all) |
| Update approval status | ❌ | ✅ (own branch only) | ✅ (all) |
| Update grade | ❌ | ✅ (own branch only) | ✅ (all) |
| Update assigned teacher | ❌ | ✅ (own branch only) | ✅ (all) |
| Update branch/school | ❌ | ❌ | ✅ |

### User Management

| Action | Student | Teacher | Super Admin |
|--------|---------|---------|-------------|
| View users list | ❌ | ✅ (own branch only) | ✅ (all) |
| Create user | ❌ | ✅ (own branch only) | ✅ (all) |
| Update user role | ❌ | ❌ | ✅ |
| Update approval status | ❌ | ✅ (own branch only) | ✅ (all) |

### Dashboard

| Action | Student | Teacher | Super Admin |
|--------|---------|---------|-------------|
| View dashboard stats | ✅ (own data) | ✅ (own branch) | ✅ (all) |

### Videos

| Action | Student | Teacher | Super Admin |
|--------|---------|---------|-------------|
| View videos | ✅ | ✅ | ✅ |
| Search videos | ✅ | ✅ | ✅ |

## Branch-Scoped Access

Teachers have branch-scoped access, meaning they can only:

- View and manage students/users within their assigned branch
- Create students/users only for their branch
- Cannot access or modify data from other branches

Super admins have unrestricted access to all branches and data.

## Implementation

### Backend (API Routes)

The API enforces permissions through:

1. **Role Guard** (`lib/guards/role.guard.ts`): Requires specific roles to access endpoints
2. **Branch Filtering** (`app/api/admin/users/route.ts`): Automatically filters data by branch for non-super admins

```typescript
// Branch-scoped access for non-super admins
if (profile!.role !== "super_admin" && profile!.branchId) {
  conditions.push(eq(profiles.branchId, profile!.branchId));
}
```

### Frontend (UI Components)

The UI enforces permissions through:

1. **Permission Checks**: Components check user role and branch before allowing actions
2. **Disabled Controls**: Actions are disabled when user lacks permissions

```typescript
// Example: Student actions dropdown
const canEditStudent =
  profile?.role === "super_admin" ||
  (profile?.role === "teacher" && profile.branchId === student.branchId);
```

## Security Notes

- All API endpoints use the role guard to enforce authentication and authorization
- Branch-scoped queries are applied at the database level for non-super admins
- Frontend permission checks provide UX feedback but are not a substitute for backend security
- Teachers cannot modify their own account (except super admins)
