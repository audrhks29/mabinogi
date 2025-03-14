import React from "react";

export default function TableSkeleton() {
  return (
    <tbody className="text-center">
      {[...Array(10)].map((_, index) => (
        <tr key={index}>
          {[2, 1, 1].map((count, countIndex) => (
            <td key={countIndex}>
              {[...Array(count)].map((_, idx) => (
                <div key={idx} className="skeleton w-3/5 h-4 m-auto mt-1"></div>
              ))}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
