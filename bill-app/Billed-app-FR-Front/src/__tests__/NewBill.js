/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import billMethods from "../__mocks__/store.js";

beforeEach(() => {
  const newBillUIHTML = NewBillUI();
  document.body.innerHTML = newBillUIHTML;
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
});

describe("Given I am connected as an employee", () => {
  describe("When I am on the NewBill Page", () => {
    test("Then I expect the title of the page to be 'Envoyer une note de frais'", () => {
      //to-do write assertion
      const titleContainer = screen.getByText("Envoyer une note de frais");
      const title = titleContainer.textContent.trim();
      expect(title).toBe("Envoyer une note de frais");
    });

    describe("When I'm filling the form and", () => {
      test("I fill in all the fields in the form correctly and submit it, I exprect the form to be sent to the Back-end", () => {
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
        console.log({ newBills, handleChangeFile, fileInput });
      });
      test("I upload a file that isn't an image, I expect it to return 'No File type is NOT an image'", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn((e) => newBills.handleChangeFile);
        const fileInput = screen.getByTestId("file");
      });
      test("I upload a file that is an image but has an unacceptable format (like .bmp)", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn((e) => newBills.handleChangeFile);
        const fileInput = screen.getByTestId("file");
      });
      test("I upload a file that is an image with an acceptable format", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBills = new NewBill({
          document,
          onNavigate,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn((e) => newBills.handleChangeFile);
        const fileInput = screen.getByTestId("file");
      });
    });
  });
});
