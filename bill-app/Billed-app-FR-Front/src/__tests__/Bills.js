/**
 * @jest-environment jsdom
 */

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

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //
      expect(windowIcon.classList.value).toMatch("active-icon");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      //
      expect(dates).toEqual(datesSorted);
    });

    test("The button to create new bills should be present and redirect the user to another page", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const buttonNewBill = screen.getByTestId("btn-new-bill");

      expect(buttonNewBill).not.toBeNull();

      console.log(
        buttonNewBill.textContent,
        "=== 'Nouvelle note de frais'?",
        buttonNewBill.textContent === "Nouvelle note de frais"
      );

      expect(buttonNewBill.textContent).toBe("Nouvelle note de frais");

      fireEvent.click(buttonNewBill);
      //we redirect the user
      expect(document.body.innerHTML).not.toBe(BillsUI({ data: bills }));
    });
  });

  describe("When the eye icon is clicked", () => {
    test("A dialog window with the image of the bill should open", () => {
      window = { ...window, localStorage: localStorageMock };

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.body.innerHTML = BillsUI({ data: bill });

      const tableBody = screen.getByTestId("tbody");

      const tableRow = tableBody.querySelector("tr");

      expect(tableRow).not.toBeNull();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = bills;
      const firstBill = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      $.fn.modal = jest.fn();
      const eyeIcon = screen.getByTestId("icon-eye");

      expect(eyeIcon).not.toBeNull();

      const handleClickIconEye = jest.fn(firstBill.handleClickIconEye(eyeIcon));
      eyeIcon.addEventListener("click", handleClickIconEye);

      fireEvent.click(eyeIcon);

      expect(handleClickIconEye).toHaveBeenCalled();

      const dialogModal = screen.getByTestId("billModal");
      expect(dialogModal).not.toBeNull();
    });
  });
});
