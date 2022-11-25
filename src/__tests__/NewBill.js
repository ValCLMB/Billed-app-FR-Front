/**
 * @jest-environment jsdom
 */

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { fireEvent, screen, getBytestId } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage";

jest.mock("../app/Store", () => mockStore);

const onNavigate = (pathname) => {
  window.location.innerHTML = ROUTES({ pathname });
};

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock }); // Set localStorage
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee" })); // Set user as Employee in localStorage
  document.body.innerHTML = NewBillUI();
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't upload a file with extension different than png,jpg or jpeg", () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: localStorageMock,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);

      const input = screen.getByTestId("file");
      input.addEventListener("change", handleChangeFile);

      userEvent.upload(
        input,
        new File(["file.txt"], "file.txt", { type: "text/plain" })
      );

      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.value).toBe("");
    });
  });
});
