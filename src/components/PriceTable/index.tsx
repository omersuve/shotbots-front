import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface IData {
  name: string;
  price: string;
  volume: string;
}

interface PaginatedTableProps {
  data: IData[];
}

const PriceTable: React.FC<PaginatedTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 6;

  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const endIndex: number = startIndex + itemsPerPage;

  const [currentData, setCurrentData] = useState<IData[]>(data.slice(startIndex, endIndex));

  const [search, setSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(data.length / itemsPerPage));

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setCurrentData(data.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage))
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      setCurrentData(data.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage))
    }
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setCurrentData(data.slice((currentPage - 2) * itemsPerPage, (currentPage - 2) * itemsPerPage + itemsPerPage))
    }
  };

  useEffect(() => {
    const result = data.filter((item) => {
      return search.toLowerCase() === ""
        ? item
        : item.name.toLowerCase().startsWith(search);
    })
    setCurrentData(result.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(result.length / itemsPerPage))
  }, [search]);

  useEffect(() => {
    const links = document.querySelectorAll(".pagination-link");
    links.forEach((link) => {
      link.classList.remove("bg-yellow-100");
      if (parseInt(link.textContent as string) === currentPage) {
        link.classList.add("bg-yellow-100");
      }
    });
  }, [currentPage]);

  return (
    <div className="relative" style={{ height: "480px" }}>
      <Form>
        <InputGroup className="my-3">
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Cryptocurrency"
            className="p-2"
          />
        </InputGroup>
      </Form>
      <div className="relative">
        <div className="w-full rounded-xl">
          <table className="divide-y divide-gray-200 table-auto">
            <thead
              className="text-xs font-medium tracking-wider text-left text-white uppercase bg-yellow-600 whitespace-nowrap">
            <tr className="py-4 divide-x">
              <th scope="col" className="sticky left-0 z-10 p-4 bg-yellow-600 w-44">
                Name
              </th>
              <th scope="col" className="p-4 w-44">
                Price
              </th>
              <th scope="col" className="p-4 w-44">
                Volume
              </th>
            </tr>
            </thead>
            <tbody className="text-sm bg-yellow-50 divide-y divide-gray-200 whitespace-nowrap">
            {currentData.filter((item) => {
              return search.toLowerCase() === ""
                ? item
                : item.name.toLowerCase().startsWith(search);
            }).map((item: IData, index: number) => (
              <tr key={index}>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.price}</td>
                <td className="p-4">{item.volume}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="absolute bottom-0 left-0">
        <nav className="relative z-0 inline-flex -space-x-px shadow-sm h-8" aria-label="Pagination">
          <a
            href="#"
            className={`relative inline-flex items-center px-2 py-2 text-base font-medium text-gray-500 bg-yellow-50 border border-gray-300 rounded-l-md hover:bg-yellow-100 pagination-link`}
            onClick={handlePrevPage}
          >
            <span className="sr-only">Previous</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 aria-hidden="true">
              <path fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"></path>
            </svg>
          </a>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page: number) => (
            <a
              href="#"
              key={page}
              className={`relative inline-flex items-center px-4 py-2 text-base font-medium text-gray-700 bg-yellow-50 border border-gray-300 hover:bg-yellow-100 pagination-link ${
                page + 1 === currentPage ? "bg-yellow-100" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </a>
          ))}
          <a
            href="#"
            className={`relative inline-flex items-center px-2 py-2 text-base font-medium text-gray-500 bg-yellow-50 border border-gray-300 rounded-r-md hover:bg-yellow-100 pagination-link`}
            onClick={handleNextPage}
          >
            <span className="sr-only">Next</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 aria-hidden="true">
              <path fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"></path>
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default PriceTable;
