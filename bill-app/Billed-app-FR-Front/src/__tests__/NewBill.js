/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on the NewBill Page", () => {
    test("Then I expect the title of the page to be 'Envoyer une note de frais'", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      const titleContainer = screen.getByText("Envoyer une note de frais");

      const title = titleContainer.textContent.trim();

      expect(title).toBe("Envoyer une note de frais");
    });
  });
});
