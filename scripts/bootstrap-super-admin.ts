import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx scripts/bootstrap-super-admin.ts <email>");
    console.error("Provide the email of the existing auth user to promote.");
    process.exit(1);
  }

  const { data: users, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error("Failed to list users:", listErr.message);
    process.exit(1);
  }

  const user = users.users.find((u) => u.email === email);
  if (!user) {
    console.error(`No auth user found with email: ${email}`);
    process.exit(1);
  }

  const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { user_role: "super_admin" },
  });

  if (updateErr) {
    console.error("Failed to set app_metadata:", updateErr.message);
    process.exit(1);
  }

  console.log(`Set user_role=super_admin in app_metadata for ${email} (${user.id})`);

  const { error: profileErr } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      user_role: "super_admin",
      nickname: "Super Admin",
      real_name: "",
      onboarding_completed: true,
    },
    { onConflict: "id" }
  );

  if (profileErr) {
    console.error("Failed to create profile:", profileErr.message);
    process.exit(1);
  }

  console.log("Profile created/updated for super admin.");
  console.log("Done! The user can now access the full admin dashboard.");
}

main();
