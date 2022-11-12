import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    fileInput.addEventListener("change", this.handleChangeFile);
    //
    this.file = null;
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    //
    new Logout({ document, localStorage, onNavigate });
  }

  handleChangeFile = (e) => {
    e.preventDefault();

    const inputFile = this.document.querySelector(`input[data-testid="file"]`);

    const file = inputFile.files[0];

    //If no file was added
    if (!file) {
      console.log("No file was added");
      return;
    }

    this.file = file;
    console.log(
      "%cthis.file:",
      "background: darkblue; padding: 5px;",
      this.file
    );

    //To check if the file sent is an image and the format of the image is acceptable
    let fileIsAnImageWithAcceptableFormat =
      file.type.includes("image/png") ||
      file.type.includes("image/jpg") ||
      file.type.includes("image/jpeg");

    if (fileIsAnImageWithAcceptableFormat) {
      console.log(
        "%cFile type is an image with an acceptable format",
        "font-size:20px; padding: 5px; background: green"
      );
    } else {
      console.log(
        "%cFile type is NOT an image",
        "font-size:20px; padding: 5px; background: crimson"
      );
      inputFile.value = "";
      return;
    }
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];

    const email = JSON.parse(localStorage.getItem("user")).email;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .then(({ fileUrl, key }) => {
        this.billId = key;
        this.fileUrl = `public/${key}`;
        this.fileName = fileName;
        console.log(this.fileUrl, this.fileName);
        e.preventDefault();
      })
      .catch((error) => console.error(error));
  };

  //
  handleSubmit = (e) => {
    e.preventDefault();

    const userInfos = JSON.parse(localStorage.getItem("user"));

    const valueOfEmail = userInfos.email;

    const valueOfType = e.target.querySelector(
      `select[data-testid="expense-type"]`
    ).value;

    const valueOfName = e.target.querySelector(
      `input[data-testid="expense-name"]`
    ).value;

    const valueOfAmount = e.target.querySelector(
      `input[data-testid="amount"]`
    ).valueAsNumber;

    const valueOfDate = e.target.querySelector(
      `input[data-testid="datepicker"]`
    ).valueAsDate;

    const valueOfPercentage =
      e.target.querySelector(`input[data-testid="pct"]`).valueAsNumber || 20;
    const valueOfVAT = e.target.querySelector(
      `input[data-testid="vat"]`
    ).valueAsNumber;

    const valueOfCommentary = e.target.querySelector(
      `textarea[data-testid="commentary"]`
    ).value;

    const bill = {
      email: valueOfEmail,
      type: valueOfType,
      name: valueOfName,
      amount: valueOfAmount,
      date: valueOfDate,
      vat: valueOfVAT,
      pct: valueOfPercentage,
      commentary: valueOfCommentary,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };

    let propertiesAreDefined = false;
    let counterOfDefinedProperties = 0;

    for (const property in bill) {
      console.log(
        property,
        "has a value of → ",
        typeof bill[property] === "string"
          ? `"${bill[property]}"`
          : bill[property]
      );

      if (property === "commentary") {
        continue;
      }

      const propertyIsNotUndefined = !!bill[property];

      if (propertyIsNotUndefined) {
        counterOfDefinedProperties++;
        continue;
      } else {
        break;
      }
    }

    const amountOfPropertiesInBill = Object.keys(bill).length;

    //Verifies if all the propertied are defined
    //PS: We don't want to count the comment as a property that must be defined, so that's why remove 1
    counterOfDefinedProperties === amountOfPropertiesInBill - 1
      ? (propertiesAreDefined = true)
      : (propertiesAreDefined = false);

    //Depending on whether all the properties in the bill object are defined or not, the bill will or won't be sent to the Back-end
    if (propertiesAreDefined) {
      console.log({ propertiesAreDefined }, "✔");
      this.updateBill(bill);
      this.onNavigate(ROUTES_PATH["Bills"]);
    } else {
      console.log({ propertiesAreDefined }, "❌");
      return;
    }
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    console.log("this.store:\n", this.store);
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
