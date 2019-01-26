let component = ReasonReact.statelessComponent("Button");

let style = ReactDOMRe.Style.make(
  ~color="#444444",
  ~fontSize="12px",
  ~borderWidth="0",
  ()
);

let make = (~text, ~onClick, _children) => {
  ...component,
  render: _self => <button style=style onClick=onClick>(ReasonReact.string(text))</button>
}
