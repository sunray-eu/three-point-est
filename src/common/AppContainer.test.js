import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, fireEvent, cleanup } from "@testing-library/react";

import AppContainer from "./AppContainer";
import reducer from "../reducers";

function renderWithRedux(
  ui,
  { initialState, store = createStore(reducer, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
}

afterEach(cleanup);

test("renders initial task and allows a new task to be added", () => {
  const { getByText, getByDisplayValue } = renderWithRedux(<AppContainer />);

  // check if initially, one task is there
  expect(getByDisplayValue("Task 1")).toBeDefined();

  // allow another task to be added
  fireEvent.click(getByText("Add New Task"));
  expect(getByDisplayValue("Task 2")).toBeDefined();
});

test("check calculations for a single task", () => {
  const { getByPlaceholderText } = renderWithRedux(<AppContainer />);

  fireEvent.change(getByPlaceholderText("Best Case"), {
    target: { value: "10" }
  });
  fireEvent.change(getByPlaceholderText("Most Likely"), {
    target: { value: "15" }
  });
  fireEvent.change(getByPlaceholderText("Worst Case"), {
    target: { value: "20" }
  });

  // check if the Estimate input displays correct value
  expect(getByPlaceholderText("Estimate").value).toBe("15.00");
});

test("check sums are correct", () => {
  const { getByText, getAllByPlaceholderText, getByTestId } = renderWithRedux(
    <AppContainer />
  );

  fireEvent.click(getByText("Add New Task"));
  fireEvent.click(getByText("Add New Task"));

  const bestCases = getAllByPlaceholderText("Best Case");
  const mostLikelies = getAllByPlaceholderText("Most Likely");
  const worstCases = getAllByPlaceholderText("Worst Case");

  // check if 3 inputs have been added
  expect(bestCases.length).toBe(3);

  bestCases.forEach(bc => {
    fireEvent.change(bc, {
      target: { value: "10" }
    });
  });

  mostLikelies.forEach(ml => {
    fireEvent.change(ml, {
      target: { value: "15" }
    });
  });

  worstCases.forEach(wc => {
    fireEvent.change(wc, {
      target: { value: "20" }
    });
  });

  // check total tasks and total estimate
  expect(getByTestId("Total Tasks").innerText).toBe("3");
  expect(getByTestId("Total Estimate").innerText).toBe("45.00");
});

test("duplicate task button duplicates a task", () => {
  const { getByText, getByDisplayValue, getAllByText } = renderWithRedux(<AppContainer />);

  // Initially one task with name "Task 1"
  expect(getByDisplayValue("Task 1")).toBeDefined();

  // Find and click the duplicate button (it has the text "Duplicate")
  fireEvent.click(getByText("Duplicate"));

  // The duplicate should have a name prefixed with "Copy of"
  expect(getByDisplayValue("Copy of Task 1")).toBeDefined();
});
