<template>
  <div>
    <q-header
      view="hHh lpR fFf"
      class="bg-white"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mr-xs"
        />
        <q-toolbar-title>
          <router-link
            to="/"
            style="text-decoration: none"
          >
            <img
              src="logo.jpg"
              class="q-mr-xs"
            />Test Company
          </router-link>
        </q-toolbar-title>
        <div>
          <span
            v-if="$store.state.auth.user"
            class="text-caption q-mr-sm"
          >
            {{ $store.state.auth.user.email }}
          </span>
          <q-btn
            label="Logout"
            @click="logout"
            outline
            rounded
            size="sm"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="default"
      :breakpoint="767"
      :width="100"
      content-class="bg-grey-1 text-caption"
    >
      <q-list class="bg-yellow-1">
        <q-item
          v-for="link in navLinks"
          :key="link.title"
          v-bind="link"
          tag="a"
          :href="link.link"
          clickable
          dense
          class="e-border-b"
        >
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <q-list class="bg-blue-1">
        <q-item
          v-for="link in impLinks"
          :key="link.title"
          v-bind="link"
          tag="a"
          :href="link.link"
          clickable
          dense
          class="e-border-b"
        >
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { supabase } from "boot/supabase"

export default {
  name: "navbar",

  setup () {
    const logout = async () => {
      await supabase.auth.signOut()
    }
    return { logout }
  },

  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      navLinks: [
        {
          title: "Dashboard",
          link: "/admin",
        },
        {
          title: "List Orders",
          link: "/list_orders",
        },
        {
          title: "List Matched",
          link: "/list_matched",
        },
        {
          title: "Match FAS",
          link: "/match_fas",
        }
      ],
      impLinks: [
        {
          title: "Shopify",
          link: "/import_shopify_order",
        },
        {
          title: "FAS",
          link: "/import_fas",
        },
      ],
    };
  }
}
</script>

<style lang="sass" scoped>
div
  color: black
</style>
