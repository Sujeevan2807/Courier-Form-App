import JustValidate from "just-validate";
import { rule } from "postcss";
import * as myDay from "dayjs";
import dayjs from "dayjs";
import { formatMyDate } from "./utils";
import { v4 as uuidv4 } from "uuid";

const formEl = document.querySelector("#courier-form");

const localStorageKey = "courierData";

const validate = new JustValidate("#courier-form", {
  validateBeforeSubmitting: true,
});

validate
  .addField(
    "#nameInput",
    [
      {
        rule: "required",
      },
      {
        rule: "minLength",
        value: 3,
      },
      {
        rule: "maxLength",
        value: 20,
      },
    ],
    {
      errorLabelCssClass: ["errorLableStyle"],
      errorFieldCssClass: ["errorFieldStyle"],
    }
  )
  .addField(
    "#numberInput",
    [
      {
        rule: "required",
      },
      {
        rule: "number",
      },
    ],
    {
      errorLabelCssClass: ["errorLableStyle"],
      errorFieldCssClass: ["errorFieldStyle"],
    }
  )
  .addField(
    "#dateInput",
    [
      {
        rule: "required",
      },
    ],
    {
      errorLabelCssClass: ["errorLableStyle"],
      errorFieldCssClass: ["errorFieldStyle"],
    }
  )
  .addField(
    "#addressInput",
    [
      {
        rule: "required",
      },
    ],
    {
      errorLabelCssClass: ["errorLableStyle"],
      errorFieldCssClass: ["errorFieldStyle"],
    }
  );

validate.onSuccess(() => {
  const formData = new FormData(formEl);
  const getLocalStorageData = localStorage.getItem(localStorageKey);

  const formEntryDataObj = JSON.parse(getLocalStorageData);

  formData.append("id", uuidv4());
  formData.append("Created At", Date.now());
  const formEntriesData = Object.fromEntries(formData.entries());

  const formEntryDataArray = [];

  if (formEntryDataObj) {
    formEntryDataObj.push(formEntriesData);
    localStorage.setItem(localStorageKey, JSON.stringify(formEntryDataObj));
  } else {
    formEntryDataArray.push(formEntriesData);
    localStorage.setItem(localStorageKey, JSON.stringify(formEntryDataArray));
  }
  alert("Form submited succesfully");
  getAllCourierDatas();
  formEl.reset();
});

/* function getAllCourierData() {
  const courierData = localStorage.getItem(localStorageKey);
 
  const courierDataArr = JSON.parse(courierData);

  if (courierDataArr) {
    const tableCardEl = document.querySelector("#tableCard");
    
    tableCardEl.classList.remove("hidden");
    
    const dataTableEl = document.querySelector("#courier-data-table");
    dataTableEl.innerHTML = "";

    const finalData = courierDataArr.map((courierData, index) => {
        return `
            <tr>
                <td class="table-row-style">${index + 1}</td>
                <td class="table-row-style">${courierData.name}</td>
                <td class="table-row-style">${courierData.number}</td>
                <td class="table-row-style">${formatMyDate(courierData.date)}</td>
                <td class="table-row-style">${courierData.address}</td>
                <td class="table-row-style">
                    <button id="deleteBtn"
                        type="button" class="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
                    Delete
                    </button>
                </td>
            </tr>
            `;
            
      })
      .join(" ");
    dataTableEl.innerHTML += finalData;

    const courierDataCountEl = document.querySelector("#courierDataCount")
    courierDataCountEl.textContent = courierDataArr.length


  

    console.log(courierData);
  } else {
    console.log("No Values in Local Storage");
  }
} */

function getAllCourierDatas() {
  // Get all stored courier datas which are available in localStorage
  const courierData = localStorage.getItem(localStorageKey);

  const courierDataArr = JSON.parse(courierData);

  if (courierDataArr) {
    const courierCardEl = document.querySelector("#tableCard");
    courierCardEl.classList.remove("hidden");

    if (courierDataArr && courierDataArr.length > 0) {
      courierCardEl.classList.remove("hidden");
      //   write those values into the table ui.
      const tableEl = document.querySelector("#courier-data-table");

      tableEl.innerHTML = "";
      const newFinalValue = [];
      courierDataArr.map((courierData, index) => {
        const trEl = document.createElement("tr");
        const tdEl = document.createElement("td");
        const tdCustomerNoEl = document.createElement("td");
        const td2El = document.createElement("td");
        const td3El = document.createElement("td");
        const td4El = document.createElement("td");
        const td5El = document.createElement("td");
        const deleteBtnEl = document.createElement("button");
        tdCustomerNoEl.classList.add("px-2", "py-1", "border");
        tdCustomerNoEl.textContent = index + 1;
        tdEl.classList.add("px-2", "py-1", "border");
        tdEl.textContent = courierData.name;
        td2El.classList.add("px-2", "py-1", "border");
        td2El.textContent = courierData.number;
        td3El.classList.add("px-2", "py-1", "border");
        td3El.textContent = formatMyDate(courierData["date"]);
        td4El.classList.add("px-2", "py-1", "border");
        td4El.textContent = courierData["address"];
        deleteBtnEl.className =
          "px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm";
        deleteBtnEl.textContent = "Delete";

        deleteBtnEl.addEventListener("click", (e) => {
          deleteCourierRequest(courierData);
        });

        td5El.classList.add("px-2", "py-1", "border");
        td5El.append(deleteBtnEl);

        trEl.append(tdCustomerNoEl, tdEl, td2El, td3El, td4El, td5El);
        newFinalValue.push(trEl);
      });
      newFinalValue.forEach((el) => tableEl.append(el));
      // display the UI with those datas.
      const courierCountEl = document.querySelector("#courierDataCount");
      courierCountEl.textContent = newFinalValue.length;
    } else {
      courierCardEl.classList.add("hidden");

      console.log("No value available on localStorage");
    }
  }else{
    courierCardEl.classList.add("hidden");
  }
}

function deleteCourierRequest(courierRequest) {
  const confirmation = confirm(
    `Do you want to delete '${courierRequest["name"]}' record?`
  );

  if (confirmation) {
    const existingCourierData = localStorage.getItem(localStorageKey);
    const courierDataObj = JSON.parse(existingCourierData);

    const otherRecords = courierDataObj.filter(
      (courierReq) => courierReq.id != courierRequest["id"]
    );

     // Push it to localstorage again, this time, i'm deleting that record (courierRequestId)
     localStorage.setItem(localStorageKey, JSON.stringify(otherRecords));

     getAllCourierDatas();
  }
}

/* getAllCourierData(); */

getAllCourierDatas();
