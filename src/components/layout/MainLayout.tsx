import { Layout, Model, TabNode } from "flexlayout-react";
import "flexlayout-react/style/dark.css";

import MapPanel from "../panels/MapPanel";
import UnitInfoPanel from "../panels/UnitInfoPanel";
import DataLogPanel from "../panels/DataLogPanel";
import ControlsPanel from "../panels/ControlsPanel";

const layout = {
  global: { tabEnableFloat: true, splitterSize: 0, tabEnableClose: false },
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "row",
        weight: 80,
        children: [
          {
            type: "tabset",
            weight: 75,
            children: [{ type: "tab", name: "Mapa", component: "map" }],
          },
          {
            type: "tabset",
            weight: 20,
            children: [{ type: "tab", name: "Log", component: "datalog" }],
          },
        ],
      },
      {
        type: "column",
        weight: 20,
        children: [
          {
            type: "tabset",
            weight: 20,
            children: [
              { type: "tab", name: "Info o jednotce", component: "unitInfo" },
            ],
          },
          {
            type: "tabset",
            weight: 20,
            children: [
              { type: "tab", name: "Ovládání", component: "controls" },
            ],
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(layout);

const MainLayout = () => {
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    if (component === "map") return <MapPanel />;
    if (component === "unitInfo") return <UnitInfoPanel />;
    if (component === "datalog") return <DataLogPanel />;
    if (component === "controls") return <ControlsPanel />;

    return null;
  };

  return <Layout model={model} factory={factory} />;
};

export default MainLayout;
