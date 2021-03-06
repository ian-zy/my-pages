// Generated by BUCKLESCRIPT VERSION 4.0.18, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var ReasonReact = require("reason-react/src/ReasonReact.js");
var Button$MyPages = require("../re_components/Button.bs.js");

var component = ReasonReact.reducerComponent("Shop");

function make(_children) {
  return /* record */[
          /* debugName */component[/* debugName */0],
          /* reactClassInternal */component[/* reactClassInternal */1],
          /* handedOffState */component[/* handedOffState */2],
          /* willReceiveProps */component[/* willReceiveProps */3],
          /* didMount */component[/* didMount */4],
          /* didUpdate */component[/* didUpdate */5],
          /* willUnmount */component[/* willUnmount */6],
          /* willUpdate */component[/* willUpdate */7],
          /* shouldUpdate */component[/* shouldUpdate */8],
          /* render */(function (self) {
              var message = "You've clicked me " + (String(self[/* state */1][/* count */0]) + " times!");
              var match = self[/* state */1][/* show */1];
              return React.createElement("div", undefined, React.createElement("p", undefined, message), ReasonReact.element(undefined, undefined, Button$MyPages.make("Click Me", (function (_event) {
                                    return Curry._1(self[/* send */3], /* Click */0);
                                  }), /* array */[])), match ? React.createElement("div", undefined, "Welcome to My ReasonReact shop!") : null, ReasonReact.element(undefined, undefined, Button$MyPages.make("Toggle", (function (_event) {
                                    return Curry._1(self[/* send */3], /* Toggle */1);
                                  }), /* array */[])));
            }),
          /* initialState */(function (param) {
              return /* record */[
                      /* count */0,
                      /* show */false
                    ];
            }),
          /* retainedProps */component[/* retainedProps */11],
          /* reducer */(function (action, state) {
              if (action) {
                return /* Update */Block.__(0, [/* record */[
                            /* count */state[/* count */0],
                            /* show */!state[/* show */1]
                          ]]);
              } else {
                return /* Update */Block.__(0, [/* record */[
                            /* count */state[/* count */0] + 1 | 0,
                            /* show */state[/* show */1]
                          ]]);
              }
            }),
          /* jsElementWrapped */component[/* jsElementWrapped */13]
        ];
}

var $$default = ReasonReact.wrapReasonForJs(component, (function (_jsProps) {
        return make(/* array */[]);
      }));

exports.component = component;
exports.make = make;
exports.$$default = $$default;
exports.default = $$default;
exports.__esModule = true;
/* component Not a pure module */
