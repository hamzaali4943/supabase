
<template>
  <q-page className="background">
    <h4 className=" no-margin q-pa-xl text-white text-center font-change">
      Unmatched Order FAS
    </h4>
    <div class="q-my-xl">
      <q-table
        class="q-ma-lg"
        flat
        :rows="unmatchedOrder"
        row-key="ORL_UPI"
        :pagination="{ rowsPerPage: 25 }"
        :rows-per-page-options="[25, 50, 100]"
      >
        <template v-slot:top>
          <h6>Unmatched Order</h6>
          <q-space />
          <q-btn
            v-show="unmatchedOrder"
            class="no-shadow"
            color="blue-12"
            label="Auto-Matching All"
            @click="autoMatchingAll"
          />
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                color="blue-6"
                label="Auto-Match"
                @click="autoMatching(props.cols[2].value)"
                dense
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-table
        class="q-ma-lg q-mb-lg"
        flat
        title="Unmatched FAS"
        :rows="unmatchedFas"
        row-key="ORL_UPI"
        :pagination="{ rowsPerPage: 25 }"
        :rows-per-page-options="[25, 50, 100]"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/UseNotify";

const { getUnmatchFasitm, getUnmatchOdritm, autoMatchSingle, autoMatch } =
  useApi();
export default {
  name: "OrderFas",

  setup() {
    const { notifyError, notifySuccess, showLoader, hideLoader } = useNotify();
    const unmatchedFas = ref([]),
      unmatchedOrder = ref([]);

    onMounted(async () => {
      showLoader();
      unmatchedFas.value = await getUnmatchFasitm("fasitm");
      unmatchedOrder.value = await getUnmatchOdritm("orditm");
      hideLoader();
      console.log(unmatchedFas.value, unmatchedOrder.value);
    });

    const autoMatching = async (val) => {
      try {
        showLoader();
        console.log(val);
        await autoMatchSingle("orditm", val);
        hideLoader();
        window.location.href = "http://localhost:8080/#/matchfas";
      } catch (error) {
        notifyError(error.message);
      }
    };
    const autoMatchingAll = async () => {
      try {
        showLoader();
        await autoMatch("orditm");
        hideLoader();
        window.location.href = "http://localhost:8080/#/matchfas";
      } catch (error) {
        notifyError(error.message);
      }
    };

    return {
      unmatchedOrder,
      unmatchedFas,
      autoMatching,
      autoMatchingAll,
    };
  },
};
</script>

<style>
.background {
  background: #005aa7; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #fffde4,
    #005aa7
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #fffde4,
    #005aa7
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.font-change {
  font-family: cursive;
}
</style>
