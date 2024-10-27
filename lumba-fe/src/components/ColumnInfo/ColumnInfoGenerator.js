import React from "react";
import Numeric from "./Numeric";
import Categoric from "./Categoric";

export default function ColumnInfoGenerator({ columnInfo }) {
  const columns = Object.values(columnInfo);

  return (
    <div>
      {columns.map((column) => {
        if (["int64", "float64"].includes(column.column_type)) {
          return <Numeric key={column.column_name} column={column} />;
        } else {
          return <Categoric key={column.column_name} column={column} />;
        }
      })}
    </div>
  );
}
