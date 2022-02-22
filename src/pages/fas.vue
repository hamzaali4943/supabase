<template>
  <q-page class="background">
    <h4 class="no-margin q-pa-xl text-white text-center font-change">
      Fas Data
    </h4>

    <div class="q-my-lg">
      <q-select
        v-model="selected"
        :options="csvfiles"
        label="File Type"
        options-dense
        dense
        class="q-pa-xl"
      />

      <div v-if="selected" class="text-caption">
        <div v-if="selected.value == 'fasitm'" class="q-px-xl">
          <b>FAS Lines </b><br />
          <vue-csv-import
            v-model="csvfile"
            :fields="{
              orl_upi: { required: true, label: 'upi' },
              invDate: { required: true, label: 'invDate' },
              invRef: { required: true, label: 'invRef' },
              poRef: { required: true, label: 'poRef' },
              woRef: { required: true, label: 'woRef' },
              itemNum: { required: true, label: 'itemNum' },
              itemName: { required: true, label: 'itemName' },
              invAmt: { required: true, label: 'invAmt' },
              shipDate: { required: true, label: 'shipDate' },
              containerRef: { required: true, label: 'containerRef' },
            }"
          >
            <vue-csv-toggle-headers />
            <vue-csv-errors />
            <vue-csv-input @change="setFileName" />
            <vue-csv-map />
          </vue-csv-import>
        </div>
      </div>
    </div>
    <div class="q-px-xl">
      <q-select
        v-model="company"
        label="Company"
        options-dense
        :options="companies"
        dense
      />
      <q-space />
    </div>
    <div v-if="csvfile" class="q-mx-sm q-pb-xl">
      <q-table
        v-if="selected.value == 'fasitm'"
        class="q-ma-xl"
        flat
        title="Import Preview"
        :rows="csvfile"
        row-key="upi"
        :pagination="{ rowsPerPage: 25 }"
        :rows-per-page-options="[25, 50, 100]"
      >
        <template v-slot:top>
          <h5>Import Preview</h5>
          <q-space />
          <q-btn
            class="no-shadow"
            color="blue-12"
            v-show="company"
            @click="onSubmit"
            label="Import data"
          />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import useApi from "src/composables/useApi";
import useNotify from "src/composables/UseNotify";
import {
  VueCsvToggleHeaders,
  VueCsvMap,
  VueCsvInput,
  VueCsvErrors,
  VueCsvImport,
} from "vue-csv-import";

import { defineComponent, ref, onMounted, computed } from "vue";
const { post, getById, update, list, customLogic } = useApi();

export default defineComponent({
  name: "order",

  components: {
    VueCsvToggleHeaders,
    VueCsvMap,
    VueCsvInput,
    VueCsvErrors,
    VueCsvImport,
  },

  setup() {
    const { notifyError, notifySuccess, showLoader, hideLoader } = useNotify();

    const allOrders = ref([]),
      company = ref(null),
      selected = ref(null),
      filename = ref(null),
      csvfile = ref(null),
      csvfiles = [
        {
          value: "fasitm",
          label: "FAS Item",
        },
      ],
      companies = ["ABC"];
    const onSubmit = async () => {
      //   console.log("csv", csvfile.value);
      // sample test only to import ordhdr

      try {
        if (csvfile.value[0].orl_upi == "upi") {
          csvfile.value.shift();
        }
        if (selected.value.value == "fasitm")
          csvfile.value.forEach((row) => {
            row.company = company.value;
            row.fas_id = row.poRef + "_" + row.woRef + "_" + row.itemNum;
            row.orl_upi = row.orl_upi == "" ? null : row.orl_upi;
            row.invDate = row.invDate == "" ? null : row.invDate;
            row.invRef = row.invRef == "" ? null : row.invRef;
            row.poRef = row.poRef == "" ? null : row.poRef;
            row.woRef = row.woRef == "" ? null : parseInt(row.woRef);
            row.itemNum = row.itemNum == "" ? null : row.itemNum;
            row.itemName = row.itemName == "" ? null : row.itemName;
            row.invAmt = row.invAmt == "" ? null : parseFloat(row.invAmt);
            row.shipDate = row.shipDate == "" ? null : row.shipDate;
            row.containerRef = row.containerRef == "" ? null : row.containerRef;
          });
        showLoader();
        let res = await customLogic(
          selected.value.value,
          csvfile.value,
          filename.value
        );
        hideLoader();
        if (res) {
          notifySuccess(res.success + " imported");
          company.value = null;
          selected.value = null;
          filename.value = null;
          csvfile.value = null;
        }
      } catch (e) {
        hideLoader();
        notifyError(e);
      }
    };

    const setFileName = (e) => {
      filename.value = e.target.files[0].name;
      console.log(filename.value);
    };
    return {
      allOrders,
      onSubmit,
      company,
      selected,
      csvfile,
      csvfiles,
      companies,
      filename,
      setFileName,
    };
  },
});
</script>

<style scoped>
.card-height {
  height: 150px;
}
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
