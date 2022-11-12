import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
    $("#modaleFile")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );
    $("#modaleFile").modal("show");
  };

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()

        .then((snapshot) => {
          const bills = snapshot

            .sort((object1, object2) => {
              //To sort the bills by their date in descending order: most recent to oldest
              return new Date(object2.date) - new Date(object1.date);
            })
            .filter((billObject) => {
              const billObjectValuesArray = Object.values(billObject);

              const amountOfPropertiesInObject = billObjectValuesArray.length;

              let counterOfDefinedProperties = 0;

              for (const property in billObject) {
                const value = billObject[property];

                const propertyIsNotAComment =
                  property !== "commentary" && property !== "commentAdmin";

                const valueOfPropertyIsDefined = !!value && value !== "null";

                if (propertyIsNotAComment && valueOfPropertyIsDefined) {
                  counterOfDefinedProperties++;
                }
              }

              const allMandatoryValuesAreDefined =
                //We're excluding the comments from the employee and the comments from the admin, hence why we remove 2
                counterOfDefinedProperties === amountOfPropertiesInObject - 2;
              if (allMandatoryValuesAreDefined) {
                return billObject;
              }
            })
            .map((doc) => {
              try {
                return {
                  ...doc,
                  date: formatDate(doc.date),
                  status: formatStatus(doc.status),
                };
              } catch (e) {
                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                // log the error and return unformatted date in that case
                console.log(e, "for", doc);
                return {
                  ...doc,
                  date: doc.date,
                  status: formatStatus(doc.status),
                };
              }
            });
          console.log("length", bills.length, { bills });
          return bills;
        });
    }
  };
}
