import React, { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => ReactNode;
  className?: string;
  noDataMessage?: string;
  isLoading?: boolean;
  loadingRows?: number;
}

export const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  className = '',
  noDataMessage = 'No data available',
  isLoading = false,
  loadingRows = 3,
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            // Loading state
            Array.from({ length: loadingRows }).map((_, index) => (
              <tr key={`loading-${index}`} className="animate-pulse">
                {Array.from({ length: headers.length }).map((_, cellIndex) => (
                  <td key={`loading-cell-${cellIndex}`} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};