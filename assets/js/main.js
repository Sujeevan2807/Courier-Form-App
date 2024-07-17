import JustValidate from "just-validate";
import { rule } from "postcss";
import * as myDay from "dayjs";
import dayjs from "dayjs";
import {formatMyDate} from "./utils"

const formEl = document.querySelector("#courier-form");

const localStorageKey = "Courier Form Data";

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

  const formEntriesData = Object.fromEntries(formData.entries());

  const formEntryDataArray = [];

  const getLocalStorageData = localStorage.getItem(localStorageKey);

  const formEntryDataObj = JSON.parse(getLocalStorageData);

  if (formEntryDataObj) {
    formEntryDataObj.push(formEntriesData);
    localStorage.setItem(localStorageKey, JSON.stringify(formEntryDataObj));
  } else {
    formEntryDataArray.push(formEntriesData);
    localStorage.setItem(localStorageKey, JSON.stringify(formEntryDataArray));
  }
  alert("Form submited succesfully");
  formEl.reset();
});

function getAllCourierData() {
  const courierData = localStorage.getItem(localStorageKey);

  const courierDataArr = JSON.parse(courierData);

  if (courierDataArr) {
    const tableCardEl = document.querySelector("#tableCard");

    tableCardEl.classList.remove("hidden");
    const dataTableEl = document.querySelector("#courier-data-table");

    const finalData = courierDataArr
      .map((courierData) => {
        return `
            <tr>
                <td class="table-row-style">${courierData.name}</td>
                <td class="table-row-style">${courierData.number}</td>
                <td class="table-row-style">${formatMyDate(courierData.date)}</td>
                <td class="table-row-style">${courierData.address}</td>
                <td class="table-row-style">
                    <button
                        type="button" class="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
                    Delete
                    </button>
                </td>
            </tr>
            `;
      })
      .join(" ");
    dataTableEl.innerHTML += finalData;
  } else {
    console.log("No Values in Local Storage");
  }
}

getAllCourierData();

