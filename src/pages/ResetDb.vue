<template>
  <div class="row q-my-md">
    <div class="col-3 q-pl-sm">
      <q-input
        v-model="dbtable"
        label="Table"
        outlined
        dense
      />
    </div>
    <div class="col-3 q-pl-sm">
      <q-btn
        label="Confirm"
        color="primary"
        type="submit"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import useSupabase from "src/boot/supabase";

const { supabase } = useSupabase();

export default defineComponent({
  name: "resetDb",

  setup () {
    const dbtable = ref(null);

    const onSubmit = async () => {
      if (dbtable.value == 'all') {
        try {
          console.log("Reset Db:");
          await supabase.from("ordtrl").delete().gt("ord_num", 0);
          await supabase.from("orditm").delete().gt("ord_num", 0);
          await supabase.from("ordhdr").delete().gt("ord_num", 0);
          await supabase.from("fasitm").delete().gt("woRef", 0);
          alert("Reset completed");
        } catch (e) {
          console.log("Reset Error", e);
        }
      } else {
        alert("Wrong table");
      }

    };

    return {
      dbtable,
      onSubmit,
    };
  },
});
</script>

<style></style>
