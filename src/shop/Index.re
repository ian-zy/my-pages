type state = {
  count: int,
  show: bool,
};

type action =
  | Click
  | Toggle;

let component = ReasonReact.reducerComponent("Shop");
let make = _children => {
  ...component,
  initialState: () => {count: 0, show: false},
  reducer: (action, state) =>
    switch (action) {
    | Click => ReasonReact.Update({...state, count: state.count + 1})
    | Toggle => ReasonReact.Update({...state, show: !state.show})
    },
  render: self => {
    let message =
      "You've clicked me " ++ string_of_int(self.state.count) ++ " times!";
    <div>
      <p> {ReasonReact.string(message)} </p>
      <Button text="Click Me" onClick={_event => self.send(Click)} />
      {self.state.show ?
         <div> {ReasonReact.string("Welcome to the shop!")} </div> :
         ReasonReact.null}
      <Button text="Toggle" onClick={_event => self.send(Toggle)} />
    </div>;
  },
};

let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make([||]));