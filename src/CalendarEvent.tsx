import {
  ClockCircleOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Popover, PopoverStylesObj } from "@reactour/popover";
import { Button, Divider, message } from "antd";
import { SVGProps, useMemo } from "react";
import dayjs from "dayjs";

const GET_EVENT = gql`
  query GetTestEvent {
    getTestEvent {
      id
      name
      description
      dateRange {
        start
        end
        allDay
      }
    }
  }
`;

interface CalenderEventProps {}

export const CalenderEvent = (props: CalenderEventProps) => {
  const { data } = useQuery(GET_EVENT);
  const client = useApolloClient();

  const styles: PopoverStylesObj = {
    popover: (base) => ({
      ...base,
      borderRadius: "1.2rem",
      border: "#e5e5e5 solid 2px",
      boxShadow:
        "10px 30px 60px 0px rgb(0 0 0 / 10%), 10px 20px 50px 10px rgb(128 128 128 / 5%)",
      backgroundColor: "transparent",
      padding: "0",
      minWidth: "770px",
    }),
  };
  const sizes = {
    bottom: 16,
    height: 0,
    left: 195,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  const onClose = () => {
    // No requirement for context in this call
    message.success({
      content: "Event Closed",
      style: { backgroundColor: "white" },
    });
  };

  /**
   * Modifies the Apollo client cache to update the name of the event to "Canceled Test Event"
   *
   * @returns void
   */
  const handleCancelEvent = () => {
    if (!data) return;

    const cache = client.cache;
    cache.modify({
      id: cache.identify(data.getTestEvent),
      fields: {
        name: () => `Canceled Test Event`,
      },
    });
  };

  if (!data) return null;

  return (
    <Popover
      sizes={sizes}
      // position="bottom"
      padding={0}
      styles={styles}
    >
      <div>
        <TitleBlock title={data.getTestEvent.name} onClose={onClose} />
        <Divider className="ce-divider" />
        <DateRange
          start={data.getTestEvent.dateRange.start}
          end={data.getTestEvent.dateRange.end}
          allDay={data.getTestEvent.dateRange.allDay}
        />
        <Divider className="ce-divider" />
        <Description content={data.getTestEvent.description} />
        <Divider className="ce-divider" />
        <div
          style={{
            paddingBottom: "30px",
            paddingLeft: "30px",
            paddingRight: "30px",
          }}
        >
          <Button
            onClick={handleCancelEvent}
            className="button"
            danger
            style={{
              width: "100%",
              paddingTop: "40px",
              paddingBottom: "40px",
              fontSize: "24px",
              fontWeight: "bold",
              border: "none",
              boxShadow: "none",
              backgroundColor: "#f5f5f5",
            }}
          >
            Cancel Event
          </Button>
        </div>
      </div>
    </Popover>
  );
};

export default CalenderEvent;

interface TitleBlockProps {
  title: string;
  onClose: () => void;
}

const TitleBlock = ({ title, onClose }: TitleBlockProps) => {
  return (
    <div className="ce-title">
      <div className="cal">
        <div className="cal-badge" />
        {title}
      </div>
      <div className="ce-title-buttons">
        <EditOutlined />
        <CloseOutlined onClick={onClose} />
      </div>
    </div>
  );
};

const DescriptionIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 20 20"
      style={{
        display: "inline-block",
        height: "30px",
        width: "30px",
        marginRight: "30px",
      }}
      {...props}
    >
      <line x1={1} y1={4} x2={19} y2={4} strokeWidth={2} stroke="black" />
      <line x1={1} y1={10} x2={15} y2={10} strokeWidth={2} stroke="black" />
      <line x1={1} y1={16} x2={10} y2={16} strokeWidth={2} stroke="black" />
    </svg>
  );
};

interface DateRangeProps {
  start: string;
  end: string;
  allDay: boolean;
}

const DateRange = ({ start, end, allDay }: DateRangeProps) => {
  const display = useMemo(() => {
    if (allDay) return "All Day";
    const startDateTime = dayjs(start);
    const endDateTime = dayjs(end);
    return `${startDateTime.format("dddd, D MMMM, HH:mm")}-${endDateTime.format(
      "HH:MM"
    )}`;
  }, [start, end, allDay]);

  return (
    <div className="date-range">
      <ClockCircleOutlined
        style={{
          marginRight: "30px",
          fontSize: "30px",
          transform: "scaleX(-1)",
        }}
      />
      {allDay ? <span>All Day</span> : <span>{display}</span>}
    </div>
  );
};

interface DescriptionProps {
  content: string;
}

const Description = ({ content }: DescriptionProps) => {
  return (
    <div className="ce-description">
      <DescriptionIcon className="ce-desc-icon" />
      {content}
    </div>
  );
};
