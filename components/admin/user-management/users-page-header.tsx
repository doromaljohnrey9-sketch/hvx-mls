export function UsersPageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="mt-1 text-muted-foreground">
          Manage user roles, permissions, and account status.
        </p>
      </div>
    </div>
  );
}
