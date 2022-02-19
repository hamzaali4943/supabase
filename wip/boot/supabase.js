import { boot } from "quasar/wrappers";
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default boot(async ({ app, store, router, redirect }) => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("boot event:", event);
    store.dispatch("auth/setSession", session);
    if (event === "SIGNED_IN") {
      const { user } = session;
      const {
        id,
        email,
        phone,
        user_metadata: userMetaData,
        app_metadata: { provider },
        updated_at: updatedAt,
      } = user;
      console.log("Login User Data:", user);
      //       let resultQuery = await supabase.from('profiles').select().eq('id', id)
      //       if (!resultQuery.error && !resultQuery.data.length) {
      //         resultQuery = await supabase.from('profiles').insert([
      //           { id, email, phone, avatar_url: avatarUrl, full_name: fullName, updated_at: updatedAt }
      //         ])
      //       }
      //       const { error, data } = resultQuery
      //       if (!error && data.length) store.dispatch('user/setProfile', data[0])
      redirect({ path: "/admin" });
      //       return
    }
    if (event === "SIGNED_OUT") {
      redirect({ path: "/login" });
      return;
    }
    //     if (event === 'PASSWORD_RECOVERY') {
    //       redirect({ path: '/auth/change-password' })
    //       return
    //     }
    //     if (event === 'USER_UPDATED') {
    //       store.dispatch('auth/showInfo', 'User updated')
    //       redirect({ path: '/' })
    if (event == "TOKEN_REFRESHED") {
      console.log("TOKEN_REFRESHED", session);
      redirect({ path: "/login?expired=1" });
      return;
    }
  });
  //   router.beforeEach(async (to, from, next) => {
  //     console.log(from)
  //     console.log(to)
  //     const authRequired = to.matched.some(route => route.meta.authRequired)
  //     if (authRequired && !supabase.auth.user()) return next(false)
  //     return next()
  //   })
  app.config.globalProperties.$supabase = supabase;
  //   if (!supabase.auth.user()) {
  //     // redirect({ path: '/auth/login' })
  // }
  //   const currentSession = supabase.auth.session()
  //   store.dispatch('auth/setSession', currentSession)
  return supabase;
  // })
});
