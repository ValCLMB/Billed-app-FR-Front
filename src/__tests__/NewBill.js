/**
 * @jest-environment jsdom
 */

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
    test("Then I can upload a file with the good extension", () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: localStorageMock,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);

      const input = screen.getByTestId("file");
      input.addEventListener("change", handleChangeFile);

      fireEvent.change(input, {
        target: {
          files: [new File(["file.png"], "file.png", { type: "image/png" })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.files[0].name).toBe("file.png");
    });
  });
});
