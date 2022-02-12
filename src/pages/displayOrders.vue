
<template>
  <q-page className="background">
    <h4 className=" no-margin q-pa-xl text-white text-center font-change">
      Order Details
    </h4>
    <q-form @submit.prevent="datechecker">
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
        <q-badge color="blue-4">Start Date : </q-badge>
        <q-input v-model="startdate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" round color="primary">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="startdate" mask="DD-MM-YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-badge color="blue-4" class="q-my-md">End Date : </q-badge>
        <q-input v-model="enddate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" round color="primary">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="enddate" mask="DD-MM-YYYY">
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
    <div class="q-pa-xl">
      <q-table
        v-if="datecheck"
        class="q-ma-xl"
        flat
        title="All Orders"
        :rows="display"
        row-key="ord_id"
        :pagination="{ rowsPerPage: 25 }"
        :rows-per-page-options="[25, 50, 100]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th>
              <body>
                Details
              </body>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                color="blue"
                round
                dense
                @click="checkcomment(props.cols[0].value)"
                icon="chat_bubble_outline"
              />
            </q-td>

            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn
                color="blue-6"
                @click="seeDetails(props.cols[0].value)"
                label="See Details"
              />
            </q-td>
          </q-tr>

          <q-dialog v-model="checkDetails">
            <q-card class="q-pa-lg">
              <h6 class="font-change">Details are</h6>
              <q-card-section class="text-grey-6">
                <body>
                  customer ID : {{ details.cus_id }}
                </body>
                <body>
                  customer first Name: {{ details.cus_fname }}
                </body>
                <body>
                  customer last Name: {{ details.cus_lname }}
                </body>
                <body>
                  Company Name: {{ details.company }}
                </body>
                <body>
                  order ID is : {{ details.ord_id }}
                </body>
                <body>
                  order name is : {{ details.ord_name }}
                </body>
                <body>
                  order number is : {{ details.ord_num }}
                </body>
                <body>
                  order amount discount is : {{ details.ord_amtDisc }}
                </body>
                <body>
                  order amount Refund is : {{ details.ord_amtRefund }}
                </body>
                <body>
                  order amount Ship is : {{ details.ord_amtShip }}
                </body>
                <body>
                  order amount Tax is : {{ details.ord_amtTax }}
                </body>
                <body>
                  order amount Total is : {{ details.ord_amtTotal }}
                </body>
                <body>
                  order created on : {{ details.ord_createAt }}
                </body>
                <body>
                  order updated on : {{ details.ord_updateAt }}
                </body>
                <body>
                  order pay Amount is : {{ details.ord_payAmt }}
                </body>
                <body>
                  order pay Gate is : {{ details.ord_payGate }}
                </body>
                <body>
                  order pay Method is : {{ details.ord_payMeth }}
                </body>
                <body>
                  order pay Reference is : {{ details.ord_payRef }}
                </body>
                <body>
                  order pay Type is : {{ details.ord_payType }}
                </body>
                <body>
                  order status is : {{ details.ord_status }}
                </body>
                <body>
                  order cancel on : {{ details.ord_cancelAt }}
                </body>
                <body>
                  order closed on : {{ details.ord_closeAt }}
                </body>
                <body v-if="details.ordtrl">
                  order trial : true
                </body>
                <body v-else>
                  order trial : false
                </body>
                <q-table
                  class="q-ma-xl"
                  flat
                  title="All Order Items"
                  :rows="details.orditm"
                  :pagination="{ rowsPerPage: 25 }"
                  :rows-per-page-options="[25, 50, 100]"
                />
                <div>
                  <body class="text-weight-bolder text-black">
                    Comments :
                  </body>
                  <body v-if="details.comments">
                    <body
                      v-for="comment in details.comments"
                      :key="comment.created"
                    >
                      {{ comment.comment }} ,
                    </body>
                  </body>
                  <body v-else>
                    No comment added till now
                  </body>
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="comment">
            <q-card class="q-pa-lg">
              <q-card-section>
                <q-input
                  v-model="commentValue"
                  label="Add your Comment"
                ></q-input>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="OK"
                  color="primary"
                  @click="updateRow"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import moment from "moment";

const {
  post,
  getById,
  update,
  list,
  createOrUpdate,
  customLogic,
  getByDate,
  getCommentsById,
} = useApi();
export default {
  name: "displayOrder",

  setup() {
    const { notifyError, notifySuccess, showLoader, hideLoader } = useNotify();

    const companies = ref(["ABC"]),
      datecheck = ref(false),
      selected = ref(""),
      enddate = ref(moment().format("DD-MM-YYYY")),
      startdate = ref(moment().subtract(7, "days").format("DD-MM-YYYY")),
      display = ref([]),
      comment = ref(false),
      commentValue = ref(""),
      order_id = ref(null),
      details = ref(null),
      checkDetails = ref(false),
      commentDetails = ref(null);

    const datechecker = async () => {
      try {
        datecheck.value = true;
        showLoader();
        display.value = await getByDate(
          "ordhdr",
          startdate.value,
          enddate.value,
          selected.value
        );
        console.log(display.value);
        hideLoader();
      } catch (error) {
        notifyError(error.message);
      }
    };

    const checkcomment = (value) => {
      comment.value = true;
      order_id.value = value;
    };

    const seeDetails = async (value) => {
      try {
        showLoader();
        details.value = await getById("ordhdr", value);
        //commentDetails.value=await getCommentsById('ordhdr',value);
        hideLoader();
        checkDetails.value = true;
        //console.log(commentDetails.value);
        console.log(details.value);
      } catch (error) {
        notifyError(error.message);
      }
    };

    const updateRow = async () => {
      let res = await update("ordhdr", {
        comments: {
          comment: commentValue.value,
          created: moment().format("DD-MM-YYYY"),
        },
        ord_id: order_id.value,
      });
      if (res) {
        commentValue.value = "";
        notifySuccess("Updated Successfully");
      } else notifyError("Error in Updating");
    };

    return {
      companies,
      selected,
      startdate,
      display,
      comment,
      commentValue,
      enddate,
      datecheck,
      datechecker,
      updateRow,
      order_id,
      checkcomment,
      seeDetails,
      details,
      checkDetails,
      commentDetails,
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
