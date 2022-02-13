<template>
  <q-page class="background">
    <h4 class="no-margin q-pa-xl text-white text-center font-change">
      Order Data
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
        <div v-if="selected.value == 'ordhdr'" class="q-px-xl">
          <b>Order Headers </b><br />
          <vue-csv-import
            v-model="csvfile"
            :fields="{
              ord_id: { required: true, label: 'ord_id' },
              ord_num: { required: true, label: 'ord_num' },
              ord_name: { required: true, label: 'ord_name' },
              ord_createAt: { required: true, label: 'ord_createAt' },
              ord_updateAt: { required: true, label: 'ord_updateAt' },
              ord_closeAt: { required: true, label: 'ord_closeAt' },
              ord_amtTotal: { required: true, label: 'ord_amtTotal' },
              ord_amtDisc: { required: true, label: 'ord_amtDisc' },
              ord_amtTax: { required: true, label: 'ord_amtTax' },
              ord_amtShip: { required: true, label: 'ord_amtShip' },
              ord_amtRefund: { required: true, label: 'ord_amtRefund' },
              ord_payAmt: { required: true, label: 'ord_payAmt' },
              ord_payMeth: { required: true, label: 'ord_payMeth' },
              ord_payType: { required: true, label: 'ord_payType' },
              ord_payGate: { required: true, label: 'ord_payGate' },
              ord_payRef: { required: true, label: 'ord_payRef' },
              cus_id: { required: true, label: 'cus_id' },
              cus_fname: { required: true, label: 'cus_fname' },
              cus_lname: { required: true, label: 'cus_lname' },
              ord_status: { required: true, label: 'ord_status' },
              ord_cancelAt: { required: true, label: 'ord_cancelAt' },
            }"
          >
            <vue-csv-toggle-headers />
            <vue-csv-errors />
            <vue-csv-input @change="setFileName" />
            <vue-csv-map />
          </vue-csv-import>
        </div>
        <div v-if="selected.value == 'fasitm'" class="q-px-xl">
          <b>FAS Lines </b><br />
          <vue-csv-import
            v-model="csvfile"
            :fields="{
              upi: { required: true, label: 'upi' },
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
        <div v-if="selected.value == 'orditm'" class="q-px-xl">
          <b>Order Lines</b><br />
          <vue-csv-import
            v-model="csvfile"
            :fields="{
              ord_id: { required: true, label: 'ord_id' },
              ord_num: { required: true, label: 'ord_num' },
              orl_id: { required: true, label: 'orl_id' },
              orl_item_name: { required: true, label: 'orl_item_name' },
              orl_prod_id: { required: true, label: 'orl_prod_id' },
              orl_price: { required: true, label: 'orl_price' },
              orl_refund: { required: true, label: 'orl_refund' },
              orl_tax: { required: true, label: 'orl_tax' },
              orl_disc: { required: true, label: 'orl_disc' },
              orl_upi: { required: true, label: 'orl_upi' },
              orl_sku: { required: true, label: 'orl_sku' },
              orl_sku1: { required: true, label: 'orl_sku1' },
              orl_sku2: { required: true, label: 'orl_sku2' },
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
        class="q-ma-xl"
        v-if="selected.value == 'ordhdr'"
        flat
        title="Import Preview"
        :rows="csvfile"
        row-key="ord_id"
        :pagination="{ rowsPerPage: 25 }"
        :rows-per-page-options="[25, 50, 100]"
      >
        <template v-slot:top>
          <h5>Import Preview</h5>
          <q-space />
          <q-btn
            class="no-shadow"
            v-show="company"
            @click="onSubmit"
            color="blue-12"
            label="Import data"
          />
          <q-btn
            class="q-ml-xl no-shadow"
            color="blue-12"
            to="/display"
            label="Display Orders"
          />
        </template>
      </q-table>

      <q-table
        v-if="selected.value == 'orditm'"
        class="q-ma-xl"
        flat
        title="Import Preview"
        :rows="csvfile"
        row-key="ord_id"
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
          value: "ordhdr",
          label: "Order Header",
        },
        {
          value: "orditm",
          label: "Order Item",
        },
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
        if (
          csvfile.value[0].ord_id == "ord_id" ||
          csvfile.value[0].upi == "upi"
        ) {
          csvfile.value.shift();
        }
        if (selected.value.value == "ordhdr")
          csvfile.value.forEach((row) => {
            row.company = company.value;
            row.ord_id = row.ord_id == "" ? null : row.ord_id;
            row.ord_num = row.ord_num == "" ? null : parseInt(row.ord_num);
            row.ord_name = row.ord_name == "" ? null : row.ord_name;
            row.ord_createAt = row.ord_createAt == "" ? null : row.ord_createAt;
            row.ord_updateAt = row.ord_updateAt == "" ? null : row.ord_updateAt;
            row.ord_closeAt = row.ord_closeAt == "" ? null : row.ord_closeAt;
            row.ord_amtTotal =
              row.ord_amtTotal == "" ? null : parseFloat(row.ord_amtTotal);
            row.ord_amtDisc =
              row.ord_amtDisc == "" ? null : parseFloat(row.ord_amtDisc);
            row.ord_amtTax =
              row.ord_amtTax == "" ? null : parseFloat(row.ord_amtTax);
            row.ord_amtShip =
              row.ord_amtShip == "" ? null : parseFloat(row.ord_amtShip);
            row.ord_amtRefund =
              row.ord_amtRefund == "" ? null : parseFloat(row.ord_amtRefund);
            row.ord_payAmt =
              row.ord_payAmt == "" ? null : parseFloat(row.ord_payAmt);
            row.ord_payMeth = row.ord_payMeth == "" ? null : row.ord_payMeth;
            row.ord_payType = row.ord_payType == "" ? null : row.ord_payType;
            row.ord_payGate = row.ord_payGate == "" ? null : row.ord_payGate;
            row.ord_payRef = row.ord_payRef == "" ? null : row.ord_payRef;
            row.cus_id = row.cus_id == "" ? null : row.cus_id;
            row.cus_fname = row.cus_fname == "" ? null : row.cus_fname;
            row.cus_lname = row.cus_lname == "" ? null : row.cus_lname;
            row.ord_status = row.ord_status == "" ? null : row.ord_status;
            row.ord_cancelAt = row.ord_cancelAt == "" ? null : row.ord_cancelAt;
            // console.log("Row:", `${row.ord_id} - ${row.ord_num}`);
          });
        else if (selected.value.value == "orditm")
          csvfile.value.forEach((row) => {
            row.company = company.value;
            row.ord_id = row.ord_id == "" ? null : row.ord_id;
            row.ord_num = row.ord_num == "" ? null : parseInt(row.ord_num);
            row.orl_id = row.orl_id == "" ? null : row.orl_id;
            row.orl_item_name =
              row.orl_item_name == "" ? null : row.orl_item_name;
            row.orl_prod_id =
              row.orl_prod_id == "" ? null : parseInt(row.orl_prod_id);
            row.orl_price =
              row.orl_price == "" ? null : parseFloat(row.orl_price);
            row.orl_refund =
              row.orl_refund == "" ? null : parseFloat(row.orl_refund);
            row.orl_tax = row.orl_tax == "" ? null : parseFloat(row.orl_tax);
            row.orl_disc = row.orl_disc == "" ? null : parseFloat(row.orl_disc);
            row.orl_upi = row.orl_upi == "" ? null : row.orl_upi;
            row.orl_sku = row.orl_sku == "" ? null : row.orl_sku;
            row.orl_sku1 = row.orl_sku1 == "" ? null : row.orl_sku1;
            row.orl_sku2 = row.orl_sku2 == "" ? null : row.orl_sku2;
          });
        else if (selected.value.value == "fasitm")
          csvfile.value.forEach((row) => {
            row.company = company.value;
            row.upi = row.upi == "" ? null : row.upi;
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
