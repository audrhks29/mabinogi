import { ColumnDef } from "@tanstack/react-table";

import convertToKoreanTime from "../convertToKoreanTime";

function highlightText(text: string, inputText: { id: string; value: string }[]) {
  const searchKeyword = inputText[0]?.value;

  if (!searchKeyword) {
    return <span>{text}</span>;
  } else {
    const parts = text.split(new RegExp(`(${inputText[0].value})`, "gi"));

    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === searchKeyword.toLowerCase() ? (
            <span key={index} className={`bg-yellow-300 text-black`}>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </span>
    );
  }
}

export const columns = (inputText: { id: string; value: string }[]): ColumnDef<HornListTypes, any>[] => [
  {
    accessorKey: "date_send",
    header: "날짜",
    cell: props => (
      <span className="text-center">
        {convertToKoreanTime(props.getValue()).formattedDate}
        <br />
        {convertToKoreanTime(props.getValue()).formattedTime}
      </span>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "character_name",
    header: "닉네임",
    cell: props => <span>{props.getValue()}</span>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "message",
    header: "내용",
    cell: props => <span>{highlightText(props.getValue(), inputText)}</span>,
    enableColumnFilter: true,
  },
];
