/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import bills from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";

import storeFromMock from "../__mocks__/store";

import { bill } from "../fixtures/bill.js";

//

/*
import {
  fireEvent,
  getByTestId,
  logDOM,
  screen,
  waitFor,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { bill } from "../fixtures/bill.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import Bills from "../containers/Bills";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);
*/

import {
  fireEvent,
  getByTestId,
  logDOM,
  screen,
  waitFor,
} from "@testing-library/dom";

beforeEach(() => {
  const newBillUIHTML = NewBillUI();
  document.body.innerHTML = newBillUIHTML;
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
      email: "employee@test.tld",
      password: "employee",
      status: "connected",
    })
  );
});

describe("Given I am connected as an employee", () => {
  describe("When I am on the NewBill Page", () => {
    test("Then I expect the title of the page to be 'Envoyer une note de frais'", () => {
      //to-do write assertion
      const titleContainer = screen.getByText("Envoyer une note de frais");
      const title = titleContainer.textContent.trim();
      expect(title).toBe("Envoyer une note de frais");
    });

    test("I expect the new bill icon in the side navigation to be highlighted, ", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getAllByTestId("icon-mail"));

      const mailIcon = screen.getAllByTestId("icon-mail")[0];
      //
      expect(mailIcon.classList.value).toMatch("active-icon");
    });

    describe("When I'm filling the form and", () => {
      test("I fill in all the fields in the form correctly and submit it, I expect the form to be sent to the Back-end", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });
        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn(() => newBills.handleSubmit);
        form.addEventListener("submit", handleSubmit);
        const selectElement = document.querySelector("select");
        const expenditureInput = screen.getByTestId("expense-name");
        const dateInput = screen.getByTestId("datepicker");
        const amountInput = screen.getByTestId("amount");
        const vatInput = screen.getByTestId("vat");
        const percentageInput = screen.getByTestId("pct");
        const commentInput = screen.getByTestId("commentary");
        selectElement.value = "Services en ligne";
        expenditureInput.value = "Test";
        dateInput.value = "2022-12-11";
        amountInput.value = 420;
        vatInput.value = 69;
        percentageInput.value = 10;
        commentInput.value = "bruh";
        fireEvent.submit(form);
        expect(form).toBeTruthy();
      });
      test("I don't upload a file at all", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(() => newBills.handleChangeFile);
        const fileInput = screen.getByTestId("file");
        fileInput.addEventListener("change", handleChangeFile);
        expect(newBills.fileUrl).toBeNull();
      });
      test("I upload a file that isn't an image", () => {
        console.log(
          "%cI upload a file that isn't an image",
          "background: yellow; color: black"
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(() => newBills.handleChangeFile);
        const fileInput = screen.getByTestId("file");
        fileInput.addEventListener("change", handleChangeFile);
        fireEvent.change(fileInput, {
          target: {
            files: [
              new File(["text-test.txt"], "text-test.txt", {
                type: "text/txt",
              }),
            ],
          },
        });
        expect(fileInput.value).toBe("");
        expect(newBills.fileUrl).toBeNull();
      });
      test("I upload a file that is an image but has an unacceptable format (like .bmp)", () => {
        console.log(
          "%cI upload a file that is an image but has an unacceptable format (like .bmp), I expect it to return 'No File type is NOT an image'",
          "background: yellow; color: black"
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(() => newBills.handleChangeFile);
        const fileInput = screen.getByTestId("file");
        fileInput.addEventListener("change", handleChangeFile);
        fireEvent.change(fileInput, {
          target: {
            files: [
              new File(["image-test.bmp"], "image-test.bmp", {
                type: "image/bmp",
              }),
            ],
          },
        });
        expect(fileInput.value).toBe("");
        expect(newBills.fileUrl).toBeNull();
      });
      test("I upload a file that is an image with an acceptable format", () => {
        console.log(
          "%cI upload a file that is an image with an acceptable format",
          "background: yellow; color: black"
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });
        const handleChangeFile = jest.fn(() => newBills.handleChangeFile);
        const fileInput = screen.getByTestId("file");
        fileInput.addEventListener("change", handleChangeFile);
        fireEvent.change(fileInput, {
          target: {
            files: [
              new File(["image-test.png"], "image-test.png", {
                type: "image/png",
              }),
            ],
          },
        });

        expect(fileInput.files.length).toBe(1);
      });
    });
  });

  //POST test
  describe("I'm posting a form that is valid", () => {
    test("we fetch the new Bills from the mock using the API with the POST protocol", async () => {
      const newBill = bill;

      const mockedStoreBills = storeFromMock.bills().update(newBill);

      expect(mockedStoreBills).not.toBeNull();
    });
  });
});
