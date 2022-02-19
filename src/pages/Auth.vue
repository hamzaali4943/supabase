<template>
  <q-page padding>
    <div>
    <div v-if="getLocation==true">
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center">Login</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Email"
          v-model="form.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Email is required']"
          type="email"
        />

        <q-input
          label="Password"
          type="password"
          v-model="form.password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Password is required']"
        />

        <div class="full-width q-pt-md">
          <q-btn
            label="Login"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />
        </div>
        <div class="full-width q-gutter-y-sm">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            flat
            @click="getLocation=false"
            size="sm"
          />
        </div>
      </div>
    </q-form>
    </div>
    <div v-else>

      <q-form class="row justify-center" @submit.prevent="handleRegister">
        <p class="col-12 text-h5 text-center">Register</p>
        <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
          <q-input
            label="Name"
            v-model="Registerform.name"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Name is required']"
          />

          <q-input
            label="Email"
            v-model="Registerform.email"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Email is required']"
            type="email"
          />

          <q-input
            label="Password"
            v-model="Registerform.password"
            lazy-rules
            type="password"
            :rules="[
            (val) =>
              (val && val.length >= 6) ||
              'Password is required and 6 characters',
          ]"
          />

          <div class="full-width q-pt-md q-gutter-y-sm">
            <q-btn
              label="Register"
              color="primary"
              class="full-width"
              outline
              rounded
              type="submit"
            />

            <q-btn
              label="Back"
              color="dark"
              class="full-width"
              rounded
              flat
              @click="getLocation=true"
            />
          </div>
        </div>
      </q-form>
    </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted,onBeforeMount } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageLogin",

  setup() {
    const router = useRouter();

    const { login, isLoggedIn,register } = useAuthUser();
     const getLocation=ref(true);
    const { notifyError, notifySuccess,showLoader,hideLoader } = useNotify();

    const form = ref({
      email: "",
      password: "",
    });

    const Registerform = ref({
      name: "",
      email: "",
      password: "",
    });


    onMounted(() => {

      if (isLoggedIn) {
        router.push({ name: "index" });
      }


    });

    const handleLogin = async () => {
      try {
        showLoader();
        await login(form.value);
        hideLoader();
        notifySuccess("Login successfully!");
        router.push({ name: "index" });
      } catch (error) {
        showLoader();
        hideLoader();
        notifyError(error.message);
      }
    };
    const handleRegister = async () => {
      try {
        showLoader();
        await register(Registerform.value);
        hideLoader();
        notifySuccess("Register successfully!");
        router.push({ name: "index" });
      } catch (error) {
        showLoader();
        hideLoader();
        notifyError(error.message);
      }
    };

    return {
      form,
      handleLogin,
      getLocation,
      handleRegister,
      Registerform,

    };
  },
});
</script>
