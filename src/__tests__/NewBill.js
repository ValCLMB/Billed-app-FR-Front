/**
 * @jest-environment jsdom
 */

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { fireEvent, screen, getBytestId } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

const onNavigate = (pathname) => {
  window.location.innerHTML = ROUTES({ pathname });
};

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock }); // Set localStorage
  window.localStorage.setItem(
    "user",
    JSON.stringify({ type: "Employee", email: "employe@test.ltd" })
  ); // Set user as Employee in localStorage
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can upload a file with extension png,jpg or jpeg", () => {
      document.body.innerHTML = NewBillUI();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const input = screen.getByTestId("file");
      const file = new File(["image"], "image.jpg", { type: "image/jpg" });

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      input.addEventListener("change", handleChangeFile);

      userEvent.upload(input, file);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.files[0]).toStrictEqual(file);
      expect(input.files[0].name).toBe("image.jpg");
    });

    test("Then I can't upload a file with extension different than png,jpg or jpeg", () => {
      document.body.innerHTML = NewBillUI();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const input = screen.getByTestId("file");
      input.addEventListener("change", handleChangeFile);
      userEvent.upload(
        input,
        new File(["file"], "file.txt", { type: "text/plain" })
      );
      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.value).toBe("");
    });

    test("Then I can post a new bill", () => {
      document.body.innerHTML = NewBillUI;

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      const form = screen.getByTestId("form-new-bill");

      // inputs
      const datepicker = screen.getByTestId("datepicker");
      userEvent.type(datepicker, "2022-05-02");

      const amount = screen.getByTestId("amount");
      userEvent.type(amount, "205");

      const tva = screen.getByTestId("pct");
      userEvent.type(tva, "20");

      const file = screen.getByTestId("file");
      userEvent.upload(
        file,
        new File(["image"], "image.jpg", { type: "image/jpg" })
      );

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
      expect(form).toBeTruthy();
    });
  });
});
