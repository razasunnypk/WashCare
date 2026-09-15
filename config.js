/* WashCare Laundry Manager — sync configuration
   ------------------------------------------------------------------
   Leave this file as it is to run the app on one device only
   (everything stays in the browser, no account needed).

   To sync several devices, create a Supabase project, run
   supabase-setup.sql in its SQL editor, then paste the project URL
   and the anon/public key below.                                    */

window.WASHCARE_CONFIG = {
  supabaseUrl: "",   // e.g. "https://abcdefgh.supabase.co"
  supabaseKey: ""    // the anon / public key, not the service_role key
};
