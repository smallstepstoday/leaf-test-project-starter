import { FC } from "react";
import design from "./design.png";
import CalenderEvent from "./CalendarEvent";
import { ConfigProvider } from "antd";

const App: FC = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
      <CalenderEvent />
      <img src={design} alt="design" className="design-image" />
    </ConfigProvider>
  );
};

export default App;
