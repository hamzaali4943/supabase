
<template>
  <q-page className="background">
    <h4 className=" no-margin q-pa-xl text-white text-center font-change">
      Matched FAS
    </h4>
    <q-form @submit.prevent="submitting">
      <div class="q-my-lg">
        <q-select
          v-model="selected"
          :options="companies"
          label="Companies"
          options-dense
          dense
          class="q-px-xl"
        />
      </div>
      <div class="q-px-xl">
        <q-badge color="blue-4">Match Start Date : </q-badge>
        <q-input v-model="matchStart">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" round color="primary">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="matchStart" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-badge color="blue-4" class="q-my-md">Match End Date : </q-badge>
        <q-input v-model="matchEnd">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" round color="primary">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="matchEnd" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <div class="flex flex-center">
          <q-btn class="q-ma-lg text-white" label="Submit" type="submit" />
        </div>
      </div>
    </q-form>
    <q-table
      v-if="fasCheck"
      class="q-ma-lg q-mb-lg"
      flat
      title="matched FAS"
      :rows="fasData"
      row-key="ORL_UPI"
      :pagination="{ rowsPerPage: 25 }"
      :rows-per-page-options="[25, 50, 100]"
    />

  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/UseNotify";
import moment from "moment";

const {
  getMatchFasitm
} = useApi();
export default {
  name: "MatchedFas",

  setup() {
    const { notifyError, notifySuccess, showLoader, hideLoader } = useNotify();

    const companies = ref(["ABC"]),
      matchEnd = ref(moment().format("YYYY-MM-DD")),
      matchStart=ref(moment().subtract(7,'days').format('YYYY-MM-DD')),
      selected = ref(""),
      fasCheck=ref(false),
      fasData=ref([]);

    const submitting=async()=> {
      try {
        showLoader();
        fasData.value = await getMatchFasitm('fasitm', matchStart.value, matchEnd.value, selected.value);
        fasCheck.value=true;
        hideLoader();
        console.log(fasData.value);
      } catch (error) {
        notifyError(error.message);
      }
    }


    return {
      companies,
      matchStart,
      matchEnd,
      selected,
      submitting,
      fasData,
      fasCheck

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
